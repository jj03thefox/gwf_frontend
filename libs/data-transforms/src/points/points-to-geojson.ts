import { Feature, FeatureCollection, Point } from 'geojson'
import { getUTCDate, parseCoords } from '@globalfishingwatch/data-transforms'
import { PointColumns } from '../types'

export const pointsListToGeojson = (
  data: Record<string, any>[],
  { latitude, longitude, id, startTime, endTime }: PointColumns
) => {
  const features: Feature<Point>[] = data.flatMap((point, index) => {
    const coords = parseCoords(point[latitude] as number, point[longitude] as number)
    if (coords) {
      return {
        type: 'Feature',
        properties: {
          ...point,
          ...(startTime && { [startTime]: getUTCDate(point[startTime]).getTime() }),
          ...(endTime && { [endTime]: getUTCDate(point[endTime]).getTime() }),
          id: id && point[id] ? point[id] : index,
        },
        geometry: {
          type: 'Point',
          coordinates: [coords.longitude, coords.latitude],
        },
      }
    } else {
      return []
    }
  })
  return {
    type: 'FeatureCollection',
    features,
  } as FeatureCollection
}
