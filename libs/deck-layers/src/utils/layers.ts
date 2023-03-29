import { PickingInfo } from '@deck.gl/core/typed'

export function zIndexSortedArray(layersArray) {
  return layersArray
    .flatMap((l) => {
      if (!l) return []
      if (l?.layers?.length) return recursivelyGetLayers(l.layers)
      return l
    })
    .sort((a, b) => (a.props.zIndex && b.props.zIndex ? a.props.zIndex - b.props.zIndex : 0))
}

function recursivelyGetLayers(layers) {
  const reducer = layers.reduce((acc, layer) => {
    const l =
      layer?.layers?.length && layer.internalState ? recursivelyGetLayers(layer.layers) : [layer]
    return [...acc, ...l]
  }, [])
  return reducer
}

export function getPickedFeatureToHighlight(data, pickedFeatures: PickingInfo[]) {
  return (
    pickedFeatures &&
    pickedFeatures.find(
      (f: PickingInfo) =>
        f.object.type === 'Feature' && f.object.properties.gfw_id === data.properties.gfw_id
    )
  )
}

export const hexToRgb = (hex: string) => {
  const cleanHex = hex.replace('#', '')
  const color = {
    r: parseInt(cleanHex.slice(0, 2), 16),
    g: parseInt(cleanHex.slice(2, 4), 16),
    b: parseInt(cleanHex.slice(4, 6), 16),
  }
  return [color.r, color.g, color.b]
}
