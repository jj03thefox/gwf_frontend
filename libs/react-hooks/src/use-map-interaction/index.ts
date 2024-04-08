import { Interval, HeatmapAnimatedInteractionType } from '@globalfishingwatch/layer-composer'
import { SublayerCombinationMode } from '@globalfishingwatch/fourwings-aggregate'
import { ContextLayerId } from '@globalfishingwatch/deck-layers'

export * from './use-map-interaction'

export type TemporalGridFeature = {
  sublayerIndex: number
  sublayerId: string
  sublayerInteractionType: HeatmapAnimatedInteractionType
  sublayerCombinationMode: SublayerCombinationMode
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
  generatorContextLayer?: ContextLayerId | null
  datasetId?: string
  promoteId?: string
  id: string
  value: any
  tile: {
    x: number
    y: number
    z: number
  }
  geometry?: any
  temporalgrid?: TemporalGridFeature
  stopPropagation?: boolean
  uniqueFeatureInteraction?: boolean
  unit?: string
}

export type InteractionEventCallback = (event: InteractionEvent | null) => void

export type InteractionEvent = {
  type: 'click' | 'hover'
  features?: ExtendedFeature[]
  latitude: number
  longitude: number
  point: { x: number; y: number }
}
