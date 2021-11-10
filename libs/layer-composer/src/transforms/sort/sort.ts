import { Group, Dictionary, ExtendedStyle, ExtendedLayer, StyleTransformation } from '../../types'

const GROUP_ORDER = [
  Group.Background,
  Group.Basemap,
  Group.OutlinePolygonsBackground,
  Group.Heatmap,
  Group.OutlinePolygonsFill,
  Group.OutlinePolygons,
  Group.BasemapFill,
  Group.Default,
  Group.Track,
  Group.TrackHighlightedEvent,
  Group.TrackHighlighted,
  Group.Point,
  Group.BasemapForeground,
  Group.CustomLayer,
  Group.OutlinePolygonsHighlighted,
  Group.Cluster,
  Group.Tool,
  Group.Label,
  Group.Overlay,
]

const GROUP_FROM_LEGACY: Dictionary<Group> = {
  'basemap-background': Group.Basemap,
  static: Group.OutlinePolygons,
  temporal: Group.Point,
  tracks: Group.Track,
  'basemap-foreground': Group.BasemapForeground,
  tools: Group.Overlay,
}

export const convertLegacyGroups = (style: ExtendedStyle): ExtendedStyle => {
  const newStyle = { ...style }
  newStyle.layers =
    newStyle.layers &&
    newStyle.layers.map((layer) => {
      const legacyGroup = layer.metadata && layer.metadata['mapbox:group']
      if (legacyGroup) {
        layer.metadata.group = GROUP_FROM_LEGACY[legacyGroup]
      }
      return layer
    })
  return newStyle
}

export const sort: StyleTransformation = (style, order = GROUP_ORDER) => {
  const layers = style.layers ? [...style.layers] : []
  const orderedLayers = layers.sort((a: ExtendedLayer, b: ExtendedLayer) => {
    const aGroup = a.metadata?.group || Group.Default
    const bGroup = b.metadata?.group || Group.Default
    const aPos = order.indexOf(aGroup)
    const bPos = order.indexOf(bGroup)
    return aPos - bPos
  })
  return { ...style, layers: orderedLayers }
}
