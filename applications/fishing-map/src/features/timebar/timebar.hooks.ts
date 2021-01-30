import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { TimebarVisualisations } from 'types'
import { selectTimeRange, selectTimebarVisualisation } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectActiveTemporalgridDataviews,
  selectActiveVesselsDataviews,
} from 'features/workspace/workspace.selectors'
import { setStaticTime, selectHasChangedSettingsOnce, changeSettings } from './timebar.slice'

export const useTimerangeConnect = () => {
  const { dispatchQueryParams } = useLocationConnect()
  const dispatch = useDispatch()
  const { start, end } = useSelector(selectTimeRange)
  // TODO needs to be debounced like viewport
  const dispatchTimeranges = useCallback(
    (event: { start: string; end: string; source: string }) => {
      const range = { start: event.start, end: event.end }
      if (event.source !== 'ZOOM_OUT_MOVE') {
        dispatch(setStaticTime(range))
      }
      dispatchQueryParams(range)
    },
    [dispatchQueryParams, dispatch]
  )
  return { start, end, dispatchTimeranges }
}

export const useTimebarVisualisation = () => {
  const dispatch = useDispatch()
  const activeHeatmapDataviews = useSelector(selectActiveTemporalgridDataviews)
  const activeVesselDataviews = useSelector(selectActiveVesselsDataviews)
  const timebarVisualisation = useSelector(selectTimebarVisualisation)
  const hasChangedSettingsOnce = useSelector(selectHasChangedSettingsOnce)

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

  useEffect(() => {
    if (timebarVisualisation === TimebarVisualisations.Heatmap) {
      // fallback to vessels if heatmap = 0 (only if at least 1 vessel is available)
      if (
        (!activeHeatmapDataviews || activeHeatmapDataviews.length === 0) &&
        activeVesselDataviews?.length
      ) {
        dispatchTimebarVisualisation(TimebarVisualisations.Vessel, true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHeatmapDataviews, activeVesselDataviews])

  useEffect(() => {
    if (timebarVisualisation !== TimebarVisualisations.Vessel) {
      // switch to vessel if track shown "for the first time"
      if (!hasChangedSettingsOnce && activeVesselDataviews?.length) {
        dispatchTimebarVisualisation(TimebarVisualisations.Vessel, true)
      }
    } else {
      // fallback to heatmap if vessel = 0
      if (!activeVesselDataviews || activeVesselDataviews.length === 0) {
        dispatchTimebarVisualisation(TimebarVisualisations.Heatmap, true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVesselDataviews, hasChangedSettingsOnce])

  return { timebarVisualisation, dispatchTimebarVisualisation }
}
