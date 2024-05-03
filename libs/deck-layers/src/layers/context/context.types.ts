import { PickingInfo } from '@deck.gl/core'
import { Feature, Polygon, MultiPolygon } from 'geojson'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { BaseLayerProps, BasePickingObject } from '../../types'

export enum ContextLayerId {
  EEZ = 'eez-areas',
  HighSeas = 'high-seas',
  EEZBoundaries = 'eez-boundaries',
  MPA = 'mpa',
  MPANoTake = 'mpa-no-take',
  MPARestricted = 'mpa-restricted',
  TunaRfmo = 'tuna-rfmo',
  WPPNRI = 'wpp-nri',
  Graticules = 'graticules',
  FAO = 'fao',
  ProtectedSeas = 'protected-seas',
}

export type ContextLayerConfig<Id = ContextLayerId> = {
  id: Id
  datasetId: string
  tilesUrl: string
}

export type ContextLayerProps = BaseLayerProps & {
  id: string
  layers: ContextLayerConfig[]
  color: string
  idProperty?: string
  valueProperties?: string[]
  highlightedFeatures?: ContextPickingObject[]
}

export type ContextFeatureProperties = {
  id: string
  title: string
  color: string
  value: string | number
  layerId: ContextLayerId
  datasetId: string
  link?: string
}

export type ContextFeature = Feature<Polygon | MultiPolygon, Record<string, any>>

export type ContextPickingObject = BasePickingObject & ContextFeature & ContextFeatureProperties

export type ContextPickingInfo = PickingInfo<ContextPickingObject, { tile?: Tile2DHeader }>
