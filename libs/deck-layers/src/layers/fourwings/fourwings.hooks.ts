import { useEffect, useMemo } from 'react'
import { LayerData, Layer } from '@deck.gl/core/typed'
import { atom, useSetAtom, useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { groupBy, indexOf } from 'lodash'
import { DataviewCategory, EventTypes } from '@globalfishingwatch/api-types'
import { HEATMAP_GROUP_ORDER } from '@globalfishingwatch/layer-composer'
import { FourwingsDeckLayerGenerator } from '../../layer-composer/types'
import { FourwingsLayer } from './FourwingsLayer'

const dateToMs = (date: string) => {
  return new Date(date).getTime()
}

interface FourwingsLayerState {
  id: string
  instance: FourwingsLayer
  loadedLayers: string[]
}

export const fourwingsLayersAtom = atom<FourwingsLayerState[]>([])
export const fourwingsLayersSelector = (layers: FourwingsLayerState[]) => layers

export const fourwingsLayersInstancesSelector = atom((get) =>
  get(fourwingsLayersAtom)
    .map((l) => l.instance)
    .sort(
      (a, b) =>
        indexOf(HEATMAP_GROUP_ORDER, b.props.category) -
        indexOf(HEATMAP_GROUP_ORDER, a.props.category)
    )
)

export const selectFourwingsLayersAtom = selectAtom(fourwingsLayersAtom, fourwingsLayersSelector)

interface globalConfig {
  start?: string
  end?: string
  // hoveredFeatures: PickingInfo[]
  // clickedFeatures: PickingInfo[]
  highlightedTime?: { start: string; end: string }
  visibleEvents?: EventTypes[]
}

export const useFourwingsLayers = (
  fourwingsLayersGenerator: FourwingsDeckLayerGenerator[],
  globalConfig: globalConfig
) => {
  const { start, end } = globalConfig

  const setFourwingsLayers = useSetAtom(fourwingsLayersAtom)

  const setFourwingsLoadedState = useSetAtom(
    atom(null, (get, set, id: FourwingsLayerState['id']) =>
      set(fourwingsLayersAtom, (prevVessels) => {
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
    console.log(data, context)
    // setFourwingsLoadedState(context.layer.id)
  }

  const startTime = useMemo(() => (start ? dateToMs(start) : undefined), [start])
  const endTime = useMemo(() => (end ? dateToMs(end) : undefined), [end])

  useEffect(() => {
    const groupedLayers = groupBy(fourwingsLayersGenerator, 'category')
    Object.keys(groupedLayers).forEach((category) => {
      const instance = new FourwingsLayer({
        minFrame: startTime,
        maxFrame: endTime,
        // mode: activityMode,
        mode: 'heatmap',
        debug: false,
        sublayers: groupedLayers[category].flatMap((l) => l.sublayers),
        category: category as DataviewCategory,
        // onDataLoad: onDataLoad,
        // onTileLoad: onTileLoad,
        // onViewportLoad: onViewportLoad,
        // onVesselHighlight: onVesselHighlight,
        // onVesselClick: onVesselClick,
        // resolution: 'high',
        // hoveredFeatures: hoveredFeatures,
        // clickedFeatures: clickedFeatures,
      })

      setFourwingsLayers((prevVessels) => {
        const updatedVessels = prevVessels.filter((v) => v.id !== category)
        updatedVessels.push({
          id: category,
          instance,
          loadedLayers: [],
        })
        return updatedVessels
      })
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end, fourwingsLayersGenerator])
  return useAtomValue(fourwingsLayersInstancesSelector)
}
