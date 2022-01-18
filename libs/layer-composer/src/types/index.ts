import type {
  SourceSpecification,
  HeatmapLayerSpecification,
  LayerSpecification,
  StyleSpecification,
} from '@globalfishingwatch/maplibre-gl'
import { DataviewConfig } from '@globalfishingwatch/api-types'
import {
  AggregationOperation,
  SublayerCombinationMode,
} from '@globalfishingwatch/fourwings-aggregate'
import {
  GeneratorType,
  ColorRampsIds,
  GeneratorLegend,
  HeatmapAnimatedGeneratorSublayer,
  GeneratorConfig,
  AnyGeneratorConfig,
  ContextLayerType,
} from '../generators/types'
import { TimeChunks } from '../generators/heatmap/util/time-chunks'

export interface GeneratorDataviewConfig<T = GeneratorType> extends DataviewConfig<T> {
  colorRamp?: ColorRampsIds
  basemap?: string
  sublayers?: HeatmapAnimatedGeneratorSublayer[]
}

export interface Dictionary<T> {
  [key: string]: T
}

export interface Generator {
  type: string
  getStyle: (layer: GeneratorConfig) => GeneratorStyles
}

/**
 * Defines groups for layer order. See actual layer order in packages/layer-composer/src/transforms/sort/sort.ts
 */
export enum Group {
  Background = 'background', // Solid bg color
  Basemap = 'basemap', // Satellite tiles
  Heatmap = 'heatmap', // Fill/gradient-based heatmaps
  OutlinePolygons = 'outlinePolygons', // Context layers with an outlined/hollow style such as RFMOs, MPAs, etc
  OutlinePolygonsFill = 'outlinePolygonsFill', // User context layers with a filled styles, below OutlinePolygons
  BasemapFill = 'basemapFill', // Landmass
  OutlinePolygonsBackground = 'outlinePolygonsBackground', // Polygons  that need to be rendered below landmass
  OutlinePolygonsHighlighted = 'outlinePolygonsHighlighted', // Context layers with selected features
  CustomLayer = 'customLayer', // Context custom user layers
  Default = 'default', // Default stack position when group is not specified
  Point = 'point', // Events, etc
  Track = 'track', // Tracks
  TrackHighlightedEvent = 'trackHighlightedEvent', // Fixed highlight section normally used for a event duration
  TrackHighlighted = 'trackHighlighted', // Highlighted sections of tracks
  BasemapForeground = 'basemapForeground', // Graticule labels, bathymetry labels, etc
  Cluster = 'cluster', // Cluster circles
  Tool = 'tool', // Tools such as rulers, etc
  Label = 'label', // All non-basemap layers labels
  Overlay = 'overlay', // Popups, ruler tool, etc
}

export enum LegendType {
  ColorRamp = 'colorramp',
  ColorRampDiscrete = 'colorramp-discrete',
  Solid = 'solid',
  Bivariate = 'bivariate',
}

/**
 * Set of additional metadata properties added by LayerComposer for later use in transformations or to be consumed directly ie (group, legend, etc)
 */
export interface LayerMetadataLegend extends GeneratorLegend {
  id: string
  type: LegendType
  gridArea?: number | string
  ramp?: [number | null | string, string][]
  colorRamp?: string[]
  loading?: boolean
  currentValue?: number
  divergent?: boolean
  [key: string]: any
}

/**
 * Specialized version of LayerMetadataLegend for bivariate legend
 */
export interface LayerMetadataLegendBivariate extends LayerMetadataLegend {
  type: LegendType.Bivariate
  currentValues: [number, number]
  sublayersBreaks: [number[], number[]]
  bivariateRamp: string[]
}

/**
 * Set of additional metadata properties added by LayerComposer for later use in transformations or to be consumed directly ie (group, legend, etc)
 */
export interface ExtendedLayerMeta {
  generatorId?: string
  generatorType?: GeneratorType
  interactive?: boolean
  uniqueFeatureInteraction?: boolean
  group?: Group
  'mapbox:group'?: string
  layer?: ContextLayerType
  legend?: LayerMetadataLegend | LayerMetadataLegend[]
  gridArea?: number
  currentValue?: number
  color?: string
}

export interface HeatmapLayerMeta {
  aggregationOperation: AggregationOperation
  breaks: number[]
  group: Group
  legends: LayerMetadataLegend | LayerMetadataLegend[]
  multiplier: number
  numSublayers: number
  sublayerCombinationMode: SublayerCombinationMode
  sublayers: HeatmapLayerSpecification[]
  temporalgrid: true
  timeChunks: TimeChunks
  visibleSublayers: boolean[]
}

/**
 * A standard Mapbox GL Layer with layer-composer specific metadata
 */
export type ExtendedLayer = LayerSpecification & {
  metadata?: ExtendedLayerMeta
}

export interface ExtendedStyleMeta {
  generatedAt?: number
  interactiveLayerIds?: string[]
  generatorsMetadata?: Record<string, HeatmapLayerMeta>
}

/**
 * A standard Mapbox GL Style with leyer-composer specific metadata
 */
export interface ExtendedStyle extends StyleSpecification {
  layers: ExtendedLayer[]
  metadata?: ExtendedStyleMeta
}

/**
 * This is what the layer composer main `getGLStyle` returns. Gives a Mapbox GL style and an array of promises for layers that don't resolve synchronously.
 */
export interface LayerComposerStyles {
  style: ExtendedStyle
  promises?: Promise<any>[]
}

export interface LayerComposerOptions {
  generators?: { [key: string]: any }
  version?: number
  glyphs?: string
  sprite?: string
}

export type GeneratorPromise = Promise<{ style: GeneratorStyles; config: AnyGeneratorConfig }>

// This is what is returned by a <Generator>.getStyle
// TODO This is unusable as is because sources carry an id which is invalid
export interface GeneratorStyles {
  id: string
  sources: SourceSpecification[]
  layers: ExtendedLayer[]
  promise?: GeneratorPromise
  promises?: GeneratorPromise[]
  metadata?: Record<string, any>
}

export type StyleTransformation = (style: ExtendedStyle) => ExtendedStyle
