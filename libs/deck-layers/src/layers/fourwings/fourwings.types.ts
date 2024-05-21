import { ColorRampsIds } from '../../utils'
import { BaseLayerProps } from '../../types'
import { HEATMAP_HIGH_RES_ID, HEATMAP_ID, POSITIONS_ID } from './fourwings.config'
import {
  FourwingsHeatmapPickingInfo,
  FourwingsHeatmapPickingObject,
  FourwingsHeatmapStaticPickingObject,
} from './heatmap/fourwings-heatmap.types'
import {
  FourwingsPositionsPickingInfo,
  FourwingsPositionsPickingObject,
} from './positions/fourwings-positions.types'

export * from './heatmap/fourwings-heatmap.types'
export * from './positions/fourwings-positions.types'

export type FourwingsSublayerId = string
export type FourwingsDatasetId = string
export type FourwingsVisualizationMode =
  | typeof HEATMAP_ID
  | typeof HEATMAP_HIGH_RES_ID
  | typeof POSITIONS_ID

export type FourwingsTileLayerColorDomain = number[] | number[][]
export type FourwingsTileLayerColorRange = string[][] | string[]
export type FourwingsTileLayerColorScale = {
  colorDomain: FourwingsTileLayerColorDomain
  colorRange: FourwingsTileLayerColorRange
}

export type FourwingsDeckSublayer = {
  id: FourwingsSublayerId
  datasets: FourwingsDatasetId[]
  visible: boolean
  color: string
  colorRamp: ColorRampsIds
  value?: number
  unit?: string
  filter?: string
  vesselGroups?: string | string[]
}

export type BaseFourwingsLayerProps = BaseLayerProps & {
  startTime: number
  endTime: number
  sublayers: FourwingsDeckSublayer[]
  tilesUrl?: string
}

export type FourwingsPickingInfo = FourwingsHeatmapPickingInfo | FourwingsPositionsPickingInfo
export type FourwingsPickingObject =
  | FourwingsHeatmapPickingObject
  | FourwingsHeatmapStaticPickingObject
  | FourwingsPositionsPickingObject
