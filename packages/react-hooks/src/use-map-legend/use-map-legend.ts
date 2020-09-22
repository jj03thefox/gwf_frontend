import { useMemo } from 'react'
import { ExtendedStyle } from '@globalfishingwatch/layer-composer/dist/types'
import { InteractionEvent } from '../use-map-interaction'
import { LegendLayer } from '.'

export function getLegendLayers(
  style: ExtendedStyle,
  event?: InteractionEvent
): LegendLayer[] | undefined {
  const layers = style?.layers?.flatMap((layer) => {
    if (!layer.metadata?.legend) return []
    const legendLayer = {
      ...layer.metadata.legend,
      color: layer.metadata.color || 'red',
      generatorId: layer.metadata.generatorId as string,
    }
    if (!event) return legendLayer
    const eventFeature = event?.features?.find(
      (feature) => feature.generatorId === layer.metadata?.generatorId
    )
    if (!eventFeature) return legendLayer
    return {
      ...legendLayer,
      value: eventFeature.value,
      properties: eventFeature.properties,
    }
  })
  return layers
}

function useMapLegend(style?: ExtendedStyle, interactionEvent?: InteractionEvent) {
  const legendLayers = useMemo(() => {
    if (!style) return
    const legendLayers = getLegendLayers(style, interactionEvent)
    return legendLayers?.reverse()
  }, [style, interactionEvent])
  return legendLayers
}
export default useMapLegend
