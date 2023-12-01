import type {
  LayerSpecification,
  CircleLayerSpecification,
  FilterSpecification,
} from '@globalfishingwatch/maplibre-gl'
import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from '../context/config'
import { GeneratorType, MergedGeneratorConfig, UserPointsGeneratorConfig } from '../types'
import { isUrlAbsolute } from '../../utils'
import { Group } from '../../types'
import { API_GATEWAY } from '../../config'
import { getCirclePaintWithFeatureState } from '../context/context.utils'
import { getCircleRadiusWithPointSizeProperty } from '../user-points/user-points.utils'
import { DEFAULT_BACKGROUND_COLOR } from '../background/config'

export type GlobalUserPointsGeneratorConfig = Required<
  MergedGeneratorConfig<UserPointsGeneratorConfig>
>

class UserPointsGenerator {
  type = GeneratorType.UserPoints

  _getStyleSources = (config: GlobalUserPointsGeneratorConfig) => {
    const tilesUrl = isUrlAbsolute(config.tilesUrl)
      ? config.tilesUrl
      : API_GATEWAY + config.tilesUrl

    const url = new URL(tilesUrl.replace(/{{/g, '{').replace(/}}/g, '}'))

    if (config.filter) {
      url.searchParams.set('filter', config.filter)
    }
    // As user can modify the dataset, we need to avoid the cache
    url.searchParams.set('cache', 'false')

    return [
      {
        id: config.id,
        type: 'vector',
        promoteId: 'gfw_id',
        tiles: [decodeURI(url.toString())],
      },
    ]
  }

  _getStyleLayers = (config: GlobalUserPointsGeneratorConfig): LayerSpecification[] => {
    const generatorId = config.id
    const baseLayer = {
      id: generatorId,
      source: config.id,
      'source-layer': DEFAULT_CONTEXT_SOURCE_LAYER,
    }
    let filters: FilterSpecification | undefined
    if (config?.pointTimeFilterProperty) {
      filters = [
        'all',
        [
          '<=',
          ['to-number', ['get', config.pointTimeFilterProperty]],
          getUTCDate(config.end).getTime(),
        ],
        [
          '>=',
          ['to-number', ['get', config.pointTimeFilterProperty]],
          getUTCDate(config.start).getTime(),
        ],
      ]
    }
    const circleLayer: CircleLayerSpecification = {
      ...baseLayer,
      type: 'circle',
      paint: {
        'circle-stroke-color': DEFAULT_BACKGROUND_COLOR,
        'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 3, 0.1, 5, 0.5],
        'circle-stroke-opacity': 0.5,
        ...getCirclePaintWithFeatureState(config.color, 0.7),
        ...getCircleRadiusWithPointSizeProperty(config),
      },
      ...(filters && { filter: filters }),
      metadata: {
        color: config.color,
        interactive: !config.disableInteraction,
        generatorId,
        uniqueFeatureInteraction: true,
        datasetId: config.datasetId,
        legend: {
          ...config.metadata?.legend,
          group: Group.OutlinePolygonsHighlighted,
        },
      },
    }

    return [circleLayer]
  }

  getStyle = (config: GlobalUserPointsGeneratorConfig) => {
    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }
  }
}

export default UserPointsGenerator
