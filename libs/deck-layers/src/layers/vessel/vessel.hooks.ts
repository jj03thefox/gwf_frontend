import { useEffect, useMemo } from 'react'
import { PickingInfo, LayerData, Layer } from '@deck.gl/core/typed'
import { atom, useSetAtom, useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { EventTypes } from '@globalfishingwatch/api-types'
import { VesselDeckLayersGenerator } from '@globalfishingwatch/layer-composer'
import { START_TIMESTAMP } from '../../loaders/constants'
import { parseEvents } from '../../loaders/vessels/eventsLoader'
import { VesselLayer } from './VesselLayer'

const dateToMs = (date: string) => {
  return new Date(date).getTime()
}

interface VesselLayerState {
  id: string
  instance: VesselLayer
  loadedLayers: string[]
}

export const vesselLayersAtom = atom<VesselLayerState[]>([])
export const vesselLayersSelector = (layers: VesselLayerState[]) => layers
export const vesselLayersInstancesSelector = atom((get) =>
  get(vesselLayersAtom).map((l) => l.instance)
)

export const selectVesselsLayersAtom = selectAtom(vesselLayersAtom, vesselLayersSelector)

interface globalConfig {
  start?: string
  end?: string
  // hoveredFeatures: PickingInfo[]
  // clickedFeatures: PickingInfo[]
  highlightedTime?: { start: string; end: string }
  visibleEvents?: EventTypes[]
}

export const useVesselLayers = (
  vesselLayersGenerator: VesselDeckLayersGenerator,
  globalConfig: globalConfig,
  highlightedTime?: { start: string; end: string }
) => {
  const { start, end } = globalConfig

  const setVesselLayers = useSetAtom(vesselLayersAtom)

  const setVesselLoadedState = useSetAtom(
    atom(null, (get, set, id: VesselLayerState['id']) =>
      set(vesselLayersAtom, (prevVessels) => {
        return prevVessels.map((v) => {
          if (id.includes(v.id)) {
            return {
              ...v,
              loadedLayers: [...v.loadedLayers, id],
            }
          }
          return v
        })
      })
    )
  )

  const onDataLoad = (data: LayerData<any>, context: { propName: string; layer: Layer<any> }) => {
    setVesselLoadedState(context.layer.id)
  }
  const highlightStartTime = useMemo(
    () => highlightedTime && dateToMs(highlightedTime?.start) - START_TIMESTAMP,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [highlightedTime?.start]
  )
  const highlightEndTime = useMemo(
    () => highlightedTime && dateToMs(highlightedTime?.end) - START_TIMESTAMP,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [highlightedTime?.end]
  )
  const startTime = useMemo(() => (start ? dateToMs(start) - START_TIMESTAMP : undefined), [start])
  const endTime = useMemo(() => (end ? dateToMs(end) - START_TIMESTAMP : undefined), [end])
  useEffect(() => {
    vesselLayersGenerator.ids.forEach((id: string) => {
      const { eventsData, colors, visibleEvents, trackUrls, eventsUrls } = vesselLayersGenerator

      const instance = new VesselLayer({
        id,
        visible: true,
        endTime,
        trackUrl: trackUrls[id],
        startTime,
        themeColor: colors[id],
        eventsUrls: eventsUrls[id],
        onDataLoad,
        // hoveredFeatures,
        // clickedFeatures,
        highlightEndTime,
        highlightStartTime,
        visibleEvents,
        eventsResource: eventsData[id]?.length ? parseEvents(eventsData[id]) : [],
      })

      setVesselLayers((prevVessels) => {
        const updatedVessels = prevVessels.filter((v) => v.id !== id)
        updatedVessels.push({
          id,
          instance,
          loadedLayers: [],
        })
        return updatedVessels
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end, highlightEndTime, highlightStartTime, vesselLayersGenerator])
  return useAtomValue(vesselLayersInstancesSelector)
}
