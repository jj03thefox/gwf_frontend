import { GeoJSON } from 'geojson'
import { FetchResponseTypes } from '@globalfishingwatch/api-client/dist/api-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { HeatmapAnimatedGeneratorSublayer } from '@globalfishingwatch/layer-composer/dist/generators/types'

export interface EndpointParam {
  id: string
  label: string
  type: 'enum' | 'boolean' | 'number' | 'string' | 'Date ISO' | 'sql' | '4wings-datasets'
  description?: string
  enum?: string[]
  default?: string | boolean | number
  required?: boolean
  // TODO remove this or enum, but they both do the same
  values?: any
}

export interface Endpoint {
  id: string
  description?: string
  method?: 'GET' | 'POST'
  pathTemplate: string
  downloadable: boolean
  body?: any
  params: EndpointParam[]
  query: EndpointParam[]
}

export type DatasetTypes =
  | 'carriers-tracks:v1'
  | 'carriers-vessels:v1'
  | 'carriers-events:v1'
  | 'carriers-ports:v1'
  | '4wings:v1'
  | 'user-tracks:v1'
  | 'user-context-layer:v1'
  | 'data-download:v1'

export type DatasetStatus = 'done' | 'importing' | 'error'
export interface DatasetConfiguration {
  index?: string
  filePath?: string
  propertyToInclude?: string
  srid?: number
  [key: string]: unknown
}

export interface Dataset {
  id: string
  type: DatasetTypes
  alias: string[] | null
  name: string
  description: string
  category?: string
  subcategory?: string
  source?: string
  status: DatasetStatus
  importLogs?: string
  unit?: string
  ownerType: string
  ownerId: number
  startDate?: string
  endDate?: string
  createdAt: string
  endpoints?: Endpoint[]
  configuration: DatasetConfiguration | null
  relatedDatasets: unknown
}

export interface DataviewConfig {
  // TODO use any property from layer-composer here?
  type?: Generators.Type | string
  color?: string
  colorRamp?: Generators.ColorRampsIds
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
  datasets: string[]
  config?: DataviewConfig
}

export interface Dataview {
  id: number
  uid?: string // Unique id to identify with datasetConfig params
  name: string
  description: string
  createdAt?: string
  updatedAt?: string
  config: DataviewConfig
  datasets?: Dataset[]
  datasetsConfig?: DataviewDatasetConfig[]
}

export interface AOI {
  id: number
  name: string
  area: number
  geometry?: GeoJSON
  bbox: number[]
}

export interface WorkspaceDataviewConfig {
  id: string
  dataviewId: number
  config?: DataviewConfig
  datasetsConfig?: DataviewDatasetConfig[]
}

export interface Workspace {
  id: number
  description: string
  name: string
  dataviews: Dataview[]
  dataviewsConfig: WorkspaceDataviewConfig[]
  aoi?: AOI
  viewport: {
    zoom: number
    latitude: number
    longitude: number
  }
  start: string
  end: string
}

export interface WorkspaceUpsert extends Partial<Omit<Workspace, 'aoi' | 'dataviews'>> {
  aoi?: number
  dataviews?: number[]
}

export interface Resource<T = unknown> {
  dataviewId: number | string
  datasetId: string
  type?: string
  // identifies resource uniquely, ie vessel id
  datasetParamId: string
  resolvedUrl: string
  responseType?: FetchResponseTypes
  data?: T
}
