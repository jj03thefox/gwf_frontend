import { ApiAppName, Dataset } from '.'

export type ColorCyclingType = 'fill' | 'line'

export interface DataviewConfig<Type = any> {
  // TODO use any property from layer-composer here?
  type?: Type
  color?: string
  colorCyclingType?: ColorCyclingType
  visible?: boolean
  filters?: Record<string, any>
  [key: string]: any
}

export interface DataviewDatasetConfigParam {
  id: string
  value: string | number | boolean | string[]
}

export interface DataviewDatasetConfig {
  datasetId: string
  endpoint: string
  params: DataviewDatasetConfigParam[]
  query?: DataviewDatasetConfigParam[]
}

export interface DataviewCreation<T = any> {
  name: string
  app: ApiAppName
  description: string
  config?: DataviewConfig<T>
  datasetsConfig?: DataviewDatasetConfig[]
}

export interface DataviewInfoConfigField {
  id: string
  type: 'flag' | 'number' | 'date'
  mandatory?: boolean
  guest?: boolean
}

export interface DataviewInfoConfig {
  fields: DataviewInfoConfigField[]
}

export enum DataviewCategory {
  Context = 'context',
  Events = 'events',
  Environment = 'environment',
  Fishing = 'fishing',
  Presence = 'presence',
  Vessels = 'vessels',
}

export interface Dataview<Type = any, Category = DataviewCategory> {
  id: number
  name: string
  app: ApiAppName
  description: string
  category?: Category
  createdAt?: string
  updatedAt?: string
  config: DataviewConfig<Type>
  datasets?: Dataset[]
  infoConfig?: DataviewInfoConfig
  datasetsConfig?: DataviewDatasetConfig[]
}

export interface DataviewInstance<Type = any>
  extends Partial<Omit<Dataview<Type>, 'id' | 'config'>> {
  id: string
  dataviewId: number
  config?: DataviewConfig<Type>
  datasetsConfig?: DataviewDatasetConfig[]
}
