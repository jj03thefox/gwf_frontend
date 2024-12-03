import type { EventTypes } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type {
  AnyDeckLayer,
  DeckLayerPickingObject,
  FourwingsLayer,
  FourwingsVisualizationMode,
  HEATMAP_ID,
  HEATMAP_LOW_RES_ID,
  VesselsColorBy,
} from '@globalfishingwatch/deck-layers'
import type { TimeRange } from './dataviews'

export type ResolverGlobalConfig = {
  start: string
  end: string
  zoom?: number
  token?: string
  debug?: boolean
  bivariateDataviews?: [string, string]
  activityVisualizationMode?: FourwingsVisualizationMode
  detectionsVisualizationMode?: FourwingsVisualizationMode
  environmentVisualizationMode?: typeof HEATMAP_ID | typeof HEATMAP_LOW_RES_ID
  onPositionsMaxPointsError?: (layer: FourwingsLayer, maxPoints: number) => void
  // TODO review if we can move this to each own dataview
  compareStart?: string
  compareEnd?: string
  highlightedTime?: Partial<TimeRange>
  highlightEventIds?: string[]
  visibleEvents: EventTypes[]
  vesselsColorBy: VesselsColorBy
  highlightedFeatures?: DeckLayerPickingObject[]
}

export type DeckResolverFunction<LayerProps = AnyDeckLayer['props']> = (
  dataview: UrlDataviewInstance,
  globalConfig: ResolverGlobalConfig
) => LayerProps
