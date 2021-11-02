import { Layer, Expression } from '@globalfishingwatch/mapbox-gl'
import {
  GlobalHeatmapAnimatedGeneratorConfig,
  TEMPORALGRID_SOURCE_LAYER,
} from '../heatmap-animated'
import { TimeChunk, TimeChunks } from '../util/time-chunks'
import { Group } from '../../../types'
import { GeneratorType } from '../../types'
import { getColorRampBaseExpression } from '../util/get-legends'
import getBaseLayer, {
  getBaseDebugLabelsLayer,
  getBaseInteractionHoverLayer,
  getBaseInteractionLayer,
} from '../util/get-base-layers'
import { getLayerId, getSourceId } from '../util'

export default function gridded(
  config: GlobalHeatmapAnimatedGeneratorConfig,
  timeChunks: TimeChunks
) {
  const { colorRampBaseExpression } = getColorRampBaseExpression(config)

  // TODO only active chunk needed?
  const layers: Layer[] = timeChunks.chunks.flatMap((timeChunk: TimeChunk) => {
    const pickValueAt = timeChunk.frame.toString()
    // TODO Coalesce to 0 will not work if we use divergent scale (because we would need the value < min value)
    const exprPick: Expression = ['coalesce', ['get', pickValueAt], 0]

    const exprColorRamp = ['match', exprPick, ...colorRampBaseExpression, 'transparent']

    const paint = {
      'fill-color': timeChunk.active ? (exprColorRamp as any) : 'rgba(0,0,0,0)',
      'fill-outline-color': 'transparent',
    }

    const chunkMainLayer = getBaseLayer(
      config,
      getLayerId(config.id, timeChunk),
      getSourceId(config.id, timeChunk)
    )
    chunkMainLayer.paint = paint
    // only add legend metadata for first time chunk
    const chunkLayers: Layer[] = [chunkMainLayer]

    if (config.interactive && timeChunk.active) {
      const interactionLayer = getBaseInteractionLayer(
        config,
        getLayerId(config.id, timeChunk, 'interaction'),
        chunkMainLayer.source as string
      )

      chunkLayers.push(interactionLayer)
      const interactionHoverLayer = getBaseInteractionHoverLayer(
        config,
        getLayerId(config.id, timeChunk, 'interaction_hover'),
        chunkMainLayer.source as string
      )
      chunkLayers.push(interactionHoverLayer)
    }

    if (config.debug) {
      const exprDebugOutline = ['case', ['>', exprPick, 0], 'rgba(0,255,0,1)', 'rgba(255,255,0,1)']
      chunkLayers.push({
        id: getLayerId(config.id, timeChunk, 'debug'),
        source: getSourceId(config.id, timeChunk),
        'source-layer': TEMPORALGRID_SOURCE_LAYER,
        type: 'fill',
        paint: {
          'fill-color': 'transparent',
          'fill-outline-color': exprDebugOutline as any,
        },
        metadata: {
          group: config.group || Group.Heatmap,
        },
      })
    }
    if (config.debugLabels) {
      const debugTextLayer = getBaseDebugLabelsLayer(
        exprPick,
        getLayerId(config.id, timeChunk, 'debug_labels'),
        getSourceId(config.id, timeChunk)
      )
      chunkLayers.push(debugTextLayer)
    }
    return chunkLayers
  })

  return layers
}
