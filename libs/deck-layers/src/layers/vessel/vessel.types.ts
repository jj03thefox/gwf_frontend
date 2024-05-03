import { Color, PickingInfo } from '@deck.gl/core'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { ApiEvent, EventTypes } from '@globalfishingwatch/api-types'
import { BasePickingObject } from '../../types'
import { TRACK_LAYER_TYPE } from './vessel.config'

export interface VesselDeckLayersEvent {
  type: EventTypes
  url: string
}

export type VesselDataType = typeof TRACK_LAYER_TYPE | EventTypes

export type _VesselLayerProps = {
  name: string
  color: Color
  singleTrack: boolean
  visible: boolean
}

// type VesselTrackProperties = {
//   timestamp: number
// }
// export type VesselTrackFeature = Feature<LineString | MultiLineString, VesselTrackProperties>
// export type VesselTrackPickingInfo = PickingInfo<VesselTrackPickingObject, { tile?: Tile2DHeader }>

export type VesselEventProperties = ApiEvent & {
  color: string
  title: string
  vesselId: string
}

export type VesselEventPickingObject = VesselEventProperties & BasePickingObject
export type VesselEventPickingInfo = PickingInfo<VesselEventPickingObject, { tile?: Tile2DHeader }>
