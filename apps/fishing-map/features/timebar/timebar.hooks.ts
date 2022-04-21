import { useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo } from 'react'
import { atom, useRecoilState } from 'recoil'
import { debounce } from 'lodash'
import { DEFAULT_CALLBACK_URL_KEY } from '@globalfishingwatch/react-hooks'
import { MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID } from '@globalfishingwatch/dataviews-client'
import { TimebarGraphs, TimebarVisualisations } from 'types'
import { useMapStyle } from 'features/map/map-style.hooks'
import {
  selectTimebarGraph,
  selectTimebarSelectedEnvId,
  selectTimebarVisualisation,
} from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectActiveActivityDataviews,
  selectActiveEnvironmentalDataviews,
} from 'features/dataviews/dataviews.selectors'
import store, { RootState } from 'store'
import { updateUrlTimerange } from 'routes/routes.actions'
import { selectUrlTimeRange } from 'routes/routes.selectors'
import { setHintDismissed } from 'features/help/hints/hints.slice'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import useMapInstance from 'features/map/map-context.hooks'
import { BIG_QUERY_PREFIX } from 'features/dataviews/dataviews.utils'
import { selectAnalysisArea, selectIsAnalyzing } from 'features/analysis/analysis.selectors'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import { FIT_BOUNDS_ANALYSIS_PADDING } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  Range,
  changeSettings,
  setHighlightedEvents,
  selectHighlightedEvents,
  selectHasChangedSettingsOnce,
  selectHighlightedTime,
  disableHighlightedTime,
} from './timebar.slice'

export const TimeRangeAtom = atom<Range | null>({
  key: 'timerange',
  default: null,
  effects: [
    ({ trigger, setSelf, onSet }) => {
      const redirectUrl =
        typeof window !== 'undefined' ? window.localStorage.getItem(DEFAULT_CALLBACK_URL_KEY) : null
      const urlTimeRange = selectUrlTimeRange(store.getState() as RootState)

      if (trigger === 'get') {
        if (urlTimeRange) {
          setSelf({
            ...urlTimeRange,
          })
        } else if (redirectUrl) {
          try {
            // Workaround to get start and end date from redirect url as the
            // location reducer isn't ready until initialDispatch
            const url = new URL(JSON.parse(redirectUrl))
            const start = url.searchParams.get('start')
            const end = url.searchParams.get('end')
            if (start && end) {
              setSelf({ start, end })
            }
          } catch (e: any) {
            console.warn(e)
          }
        }
      }
      const updateTimerangeDebounced = debounce(store.dispatch(updateUrlTimerange), 1000)
      onSet((timerange) => {
        if (timerange) {
          updateTimerangeDebounced({ ...timerange })
        }
      })
    },
  ],
})

export const useTimerangeConnect = () => {
  const [timerange, setTimerange] = useRecoilState(TimeRangeAtom)
  const isAnalyzing = useSelector(selectIsAnalyzing)
  const fitMapBounds = useMapFitBounds()
  const dispatch = useAppDispatch()
  const analysisAreaBounds = useSelector(selectAnalysisArea)?.bounds

  const onTimebarChange = useCallback(
    (start: string, end: string) => {
      if (start !== timerange?.start || end !== timerange.end) {
        dispatch(setHintDismissed('changingTheTimeRange'))
      }
      setTimerange({ start, end })
      if (isAnalyzing && analysisAreaBounds) {
        fitMapBounds(analysisAreaBounds, { padding: FIT_BOUNDS_ANALYSIS_PADDING })
      }
    },
    [
      analysisAreaBounds,
      dispatch,
      fitMapBounds,
      isAnalyzing,
      setTimerange,
      timerange?.end,
      timerange?.start,
    ]
  )
  return useMemo(() => {
    return {
      start: timerange?.start,
      end: timerange?.end,
      timerange,
      setTimerange,
      onTimebarChange,
    }
  }, [onTimebarChange, timerange, setTimerange])
}

export const useDisableHighlightTimeConnect = () => {
  const highlightedTime = useSelector(selectHighlightedTime)
  const dispatch = useAppDispatch()

  const dispatchDisableHighlightedTime = useCallback(() => {
    if (highlightedTime !== undefined) {
      dispatch(disableHighlightedTime())
    }
  }, [dispatch, highlightedTime])

  return useMemo(
    () => ({
      highlightedTime,
      dispatchDisableHighlightedTime,
    }),
    [highlightedTime, dispatchDisableHighlightedTime]
  )
}

export const useHighlightedEventsConnect = () => {
  const highlightedEvents = useSelector(selectHighlightedEvents)
  const dispatch = useAppDispatch()

  const dispatchHighlightedEvents = useCallback(
    (eventIds: string[]) => {
      dispatch(setHighlightedEvents(eventIds))
    },
    [dispatch]
  )

  const serializedHighlightedEvents = highlightedEvents?.join('')

  return useMemo(() => {
    return {
      highlightedEvents,
      dispatchHighlightedEvents,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedHighlightedEvents, dispatchHighlightedEvents])
}

export const useTimebarVisualisationConnect = () => {
  const dispatch = useAppDispatch()
  const timebarVisualisation = useSelector(selectTimebarVisualisation)

  const { dispatchQueryParams } = useLocationConnect()
  const dispatchTimebarVisualisation = useCallback(
    (timebarVisualisation: TimebarVisualisations | undefined, automated = false) => {
      dispatchQueryParams({ timebarVisualisation: timebarVisualisation })
      if (!automated) {
        dispatch(changeSettings())
      }
    },
    [dispatchQueryParams, dispatch]
  )

  return { timebarVisualisation, dispatchTimebarVisualisation }
}

export const useTimebarEnvironmentConnect = () => {
  const { dispatchQueryParams } = useLocationConnect()
  const timebarSelectedEnvId = useSelector(selectTimebarSelectedEnvId)

  const dispatchTimebarSelectedEnvId = useCallback(
    (timebarSelectedEnvId: string) => {
      dispatchQueryParams({ timebarSelectedEnvId })
    },
    [dispatchQueryParams]
  )

  return { timebarSelectedEnvId, dispatchTimebarSelectedEnvId }
}

export const useTimebarGraphConnect = () => {
  const timebarGraph = useSelector(selectTimebarGraph)
  const { dispatchQueryParams } = useLocationConnect()
  const dispatchTimebarGraph = useCallback(
    (timebarGraph: TimebarGraphs) => {
      dispatchQueryParams({ timebarGraph })
    },
    [dispatchQueryParams]
  )

  return {
    timebarGraph,
    dispatchTimebarGraph,
  }
}

// Used to automate the behave depending on vessels or activity state
// should be instanciated only once to avoid doing it more than needed
export const useTimebarVisualisation = () => {
  const { timebarVisualisation, dispatchTimebarVisualisation } = useTimebarVisualisationConnect()
  const activeHeatmapDataviews = useSelector(selectActiveActivityDataviews)
  const activeTrackDataviews = useSelector(selectActiveTrackDataviews)
  const activeEnvDataviews = useSelector(selectActiveEnvironmentalDataviews)
  const hasChangedSettingsOnce = useSelector(selectHasChangedSettingsOnce)

  // Fallback mechanisms to avoid empty timebar
  useEffect(() => {
    if (timebarVisualisation === TimebarVisualisations.Heatmap && !activeHeatmapDataviews?.length) {
      if (activeTrackDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.Vessel, true)
      } else if (activeEnvDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.Environment, true)
      }
    } else if (
      timebarVisualisation === TimebarVisualisations.Vessel &&
      !activeTrackDataviews?.length
    ) {
      if (activeHeatmapDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.Heatmap, true)
      } else if (activeEnvDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.Environment, true)
      }
    } else if (
      timebarVisualisation === TimebarVisualisations.Environment &&
      !activeEnvDataviews?.length
    ) {
      if (activeHeatmapDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.Heatmap, true)
      } else if (activeTrackDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.Vessel, true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHeatmapDataviews, activeTrackDataviews, activeEnvDataviews])

  // Automatically switch to last-activated layer type if settings never have been changed manually
  useEffect(() => {
    if (!hasChangedSettingsOnce) {
      if (timebarVisualisation !== TimebarVisualisations.Vessel && activeTrackDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.Vessel, true)
      } else if (
        timebarVisualisation !== TimebarVisualisations.Heatmap &&
        activeHeatmapDataviews?.length
      ) {
        dispatchTimebarVisualisation(TimebarVisualisations.Heatmap, true)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTrackDataviews, activeHeatmapDataviews, hasChangedSettingsOnce])

  return { timebarVisualisation, dispatchTimebarVisualisation }
}

export const useActivityMetadata = (forceEnvironmental = false) => {
  const map = useMapInstance()
  const style = useMapStyle()

  if (!map) return null

  const generatorsMetadata = style?.metadata?.generatorsMetadata
  if (!generatorsMetadata) return null

  const activityHeatmapMetadata = generatorsMetadata[MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID]
  if (activityHeatmapMetadata?.timeChunks && !forceEnvironmental) {
    return activityHeatmapMetadata
  }

  const environmentalMetadata = Object.entries(generatorsMetadata).filter(
    ([id, metadata]) => (metadata as any).temporalgrid === true
  )
  const bqEnvironmentalMetadata = environmentalMetadata.filter(([id]) =>
    id.includes(BIG_QUERY_PREFIX)
  )
  if (environmentalMetadata?.length === 1 && bqEnvironmentalMetadata?.length === 1) {
    return bqEnvironmentalMetadata[0][1]
  }

  return null
}
