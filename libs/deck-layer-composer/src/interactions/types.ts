import {
  ContextLayerId,
  ContextPickingObject,
  FourwingsPickingObject,
} from '@globalfishingwatch/deck-layers'
import { DeckLayerInteractionFeature } from '../types'

export type InteractionEventCallback = (event: InteractionEvent | null) => void

export type ExtendedFeature = DeckLayerInteractionFeature & {
  layerId: string
  datasetId?: string
  promoteId?: string
  id: string
  value: any
  geometry?: any
  stopPropagation?: boolean
  uniqueFeatureInteraction?: boolean
  unit?: string
  // TODO:deck review if this is needed anywhere else
  // tile: {
  //   x: number
  //   y: number
  //   z: number
  // }
}

export type InteractionEvent = {
  type: 'click' | 'hover'
  features?: ExtendedFeature[]
  latitude: number
  longitude: number
  point: { x: number; y: number }
}
