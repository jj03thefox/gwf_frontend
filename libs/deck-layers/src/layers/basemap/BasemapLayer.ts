import { BitmapLayer } from '@deck.gl/layers/typed'
import { CompositeLayer, Layer } from '@deck.gl/core/typed'
import { TileLayer } from '@deck.gl/geo-layers'
import { MVTLayer, TileLayerProps, MVTLayerProps } from '@deck.gl/geo-layers/typed'
import { Group, GROUP_ORDER } from '@globalfishingwatch/layer-composer'

export type BasemapLayerOwnProps = { basemap: 'basemap_default' | 'satellite' }
export type BaseMapLayerProps = TileLayerProps & MVTLayerProps & BasemapLayerOwnProps
export class BaseMap extends CompositeLayer<BaseMapLayerProps> {
  static layerName = 'ContextLayer'
  static defaultProps = {}

  layers: Layer[] = []

  _getBathimetryLayer() {
    return new TileLayer({
      id: 'basemap-bathimetry',
      data: 'https://storage.googleapis.com/public-tiles/basemap/bathymetry/{z}/{x}/{y}.png',
      minZoom: 0,
      maxZoom: 9,
      onDataLoad: this.props.onDataLoad,
      zIndex: GROUP_ORDER.indexOf(Group.Basemap),
      tileSize: 256,
      renderSubLayers: (props) => {
        const {
          bbox: { west, south, east, north },
        } = props.tile
        return new BitmapLayer(props, {
          data: null,
          image: props.data,
          bounds: [west, south, east, north],
        })
      },
    })
  }

  _getLandMassLayer() {
    return new MVTLayer({
      id: 'basemap-landmass',
      minZoom: 0,
      maxZoom: 8,
      onDataLoad: this.props.onDataLoad,
      zIndex: GROUP_ORDER.indexOf(Group.BasemapFill),
      getFillColor: [39, 70, 119],
      data: 'https://storage.googleapis.com/public-tiles/basemap/default/{z}/{x}/{y}.pbf',
    })
  }

  _getSatelliteLayer() {
    return new TileLayer({
      id: 'basemap-satellite',
      data: 'https://gateway.api.dev.globalfishingwatch.org/v2/tileset/sat/tile?x={x}&y={y}&z={z}',
      minZoom: 0,
      maxZoom: 9,
      onDataLoad: this.props.onDataLoad,
      zIndex: GROUP_ORDER.indexOf(Group.Basemap),
      tileSize: 256,
      renderSubLayers: (props) => {
        const {
          bbox: { west, south, east, north },
        } = props.tile
        return new BitmapLayer(props, {
          data: null,
          image: props.data,
          bounds: [west, south, east, north],
        })
      },
    })
  }

  _getBasemap() {
    return this.props.basemap === 'basemap_default'
      ? this._getLandMassLayer()
      : this._getSatelliteLayer()
  }

  renderLayers() {
    this.layers = [this._getBathimetryLayer(), this._getBasemap()]
    return this.layers
  }
}
