import { useDispatch, useSelector } from 'react-redux'
import { TimebarVisualisations } from 'types'
import { useCallback, useEffect } from 'react'
import { selectTimebarVisualisation, selectTimerange } from 'routes/routes.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectActiveTemporalgridDataviews,
  selectActiveVesselsDataviews,
} from 'features/workspace/workspace.selectors'
import { setStaticTime } from './timebar.slice'

export const useTimerangeConnect = () => {
  const { dispatchQueryParams } = useLocationConnect()
  const dispatch = useDispatch()
  const { start, end } = useSelector(selectTimerange)
  // TODO needs to be debounced like viewport
  const dispatchTimeranges = (
    newStart: string,
    newEnd: string,
    _: unknown,
    __: unknown,
    source: string
  ) => {
    const range = { start: newStart, end: newEnd }
    if (source !== 'ZOOM_OUT_MOVE') {
      dispatch(setStaticTime(range))
    }
    dispatchQueryParams(range)
  }
  return { start, end, dispatchTimeranges }
}

export const useTimebarVisualisation = () => {
  const activeHeatmapDataviews = useSelector(selectActiveTemporalgridDataviews)
  const activeVesselDataviews = useSelector(selectActiveVesselsDataviews)
  const timebarVisualisation = useSelector(selectTimebarVisualisation)
  const { dispatchQueryParams } = useLocationConnect()
  const dispatchTimebarVisualisation = useCallback(
    (timebarVisualisation: TimebarVisualisations | undefined) => {
      dispatchQueryParams({ timebarVisualisation: timebarVisualisation })
    },
    [dispatchQueryParams]
  )

  // Automates the selection based on current active layers
  const getUpdatedTimebarVisualization = () => {
    if (activeHeatmapDataviews?.length) {
      return timebarVisualisation ? timebarVisualisation : TimebarVisualisations.Heatmap
    }
    if (activeVesselDataviews?.length) {
      return TimebarVisualisations.Vessel
    }
    return undefined
  }

  useEffect(() => {
    const newTimebarVisualisation = getUpdatedTimebarVisualization()
    if (newTimebarVisualisation !== timebarVisualisation) {
      dispatchTimebarVisualisation(newTimebarVisualisation)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHeatmapDataviews, activeVesselDataviews])

  return { timebarVisualisation, dispatchTimebarVisualisation }
}
