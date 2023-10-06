import bbox from '@turf/bbox'
import { LineString, feature, geometry, polygon } from '@turf/helpers'
import { Feature, MultiPolygon, Polygon } from 'geojson'

export type Bbox = [number, number, number, number]

// Used to detect antimeridian issues in dissolve
export const BUFFERED_ANTIMERIDIAN_LON = 179.5
// Used to normalize longitudes to avoid antimeridian issues
export const BUFFERED_ANTIMERIDIAN_NORMALIZED = 180.1

export const wrapBBoxLongitudes = (bbox: Bbox) => {
  // Hack for renderers like mapbox gl or leaflet to fix antimeridian issues
  // https://macwright.org/2016/09/26/the-180th-meridian.html ("Using longitudes above and below 180 and -180**")
  let currentLon: number
  let lonOffset = 0
  return bbox.map((coordinate, index) => {
    // only needed for longitudes wich
    if (index === 0 || index === 2) {
      if (currentLon) {
        if (coordinate - currentLon < -180) {
          lonOffset += 360
        } else if (coordinate - currentLon > 180) {
          lonOffset -= 360
        }
      }
      currentLon = coordinate
      return coordinate + lonOffset
    }
    return coordinate
  }) as Bbox
}

export function wrapGeometryBbox(geometry: Polygon | MultiPolygon): Bbox {
  let [minX, minY, maxX, maxY] = bbox(geometry)
  if (minX === -180 && maxX === 180) {
    geometry.coordinates.forEach((polygon) => {
      const polygonBbox = bbox({ type: 'Polygon', coordinates: polygon })
      if (polygonBbox[2] === 180 && (minX === -180 || polygonBbox[0] < minX)) {
        minX = polygonBbox[0]
      } else if (polygonBbox[0] === -180 && (maxX === 180 || polygonBbox[2] + 360 > maxX)) {
        maxX = polygonBbox[2] + 360
      }
    })
  }
  return [minX, minY, maxX, maxY]
}

export const wrapFeaturesLongitudes = (features: Feature<LineString | Polygon>[]) => {
  return features.map((feature) => wrapFeatureLongitudes(feature))
}

export const normalizeLongitud = (longitude: number) => {
  if (longitude > BUFFERED_ANTIMERIDIAN_LON) return BUFFERED_ANTIMERIDIAN_NORMALIZED
  else if (longitude < -BUFFERED_ANTIMERIDIAN_LON) return -BUFFERED_ANTIMERIDIAN_NORMALIZED
  return longitude
}

type WrapLongitudesParams = {
  normalize?: boolean
}

export const wrapLineStringFeatureCoordinates = (feature: Feature<LineString>) => {
  let prevLon: number
  let lonOffset = 0
  return feature.geometry.coordinates.map((coords) => {
    const [currentLon, currentLat] = coords
    if (prevLon) {
      if (currentLon - prevLon < -180) {
        lonOffset += 360
      } else if (currentLon - prevLon > 180) {
        lonOffset -= 360
      }
    }
    prevLon = currentLon
    return [currentLon + lonOffset, currentLat]
  })
}

export const wrapPolygonFeatureCoordinates = (
  feature: Feature<Polygon>,
  { normalize = true }: WrapLongitudesParams
) => {
  return feature.geometry.coordinates.map((coords) => {
    return coords.map((pair) => {
      const lon = normalize ? normalizeLongitud(pair[0]) : pair[0]
      if (lon < 0) return [lon + 360, pair[1]]
      return pair
    })
  })
}

export const wrapMultipolygonFeatureCoordinates = (
  feature: Feature<MultiPolygon>,
  params: WrapLongitudesParams
) => {
  return feature.geometry.coordinates.map((coords) => {
    return wrapPolygonFeatureCoordinates(polygon(coords), params)
  })
}

export const wrapFeatureLongitudes = (
  featureData: Feature<LineString | Polygon | MultiPolygon>,
  params: WrapLongitudesParams = {}
): Feature<LineString | Polygon | MultiPolygon> => {
  let coordinates = featureData.geometry.coordinates
  switch (featureData.geometry.type) {
    case 'LineString':
      coordinates = wrapLineStringFeatureCoordinates(featureData as Feature<LineString>)
      return feature(geometry('LineString', coordinates)) as Feature<LineString>
    case 'Polygon':
      coordinates = wrapPolygonFeatureCoordinates(featureData as Feature<Polygon>, params)
      return feature(geometry('Polygon', coordinates)) as Feature<Polygon>
    default: // MultiPolygon
      coordinates = wrapMultipolygonFeatureCoordinates(featureData as Feature<MultiPolygon>, params)
      return feature(geometry('MultiPolygon', coordinates)) as Feature<MultiPolygon>
  }
}
