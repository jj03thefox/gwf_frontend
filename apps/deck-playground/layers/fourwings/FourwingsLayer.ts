import { Color, CompositeLayer, Layer, LayersList } from '@deck.gl/core/typed'
import { TileLayerProps } from '@deck.gl/geo-layers/typed'
import {
  FourwingsHeatmapTileLayerProps,
  FourwingsHeatmapTileLayer,
} from './FourwingsHeatmapTileLayer'
import {
  FourwingsPositionsTileLayer,
  FourwingsPositionsTileLayerProps,
} from './FourwingsPositionsTileLayer'

export const HEATMAP_ID = 'heatmap'
export const POSITIONS_ID = 'positions'

export type FourwingsLayerMode = typeof HEATMAP_ID | typeof POSITIONS_ID
export type FourwingsColorRamp = {
  colorDomain: number[]
  colorRange: Color[]
}

export type FourwingsLayerProps<DataT = any> = FourwingsPositionsTileLayerProps<DataT> &
  FourwingsHeatmapTileLayerProps & {
    mode: FourwingsLayerMode
  }

export class FourwingsLayer extends CompositeLayer<FourwingsLayerProps & TileLayerProps> {
  static layerName = 'FourwingsLayer'
  layer: FourwingsHeatmapTileLayer | FourwingsPositionsTileLayer | undefined

  renderLayers(): Layer<{}> | LayersList {
    const mode = this.getMode()
    this.layer =
      mode === HEATMAP_ID
        ? new FourwingsHeatmapTileLayer(this.props)
        : new FourwingsPositionsTileLayer(this.props)
    return this.layer
  }

  getData() {
    return this.layer.getData()
  }

  getMode() {
    return this.props.mode || HEATMAP_ID
  }

  getResolution() {
    return this.props.resolution
  }

  getColorDomain() {
    return this.layer?.getColorDomain()
  }

  getTimeseries() {
    return this.layer?.getTimeseries()
  }
}
