import { useCallback, useEffect, useMemo, useState } from 'react'
import { Polygon, MultiPolygon } from 'geojson'
import { useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import simplify from '@turf/simplify'
import bbox from '@turf/bbox'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from '@globalfishingwatch/layer-composer'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { Bbox } from 'types'
import { useLocationConnect } from 'routes/routes.hook'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import {
  selectAnalysisQuery,
  selectAnalysisTimeComparison,
  selectAnalysisTypeQuery,
} from 'features/app/app.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import useMapInstance from 'features/map/map-context.hooks'
import {
  DataviewFeature,
  areDataviewsFeatureLoaded,
  useMapDataviewFeatures,
  hasDataviewsFeatureError,
} from 'features/map/map-sources.hooks'
import { FIT_BOUNDS_ANALYSIS_PADDING } from 'data/config'
import {
  featuresToTimeseries,
  filterTimeseriesByTimerange,
  removeTimeseriesPadding,
} from 'features/analysis/analysis-timeseries.utils'
import { selectActiveTemporalgridDataviews } from 'features/dataviews/dataviews.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { Area, fetchAreaThunk, FetchAreaThunkParam } from 'features/areas/areas.slice'
import { filterByPolygon } from './analysis-geo.utils'
import { AnalysisGraphProps } from './AnalysisEvolutionGraph'
import { selectAnalysisArea, selectShowTimeComparison } from './analysis.selectors'

export type DateTimeSeries = {
  date: string
  values: number[]
  compareDate?: string
}[]

export const useFilteredTimeSeries = () => {
  const [blur, setBlur] = useState(false)
  const analysisAreaGeometry = useSelector(selectAnalysisArea)?.geometry
  const [timeseries, setTimeseries] = useState<AnalysisGraphProps[] | undefined>()
  const analysisType = useSelector(selectAnalysisTypeQuery)
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const timeComparison = useSelector(selectAnalysisTimeComparison)
  const temporalgridDataviews = useSelector(selectActiveTemporalgridDataviews)
  const activityFeatures = useMapDataviewFeatures(temporalgridDataviews)
  const { areaId } = useSelector(selectAnalysisQuery)
  const { start: timebarStart, end: timebarEnd } = useTimerangeConnect()

  const simplifiedGeometry = useMemo(() => {
    if (!analysisAreaGeometry) return null
    const simplifiedGeometry = simplify(analysisAreaGeometry, {
      tolerance: 0.1,
    })
    // Doing this once to avoid recomputing inside turf booleanPointInPolygon for each cell
    // https://github.com/Turfjs/turf/blob/master/packages/turf-boolean-point-in-polygon/index.ts#L63
    simplifiedGeometry.bbox = bbox(simplifiedGeometry)
    return simplifiedGeometry
  }, [analysisAreaGeometry])

  let compareDeltaMillis: number | undefined = undefined
  if (showTimeComparison && timeComparison) {
    const startMillis = DateTime.fromISO(timeComparison.start).toUTC().toMillis()
    const compareStartMillis = DateTime.fromISO(timeComparison.compareStart).toUTC().toMillis()
    compareDeltaMillis = compareStartMillis - startMillis
  }
  const computeTimeseries = useCallback(
    (layersWithFeatures: DataviewFeature[], geometry: Polygon | MultiPolygon) => {
      const features = layersWithFeatures.map(({ chunksFeatures }) =>
        chunksFeatures.flatMap(({ active, features }) => (active && features ? features : []))
      )
      const filteredFeatures = filterByPolygon(features, geometry)
      const timeseries = featuresToTimeseries(filteredFeatures, {
        layersWithFeatures,
        showTimeComparison,
        compareDeltaMillis,
      })

      setTimeseries(timeseries)
      setBlur(false)
    },
    [showTimeComparison, compareDeltaMillis]
  )

  const analysisEvolutionChange =
    analysisType === 'beforeAfter' || analysisType === 'periodComparison' ? 'time' : analysisType

  useEffect(() => {
    setTimeseries(undefined)
  }, [areaId, analysisEvolutionChange])

  useEffect(() => {
    setBlur(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeComparison, timebarStart, timebarEnd])

  useEffect(() => {
    const activityFeaturesLoaded = areDataviewsFeatureLoaded(activityFeatures)
    if (activityFeaturesLoaded && simplifiedGeometry) {
      computeTimeseries(activityFeatures, simplifiedGeometry)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityFeatures, simplifiedGeometry])

  const layersTimeseriesFiltered = useMemo(() => {
    if (showTimeComparison) {
      return removeTimeseriesPadding(timeseries)
    } else {
      if (timebarStart && timebarEnd && timeseries) {
        return filterTimeseriesByTimerange(timeseries, timebarStart, timebarEnd)
      }
    }
  }, [timeseries, showTimeComparison, timebarStart, timebarEnd])

  return {
    loading: blur && !areDataviewsFeatureLoaded(activityFeatures),
    error: hasDataviewsFeatureError(activityFeatures),
    layersTimeseriesFiltered,
  }
}

export const useAnalysisArea = () => {
  const map = useMapInstance()
  const dispatch = useDispatch()
  const fitMapBounds = useMapFitBounds()
  const { dispatchQueryParams } = useLocationConnect()
  const { updateFeatureState, cleanFeatureState } = useFeatureState(map)
  const { areaId, sourceId, datasetId } = useSelector(selectAnalysisQuery)
  const analysisArea = useSelector(selectAnalysisArea) || ({} as Area)
  const { status, bounds } = analysisArea

  const setHighlightedArea = useCallback(() => {
    cleanFeatureState('highlight')
    const featureState = {
      source: sourceId,
      sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER,
      id: areaId,
    }
    updateFeatureState([featureState], 'highlight')
  }, [areaId, cleanFeatureState, sourceId, updateFeatureState])

  const setAnalysisBounds = useCallback(
    (bounds: Bbox) => {
      dispatchQueryParams({ analysis: { areaId, bounds, sourceId, datasetId } })
      fitMapBounds(bounds, { padding: FIT_BOUNDS_ANALYSIS_PADDING })
    },
    [dispatchQueryParams, areaId, sourceId, datasetId, fitMapBounds]
  )

  const fetchAnalysisArea = useCallback(
    ({ datasetId, areaId }: FetchAreaThunkParam) => {
      dispatch(fetchAreaThunk({ datasetId, areaId }))
    },
    [dispatch]
  )

  useEffect(() => {
    if (areaId && datasetId) {
      fetchAnalysisArea({ datasetId, areaId })
    }
  }, [areaId, datasetId, fetchAnalysisArea])

  useEffect(() => {
    if (status === AsyncReducerStatus.Finished) {
      if (bounds) {
        setAnalysisBounds(bounds)
        setHighlightedArea()
      } else {
        console.warn('No area bounds')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, bounds])

  return analysisArea
}
