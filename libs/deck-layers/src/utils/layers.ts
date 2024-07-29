import { COORDINATE_SYSTEM } from '@deck.gl/core'
import { ClipExtension } from '@deck.gl/extensions'
import { TileLayerProps } from '@deck.gl/geo-layers'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { Matrix4 } from '@math.gl/core'
import { ContextPickingObject } from '../layers/context'
import { UserLayerPickingObject } from '../layers/user'
import { PolygonPickingObject } from '../layers/polygons'

const WORLD_SIZE = 512

export function getPickedFeatureToHighlight(
  data: any,
  pickedFeatures: (ContextPickingObject | UserLayerPickingObject | PolygonPickingObject)[],
  { idProperty = 'gfw_id', datasetId } = {} as { idProperty?: string; datasetId?: string }
) {
  return pickedFeatures?.some((f) => {
    if (f.properties?.[idProperty] === data.properties?.[idProperty]) {
      return true
    }
    if (!datasetId || !f.properties?.datasetIds?.length) {
      return false
    }
    return (f.properties?.datasetIds as string[])?.some((id, index) => {
      return (
        f.properties?.areaIds?.[index] === data.properties[idProperty].toString() &&
        id === datasetId
      )
    })
  })
}

export function getFeatureInFilter(feature: any, filters?: Record<string, any>) {
  if (!filters || !Object.keys(filters).length) return true
  return Object.keys(filters).some((filter) =>
    filters[filter]?.includes(feature?.properties?.[filter]?.toString())
  )
}

export function getMVTSublayerProps({
  tile,
  extensions,
}: {
  tile: Tile2DHeader
  extensions?: TileLayerProps['extensions']
}): {
  modelMatrix: Matrix4
  coordinateOrigin: [number, number, number]
  coordinateSystem: 0 | 3 | 1 | -1 | 2 | undefined
  extensions: any[]
} {
  const { x, y, z } = tile.index
  const worldScale = Math.pow(2, z)
  const xScale = WORLD_SIZE / worldScale
  const yScale = -xScale
  const xOffset = (WORLD_SIZE * x) / worldScale
  const yOffset = WORLD_SIZE * (1 - y / worldScale)
  const modelMatrix = new Matrix4().scale([xScale, yScale, 1])
  return {
    modelMatrix: modelMatrix,
    coordinateOrigin: [xOffset, yOffset, 0],
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    extensions: [...(extensions || []), new ClipExtension()],
  }
}

export function getViewportHash({
  viewport,
  precissionDecimals = 3,
}: {
  viewport: {
    zoom: number
    longitude?: number
    latitude?: number
    width?: number
    height?: number
  }
  precissionDecimals?: number
}) {
  const { longitude, latitude, zoom, width, height } = viewport
  return [longitude, latitude, zoom, width, height]
    .flatMap((n) => n?.toFixed(precissionDecimals) || [])
    .join(',')
}
