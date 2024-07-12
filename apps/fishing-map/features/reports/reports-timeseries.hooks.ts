import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import memoizeOne from 'memoize-one'
import { useSelector } from 'react-redux'
import { atom, useAtom, useAtomValue } from 'jotai'
import { mean, min, max } from 'simple-statistics'
import { DateTime } from 'luxon'
import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import { DeckLayerAtom, useGetDeckLayers } from '@globalfishingwatch/deck-layer-composer'
import {
  FourwingsLayer,
  FourwingsLayerProps,
  getIntervalFrames,
  sliceCellValues,
} from '@globalfishingwatch/deck-layers'
import { FourwingsFeature, FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import {
  selectActiveReportDataviews,
  selectReportActivityGraph,
  selectReportCategory,
  selectReportTimeComparison,
} from 'features/app/selectors/app.reports.selector'
import { FilteredPolygons } from 'features/reports/reports-geo.utils'
import {
  FeaturesToTimeseriesParams,
  featuresToTimeseries,
  filterTimeseriesByTimerange,
} from 'features/reports/reports-timeseries.utils'
import { useReportAreaInViewport } from 'features/reports/reports.hooks'
import {
  selectReportArea,
  selectReportBufferHash,
  selectShowTimeComparison,
} from 'features/reports/reports.selectors'
import { ReportActivityGraph, ReportCategory } from 'types'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { AreaGeometry } from 'features/areas/areas.slice'
import { useFilterCellsByPolygonWorker } from 'features/reports/reports-geo.utils.workers.hooks'

interface EvolutionGraphData {
  date: string
  min: number[]
  max: number[]
}

interface ReportSublayerGraph {
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

const mapTimeseriesAtom = atom([] as ReportGraphProps[] | undefined)
if (process.env.NODE_ENV !== 'production') {
  mapTimeseriesAtom.debugLabel = 'mapTimeseries'
}
export function useSetTimeseries() {
  return useAtom(mapTimeseriesAtom)[1]
}

const useReportInstances = () => {
  const currentCategory = useSelector(selectReportCategory)
  const currentCategoryDataviews = useSelector(selectActiveReportDataviews)
  let ids = ['']
  if (currentCategoryDataviews?.length > 0) {
    if (currentCategory === ReportCategory.Environment) {
      ids = currentCategoryDataviews.map((dataview) => dataview.id)
    } else {
      ids = [getMergedDataviewId(currentCategoryDataviews)]
    }
  }
  const reportLayerInstances = useGetDeckLayers<FourwingsLayer>(ids)
  return reportLayerInstances
}

export const useReportFeaturesLoading = () => {
  const reportLayerInstanceLoaded = useReportInstances()?.every((layer) => layer.loaded)
  const areaInViewport = useReportAreaInViewport()
  return areaInViewport && !reportLayerInstanceLoaded
}

const useReportTimeseries = (reportLayers: DeckLayerAtom<FourwingsLayer>[]) => {
  const [timeseries, setTimeseries] = useAtom(mapTimeseriesAtom)
  const [featuresFiltered, setFeaturesFiltered] = useState<FilteredPolygons[][]>([])
  const filterCellsByPolygon = useFilterCellsByPolygonWorker()
  const area = useSelector(selectReportArea)
  const areaInViewport = useReportAreaInViewport()
  const reportGraph = useSelector(selectReportActivityGraph)
  const reportCategory = useSelector(selectReportCategory)
  const timeComparison = useSelector(selectReportTimeComparison)
  const reportBufferHash = useSelector(selectReportBufferHash)
  const dataviews = useSelector(selectActiveReportDataviews)
  const timerange = useTimerangeConnect()

  const instances = reportLayers.map((l) => l.instance)
  const layersLoaded = reportLayers.every((l) => l.loaded)

  const updateFeaturesFiltered = useCallback(
    async (instances: FourwingsLayer[], polygon: AreaGeometry, mode?: 'point' | 'cell') => {
      const filteredFeaturesPromise = instances.map((instance) => {
        const features = instance.getData() as FourwingsFeature[]
        const filteredFeatures = filterCellsByPolygon({
          layersCells: [features],
          polygon,
          mode,
        })
        return filteredFeatures
      })
      const filteredFeatures = await Promise.all(filteredFeaturesPromise)
      setFeaturesFiltered(filteredFeatures)
    },
    [filterCellsByPolygon]
  )

  useEffect(() => {
    if (area?.geometry && layersLoaded && instances.length) {
      updateFeaturesFiltered(
        instances,
        area.geometry,
        reportCategory === 'environment' ? 'point' : 'cell'
      )
    } else {
      setFeaturesFiltered([])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area?.geometry, reportCategory, layersLoaded])

  const computeTimeseries = useCallback(
    (
      instances: FourwingsLayer[],
      filteredFeatures: FilteredPolygons[][],
      graphMode: ReportGraphMode
    ) => {
      const timeseries: ReportGraphProps[] = []
      instances.forEach((instance, index) => {
        const features = filteredFeatures[index]
        if (reportCategory === 'environment' && features[0].contained.length > 0) {
          const dataview = dataviews.find((dv) => dv.id === instance.id)
          const chunk = instance.getChunk()
          const { startFrame, endFrame } = getIntervalFrames({
            startTime: DateTime.fromISO(timerange.start).toUTC().toMillis(),
            endTime: DateTime.fromISO(timerange.end).toUTC().toMillis(),
            availableIntervals: [chunk.interval],
            bufferedStart: chunk.bufferedStart,
          })
          const allValues = features[0].contained.flatMap((f) => {
            const values = sliceCellValues({
              values: f.properties.values[0],
              startFrame,
              endFrame,
              startOffset: f.properties.startOffsets[0],
            })
            return values || []
          })
          if (dataview?.config && allValues.length > 0) {
            dataview.config.stats = {
              min: min(allValues),
              max: max(allValues),
              mean: mean(allValues),
            }
          }
        }
        const props = instance.props as FourwingsLayerProps
        const chunk = instance.getChunk()
        const sublayers = instance.getFourwingsLayers()
        const params: FeaturesToTimeseriesParams = {
          staticHeatmap: props.static,
          interval: instance.getInterval(),
          start: timeComparison ? props.startTime : chunk.bufferedStart,
          end: timeComparison ? props.endTime : chunk.bufferedEnd,
          compareStart: props.compareStart,
          compareEnd: props.compareEnd,
          aggregationOperation: props.aggregationOperation,
          minVisibleValue: props.minVisibleValue,
          maxVisibleValue: props.maxVisibleValue,
          sublayers,
          graphMode,
        }
        timeseries.push(featuresToTimeseries(features, params)[0])
      })
      setTimeseries(timeseries)
    },
    [dataviews, reportCategory, setTimeseries, timeComparison, timerange.end, timerange.start]
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

  const timeComparisonHash = timeComparison ? JSON.stringify(timeComparison) : undefined
  useEffect(() => {
    if (layersLoaded && featuresFiltered?.length && areaInViewport) {
      computeTimeseries(instances, featuresFiltered, reportGraphMode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    layersLoaded,
    featuresFiltered,
    areaInViewport,
    reportCategory,
    reportBufferHash,
    reportGraphMode,
    timeComparisonHash,
  ])

  return timeseries
}

// Run only once in Report.tsx parent component
export const useComputeReportTimeSeries = () => {
  const reportLayers = useReportInstances()
  const heatmapAnimatedLayers = reportLayers?.filter((layer) => !layer.instance.props.static)
  useReportTimeseries(heatmapAnimatedLayers)
}

const memoizedFilterTimeseriesByTimerange = memoizeOne(filterTimeseriesByTimerange)
export const useReportFilteredTimeSeries = () => {
  const timeseries = useAtomValue(mapTimeseriesAtom)
  const { start: timebarStart, end: timebarEnd } = useSelector(selectTimeRange)
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const layersTimeseriesFiltered = useMemo(() => {
    if (!timeseries) {
      return []
    }
    if (showTimeComparison) {
      return timeseries
    } else {
      if (timebarStart && timebarEnd && timeseries) {
        return memoizedFilterTimeseriesByTimerange(timeseries, timebarStart, timebarEnd)
      }
    }
  }, [timeseries, showTimeComparison, timebarStart, timebarEnd])
  return layersTimeseriesFiltered
}
