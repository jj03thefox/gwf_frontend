import type {
  Type,
  ColorRampsIds,
  HeatmapAnimatedGeneratorSublayer,
} from '@globalfishingwatch/layer-composer/dist/generators/types'
import { Dataset } from '.'

export interface DataviewConfig {
  // TODO use any property from layer-composer here?
  type?: Type | string
  color?: string
  colorRamp?: ColorRampsIds
  visible?: boolean
  basemap?: string
  sublayers?: HeatmapAnimatedGeneratorSublayer[]
  [key: string]: any
}

export interface DataviewDatasetConfigParams {
  id: string
  value: string | number | boolean | string[]
}

export interface DataviewDatasetConfig {
  datasetId: string
  endpoint: string
  params: DataviewDatasetConfigParams[]
  query?: DataviewDatasetConfigParams[]
}

export interface DataviewCreation {
  name: string
  description: string
  config?: DataviewConfig
}

export interface DataviewInfoConfigField {
  id: string
  type: 'flag' | 'number' | 'date'
}

export interface DataviewInfoConfig {
  fields: DataviewInfoConfigField[]
}

export interface Dataview {
  id: number
  name: string
  description: string
  createdAt?: string
  updatedAt?: string
  config: DataviewConfig
  datasets?: Dataset[]
  infoConfig?: DataviewInfoConfig
  datasetsConfig?: DataviewDatasetConfig[]
}

export interface DataviewInstance extends Partial<Omit<Dataview, 'id' | 'config'>> {
  id: string
  dataviewId: number
  config?: DataviewConfig
  datasetsConfig?: DataviewDatasetConfig[]
}
