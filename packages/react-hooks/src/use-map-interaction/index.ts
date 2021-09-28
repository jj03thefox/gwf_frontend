import type { Geometry } from 'geojson'
import {
  ContextLayerType,
  HeatmapAnimatedInteractionType,
} from '@globalfishingwatch/layer-composer/src/generators/types'
import { Interval } from '@globalfishingwatch/layer-composer/src/generators'

export { useMapHover, useSimpleMapHover, useMapClick, useFeatureState } from './use-map-interaction'

export type TemporalGridFeature = {
  sublayerIndex: number
  sublayerId: string
  sublayerInteractionType: HeatmapAnimatedInteractionType
  visible: boolean
  col: number
  row: number
  interval: Interval
  visibleStartDate: string
  visibleEndDate: string
  unit?: string
}

export type ExtendedFeature = {
  properties: Record<string, any>
  layerId: string
  source: string
  sourceLayer: string
  generatorId: string | number | null
  generatorType: string | null
  id: string
  value: any
  tile: {
    x: number
    y: number
    z: number
  }
  temporalgrid?: TemporalGridFeature
  uniqueFeatureInteraction?: boolean
  generatorContextLayer?: ContextLayerType | null
  geometry?: Geometry
}

export type InteractionEventCallback = (event: InteractionEvent | null) => void

export type InteractionEvent = {
  type: 'click' | 'hover'
  features?: ExtendedFeature[]
  latitude: number
  longitude: number
  point: [number, number]
}
