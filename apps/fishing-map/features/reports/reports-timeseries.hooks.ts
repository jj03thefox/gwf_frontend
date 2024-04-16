import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react'
import memoizeOne from 'memoize-one'
import { Polygon, MultiPolygon } from 'geojson'
import { useSelector } from 'react-redux'
import { atom, useAtom } from 'jotai'
import { UrlDataviewInstance, getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import { DeckLayerAtom, useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import { FourwingsLayer, FourwingsLayerProps } from '@globalfishingwatch/deck-layers'
import { FourwingsFeature, FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import {
  selectActiveReportDataviews,
  selectReportActivityGraph,
  selectReportCategory,
  selectReportTimeComparison,
} from 'features/app/selectors/app.reports.selector'
import { getUTCDateTime } from 'utils/dates'
import { filterByPolygon } from 'features/reports/reports-geo.utils'
import {
  FeaturesToTimeseriesParams,
  featuresToTimeseries,
  filterTimeseriesByTimerange,
  removeTimeseriesPadding,
} from 'features/reports/reports-timeseries.utils'
import { useReportAreaInViewport } from 'features/reports/reports.hooks'
import {
  selectReportArea,
  selectReportBufferHash,
  selectShowTimeComparison,
} from 'features/reports/reports.selectors'
import { ReportActivityGraph } from 'types'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'

export interface EvolutionGraphData {
  date: string
  min: number[]
  max: number[]
}

export interface ReportSublayerGraph {
  id: string
  legend: {
    color?: string
    unit?: string
  }
}

export type ReportGraphMode = 'evolution' | 'time'

export function getReportGraphMode(reportActivityGraph: ReportActivityGraph): ReportGraphMode {
  return reportActivityGraph === 'beforeAfter' || reportActivityGraph === 'periodComparison'
    ? 'time'
    : 'evolution'
}

export interface ReportGraphProps {
  timeseries: (EvolutionGraphData & { mode?: ReportGraphMode })[]
  sublayers: ReportSublayerGraph[]
  interval: FourwingsInterval
  mode?: ReportGraphMode
}

export const mapTimeseriesAtom = atom([] as ReportGraphProps[] | undefined)
if (process.env.NODE_ENV !== 'production') {
  mapTimeseriesAtom.debugLabel = 'mapTimeseries'
}

export const mapReportFeaturesAtom = atom<FourwingsFeature[] | undefined>(undefined)
if (process.env.NODE_ENV !== 'production') {
  mapTimeseriesAtom.debugLabel = 'mapReportFeatures'
}

export const hasMapTimeseriesAtom = atom((get) => {
  const timeseries = get(mapTimeseriesAtom)
  return timeseries && timeseries.length > 0
})

export type DateTimeSeries = {
  date: string
  values: number[]
  compareDate?: string
}[]

export function useSetTimeseries() {
  return useAtom(mapTimeseriesAtom)[1]
}

const emptyArray: UrlDataviewInstance[] = []

export const useReportFeaturesLoading = () => {
  const reportLayerInstanceLoaded = useReportInstance()?.loaded
  const areaInViewport = useReportAreaInViewport()
  return areaInViewport && !reportLayerInstanceLoaded
}

export const useReportFeaturesError = () => {
  // TODO:deck handle errors in layer instances
  const reportLayerInstanceLoaded = useReportInstance()?.loaded
  return false
}

const useReportInstance = () => {
  const currentCategoryDataviews = useSelector(selectActiveReportDataviews)
  const id = currentCategoryDataviews?.length ? getMergedDataviewId(currentCategoryDataviews) : ''
  const reportLayerInstance = useGetDeckLayer<FourwingsLayer>(id)
  return reportLayerInstance
}

const useReportTimeseries = (reportLayer: DeckLayerAtom<FourwingsLayer>) => {
  const [timeseries, setTimeseries] = useAtom(mapTimeseriesAtom)
  const area = useSelector(selectReportArea)
  const areaInViewport = useReportAreaInViewport()
  const reportGraph = useSelector(selectReportActivityGraph)
  const reportCategory = useSelector(selectReportCategory)
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const timeComparison = useSelector(selectReportTimeComparison)
  const reportBufferHash = useSelector(selectReportBufferHash)

  let compareDeltaMillis: number | undefined = undefined
  if (showTimeComparison && timeComparison) {
    const startMillis = getUTCDateTime(timeComparison.start).toMillis()
    const compareStartMillis = getUTCDateTime(timeComparison.compareStart).toMillis()
    compareDeltaMillis = compareStartMillis - startMillis
  }

  const { loaded, instance } = reportLayer || { loaded: false, instance: undefined }

  const computeTimeseries = useCallback(
    (instance: FourwingsLayer, geometry: Polygon | MultiPolygon, graphMode: ReportGraphMode) => {
      const features = instance.getData() as FourwingsFeature[]
      const filteredFeatures = filterByPolygon(
        [features],
        geometry,
        reportCategory === 'environment' ? 'point' : 'cell'
      )
      const props = instance.props as FourwingsLayerProps
      const chunk = instance.getChunk()

      const params: FeaturesToTimeseriesParams = {
        staticHeatmap: props.static,
        interval: instance.getInterval(),
        start: chunk.bufferedStart,
        end: chunk.bufferedEnd,
        aggregationOperation: props.aggregationOperation,
        minVisibleValue: props.minVisibleValue,
        maxVisibleValue: props.maxVisibleValue,
        sublayers: props.sublayers,
        showTimeComparison,
        compareDeltaMillis: compareDeltaMillis as number,
        graphMode,
      }
      const timeseries = featuresToTimeseries(filteredFeatures, params)
      setTimeseries(timeseries)
    },
    [reportCategory, showTimeComparison, compareDeltaMillis, setTimeseries]
  )

  // We need to re calculate the timeseries when area or timerange changes
  useLayoutEffect(() => {
    setTimeseries(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area?.id])

  const reportGraphMode = getReportGraphMode(reportGraph)
  useLayoutEffect(() => {
    if (timeseries!?.length > 0) {
      setTimeseries([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportGraphMode])

  useEffect(() => {
    if (loaded && area?.geometry && areaInViewport) {
      computeTimeseries(instance, area?.geometry as Polygon | MultiPolygon, reportGraphMode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, area?.geometry, areaInViewport, reportCategory, reportBufferHash, reportGraphMode])

  return timeseries
}

// Run only once in Report.tsx parent component
export const useComputeReportTimeSeries = () => {
  const reportLayer = useReportInstance()
  useReportTimeseries(reportLayer)
}

const memoizedFilterTimeseriesByTimerange = memoizeOne(filterTimeseriesByTimerange)
export const useReportFilteredTimeSeries = () => {
  const [timeseries] = useAtom(mapTimeseriesAtom)
  const { start: timebarStart, end: timebarEnd } = useSelector(selectTimeRange)
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const layersTimeseriesFiltered = useMemo(() => {
    if (!timeseries) {
      return []
    }
    if (showTimeComparison) {
      return removeTimeseriesPadding(timeseries)
    } else {
      if (timebarStart && timebarEnd && timeseries) {
        return memoizedFilterTimeseriesByTimerange(timeseries, timebarStart, timebarEnd)
      }
    }
  }, [timeseries, showTimeComparison, timebarStart, timebarEnd])
  return layersTimeseriesFiltered
}
