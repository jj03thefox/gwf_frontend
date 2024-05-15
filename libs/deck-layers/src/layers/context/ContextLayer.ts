import { CompositeLayer, Color, DefaultProps, PickingInfo } from '@deck.gl/core'
import { GeoBoundingBox, TileLayer, TileLayerProps } from '@deck.gl/geo-layers'
import { GeoJsonLayer } from '@deck.gl/layers'
import { GeoJsonProperties } from 'geojson'
import { PathStyleExtension } from '@deck.gl/extensions'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import {
  COLOR_HIGHLIGHT_FILL,
  COLOR_HIGHLIGHT_LINE,
  COLOR_TRANSPARENT,
  hexToDeckColor,
  LayerGroup,
  getLayerGroupOffset,
  getPickedFeatureToHighlight,
  GFWMVTLoader,
  getMVTSublayerProps,
  getFeatureInFilter,
  getFetchLoadOptions,
} from '../../utils'
import { transformTileCoordsToWGS84 } from '../../utils/coordinates'
import { EEZ_SETTLED_BOUNDARIES } from './context.config'
import {
  ContextLayerProps,
  ContextPickingInfo,
  ContextFeature,
  ContextLayerId,
  ContextPickingObject,
} from './context.types'
import { getContextId, getContextLink, getContextValue } from './context.utils'

type _ContextLayerProps = TileLayerProps & ContextLayerProps

const defaultProps: DefaultProps<_ContextLayerProps> = {
  idProperty: 'gfw_id',
  valueProperties: [],
  maxRequests: 100,
  debounceTime: 500,
}

export class ContextLayer<PropsT = {}> extends CompositeLayer<_ContextLayerProps & PropsT> {
  static layerName = 'ContextLayer'
  static defaultProps = defaultProps

  getHighlightLineWidth(d: ContextFeature, filters?: Record<string, any>): number {
    if (!getFeatureInFilter(d, filters)) return 0
    const { highlightedFeatures = [], idProperty } = this.props
    return getPickedFeatureToHighlight(d, highlightedFeatures, idProperty!) ? 1.5 : 0
  }

  getLineWidth(d: ContextFeature, filters?: Record<string, any>): number {
    return getFeatureInFilter(d, filters) ? 1 : 0
  }

  getFillColor(d: ContextFeature, filters?: Record<string, any>): Color {
    if (!getFeatureInFilter(d, filters)) return COLOR_TRANSPARENT
    const { highlightedFeatures = [], idProperty } = this.props
    return getPickedFeatureToHighlight(d, highlightedFeatures, idProperty!)
      ? COLOR_HIGHLIGHT_FILL
      : COLOR_TRANSPARENT
  }

  getDashArray(d: ContextFeature): [number, number] {
    return EEZ_SETTLED_BOUNDARIES.includes(d.properties?.LINE_TYPE) ? [0, 0] : [8, 8]
  }

  getPickingInfo = ({
    info,
  }: {
    info: PickingInfo<ContextFeature, { tile?: Tile2DHeader }>
  }): ContextPickingInfo => {
    if (!info.object) return { ...info, object: undefined }
    const { idProperty, valueProperties } = this.props
    const layerId = this.props.layers[0].id
    const object = {
      ...transformTileCoordsToWGS84(
        info.object as ContextFeature,
        info.tile!.bbox as GeoBoundingBox,
        this.context.viewport
      ),
      title: this.props.id,
      color: this.props.color,
      layerId,
      datasetId: this.props.layers[0].datasetId,
      category: this.props.category,
      id: getContextId(info.object as ContextFeature, idProperty),
      value: getContextValue(info.object as ContextFeature, valueProperties),
      link: getContextLink({ ...info.object, layerId } as ContextPickingObject),
    } as ContextPickingObject
    return {
      ...info,
      object: getFeatureInFilter(object, this.props.layers[0].filters) ? object : undefined,
    }
  }

  _pickObjects(maxObjects: number | null): PickingInfo[] {
    const { deck, viewport } = this.context
    const width = viewport.width
    const height = viewport.height
    const x = viewport.x
    const y = viewport.y
    const layerIds = this.props.layers.map((l) => l.id)
    const features = deck!.pickObjects({ x, y, width, height, layerIds, maxObjects })
    return features.filter((f) => f.object)
  }

  getRenderedFeatures(maxFeatures: number | null = null): ContextFeature[] {
    const features = this._pickObjects(maxFeatures)
    const featureCache = new Set()
    const renderedFeatures: ContextFeature[] = []

    for (const f of features) {
      const featureId = getContextId(f.object as ContextFeature, this.props.idProperty)

      if (featureId === undefined) {
        // we have no id for the feature, we just add to the list
        renderedFeatures.push(f.object as ContextFeature)
      } else if (!featureCache.has(featureId)) {
        // Add removing duplicates
        featureCache.add(featureId)
        renderedFeatures.push(f.object as ContextFeature)
      }
    }

    return renderedFeatures
  }

  renderLayers() {
    const { highlightedFeatures, color, layers } = this.props
    return layers.map((layer) => {
      if (layer.id === ContextLayerId.EEZBoundaries) {
        return new TileLayer<TileLayerProps>({
          id: `${this.id}-boundaries-layer`,
          data: layer.tilesUrl,
          loaders: [GFWMVTLoader],
          renderSubLayers: (props: any) => {
            const mvtSublayerProps = { ...props, ...getMVTSublayerProps(props) }
            return [
              new GeoJsonLayer(mvtSublayerProps, {
                id: `${props.id}-boundaries`,
                onViewportLoad: this.props.onViewportLoad,
                lineWidthMinPixels: 1,
                filled: false,
                getPolygonOffset: (params: { layerIndex: number }) =>
                  getLayerGroupOffset(LayerGroup.OutlinePolygons, params),
                getLineColor: hexToDeckColor(this.props.color),
                lineWidthUnits: 'pixels',
                lineJointRounded: true,
                lineCapRounded: true,
                extensions: [
                  ...mvtSublayerProps.extensions,
                  new PathStyleExtension({ dash: true, highPrecisionDash: true }),
                ],
                getDashArray: (d: ContextFeature) => this.getDashArray(d),
              } as any),
            ]
          },
        })
      }

      return new TileLayer<TileLayerProps<ContextFeature>>({
        id: `${layer.id}-base-layer`,
        data: layer.tilesUrl,
        loaders: [GFWMVTLoader],
        loadOptions: {
          ...getFetchLoadOptions(),
        },
        onViewportLoad: this.props.onViewportLoad,
        renderSubLayers: (props) => {
          const mvtSublayerProps = {
            ...props,
            ...getMVTSublayerProps({ tile: props.tile, extensions: props.extensions }),
          }
          return [
            new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
              id: `${props.id}-highlight-fills`,
              stroked: false,
              pickable: true,
              getPolygonOffset: (params) =>
                getLayerGroupOffset(LayerGroup.OutlinePolygonsBackground, params),
              getFillColor: (d) => this.getFillColor(d as ContextFeature, layer.filters),
              updateTriggers: {
                getFillColor: [highlightedFeatures],
              },
            }),
            ...(layer.id !== ContextLayerId.EEZ && layer.id !== ContextLayerId.EEZBoundaries
              ? [
                  new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
                    id: `${props.id}-lines`,
                    lineWidthUnits: 'pixels',
                    lineWidthMinPixels: 0,
                    lineWidthMaxPixels: 1,
                    filled: false,
                    getPolygonOffset: (params) =>
                      getLayerGroupOffset(LayerGroup.OutlinePolygons, params),
                    getLineWidth: (d) => this.getLineWidth(d as ContextFeature, layer.filters),
                    getLineColor: hexToDeckColor(color),
                    updateTriggers: {
                      getLineWidth: layer.filters,
                    },
                  }),
                ]
              : []),
            new GeoJsonLayer<GeoJsonProperties, { data: any }>(mvtSublayerProps, {
              id: `${props.id}-highlight-lines`,
              lineWidthMinPixels: 0,
              lineWidthUnits: 'pixels',
              filled: false,
              visible: highlightedFeatures && highlightedFeatures?.length > 0,
              getPolygonOffset: (params) =>
                getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
              getLineWidth: (d) => this.getHighlightLineWidth(d as ContextFeature, layer.filters),
              getLineColor: COLOR_HIGHLIGHT_LINE,
              updateTriggers: {
                getLineWidth: [highlightedFeatures],
              },
            }),
          ]
        },
      })
    })
  }
}
