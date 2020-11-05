import type { Layer, AnySourceImpl, Style } from 'mapbox-gl'
import type { DataviewConfig } from '@globalfishingwatch/api-types'
import {
  GeneratorConfig,
  Type,
  GeneratorLegend,
  HeatmapAnimatedGeneratorSublayer,
  ColorRampsIds,
} from '../generators/types'

export interface GeneratorDataviewConfig extends DataviewConfig<Type> {
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
 * Defines groups for layer order
 */
export enum Group {
  Background = 'background', // Solid bg color
  Basemap = 'basemap', // Satellite tiles
  Heatmap = 'heatmap', // Fill/gradient-based heatmaps
  BasemapFill = 'basemapFill', // Landmass
  OutlinePolygons = 'outlinePolygons', // Context layers with an outlined/hollow style such as EEZ, RFMOs, etc
  OutlinePolygonsBackground = 'OutlinePolygonsBackground', // Polygons  that need to be rendered below landmass
  OutlinePolygonsHighlighted = 'outlinePolygonsHighlighted', // Context layers with selected features
  Default = 'default', // Default stack position when group is not specified
  Point = 'point', // Events, etc
  Track = 'track', // Tracks
  TrackHighlightedEvent = 'trackHighlightedEvent', // Fixed highlight section normally used for a event duration
  TrackHighlighted = 'trackHighlighted', // Highlighted sections of tracks
  BasemapForeground = 'BasemapForeground', // Graticule labels, bathymetry labels, etc
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
  id?: string
  type: LegendType
  gridArea?: number | string
  ramp?: [number | null | string, string][]
  currentValue?: number
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
 * Set of additional metadata properties added by LayerCompoeser for later use in transformations or to be consumed directly ie (group, legend, etc)
 */
export interface ExtendedLayerMeta {
  group?: Group
  generatorId: string
  generatorType: Type
  legend?: LayerMetadataLegend | LayerMetadataLegend[]
  gridArea?: number
  currentValue?: number
  color?: string
}

/**
 * A standard Mapbox GL Layer with layer-composer specific metadata
 */
export interface ExtendedLayer extends Layer {
  metadata?: ExtendedLayerMeta
}

export interface ExtendedStyleMeta {
  generatedAt: string
  interactiveLayerIds?: string[]
  temporalgrid: Record<string, any>
}

/**
 * A standard Mapbox GL Style with leyer-composer specific metadata
 */
export interface ExtendedStyle extends Style {
  layers?: ExtendedLayer[]
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

// This is what is returned by a <Generator>.getStyle
// TODO This is unusable as is because sources carry an id which is invalid
export interface GeneratorStyles {
  id: string
  sources: AnySourceImpl[]
  layers: ExtendedLayer[]
  promise?: Promise<GeneratorStyles>
  promises?: Promise<GeneratorStyles>[]
  metadata?: {}
}

export type StyleTransformation = (style: ExtendedStyle) => ExtendedStyle
