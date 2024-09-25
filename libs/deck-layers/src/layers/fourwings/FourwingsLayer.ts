import { Color, CompositeLayer, Layer, LayersList } from '@deck.gl/core'
import { TileLayerProps } from '@deck.gl/geo-layers'
import { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { FourwingsHeatmapTileLayer } from './heatmap/FourwingsHeatmapTileLayer'
import { FourwingsHeatmapStaticLayer } from './heatmap/FourwingsHeatmapStaticLayer'
import { FourwingsPositionsTileLayer } from './positions/FourwingsPositionsTileLayer'
import { FourwingsFootprintTileLayer } from './footprint/FourwingsFootprintTileLayer'
import { FOOTPRINT_ID, HEATMAP_ID, HEATMAP_STATIC_ID, POSITIONS_ID } from './fourwings.config'
import {
  FourwingsPickingObject,
  FourwingsVisualizationMode,
  GetViewportDataParams,
} from './fourwings.types'
import { FourwingsPositionsTileLayerProps } from './positions/fourwings-positions.types'
import {
  FourwingsChunk,
  FourwingsHeatmapStaticLayerProps,
  FourwingsHeatmapTileLayerProps,
} from './heatmap/fourwings-heatmap.types'
import { FourwingsFootprintTileLayerProps } from './footprint/fourwings-footprint.types'
import { getResolutionByVisualizationMode } from './heatmap/fourwings-heatmap.utils'

export type FourwingsColorRamp = {
  colorDomain: number[]
  colorRange: Color[]
}

export type FourwingsLayerProps = Omit<
  FourwingsPositionsTileLayerProps &
    FourwingsHeatmapStaticLayerProps &
    FourwingsHeatmapTileLayerProps &
    FourwingsFootprintTileLayerProps & {
      id: string
      visualizationMode?: FourwingsVisualizationMode
    },
  'resolution' | 'highlightedFeatures'
> & {
  highlightedFeatures?: FourwingsPickingObject[]
}

export class FourwingsLayer extends CompositeLayer<FourwingsLayerProps & TileLayerProps> {
  static layerName = 'FourwingsLayer'

  get isHeatmapVisualizationMode(): boolean {
    return (
      this.props.visualizationMode !== undefined &&
      (this.props.visualizationMode?.includes(HEATMAP_ID) ||
        this.props.visualizationMode?.includes(FOOTPRINT_ID))
    )
  }

  renderLayers(): Layer<{}> | LayersList {
    const visualizationMode = this.getMode()
    if (visualizationMode === POSITIONS_ID) {
      const PositionsLayerClass = this.getSubLayerClass('positions', FourwingsPositionsTileLayer)
      return new PositionsLayerClass(
        this.props,
        this.getSubLayerProps({
          id: POSITIONS_ID,
          onViewportLoad: this.props.onViewportLoad,
        })
      )
    }
    if (visualizationMode === FOOTPRINT_ID) {
      const FootprintLayerClass = this.getSubLayerClass('footprint', FourwingsFootprintTileLayer)
      return new FootprintLayerClass(
        this.props,
        this.getSubLayerProps({
          id: POSITIONS_ID,
          onViewportLoad: this.props.onViewportLoad,
        })
      )
    }
    let resolution = getResolutionByVisualizationMode(visualizationMode)
    const HeatmapLayerClass = this.props.static
      ? this.getSubLayerClass(HEATMAP_STATIC_ID, FourwingsHeatmapStaticLayer)
      : this.getSubLayerClass(resolution, FourwingsHeatmapTileLayer)

    return new HeatmapLayerClass(
      this.props,
      this.getSubLayerProps({
        id: HEATMAP_STATIC_ID,
        resolution,
        onViewportLoad: this.props.onViewportLoad,
      })
    )
  }

  setHighlightedVessel(vesselId: string | string[] | undefined) {
    const layer = this.getLayer()
    if (layer instanceof FourwingsPositionsTileLayer) {
      return layer?.setHighlightedVessel(vesselId)
    }
  }

  getData() {
    return this.getLayer()?.getData()
  }

  getError() {
    return this.getLayer()?.getError()
  }

  getIsPositionsAvailable() {
    if (this.props.visualizationMode?.includes(HEATMAP_ID)) {
      const heatmapLayer = this.getLayer() as FourwingsHeatmapTileLayer
      if (!heatmapLayer?.isLoaded) {
        return false
      }
      return heatmapLayer?.getIsPositionsAvailable()
    }
    return this.props.visualizationMode === POSITIONS_ID
  }

  getInterval() {
    if (this.isHeatmapVisualizationMode && !this.props.static) {
      return (this.getLayer() as FourwingsHeatmapTileLayer)?.getInterval()
    }
    return '' as FourwingsInterval
  }

  getVisualizationMode() {
    return this.props.visualizationMode || HEATMAP_ID
  }

  getChunk() {
    if (this.isHeatmapVisualizationMode && !this.props.static) {
      return (this.getLayer() as FourwingsHeatmapTileLayer)?.getChunk()
    }
    return {} as FourwingsChunk
  }

  getViewportData(params = {} as GetViewportDataParams) {
    return this.getLayer()?.getViewportData?.(params)
  }

  getMode() {
    return this.props.visualizationMode || HEATMAP_ID
  }

  getResolution() {
    return getResolutionByVisualizationMode(this.props.visualizationMode)
  }

  getLayer() {
    return this.getSubLayers()?.[0] as FourwingsHeatmapTileLayer | FourwingsPositionsTileLayer
  }

  getColorScale() {
    return this.getLayer()?.getColorScale()
  }

  getFourwingsLayers() {
    return this.getLayer()?.getFourwingsLayers()
  }

  getTimeseries() {
    return this.getLayer()?.getTimeseries()
  }
}
