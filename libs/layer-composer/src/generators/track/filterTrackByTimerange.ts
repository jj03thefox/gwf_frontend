import {
  FeatureCollection,
  Feature,
  Geometry,
  GeoJsonProperties,
  LineString,
  Position,
} from 'geojson'

interface SegmentData {
  coordinates: Position[]
  times: number[]
}

type FilterTrackByTimerangeParams = {
  start: number
  end: number
  includeNonTemporalFeatures?: boolean
}
// TODO TS types wont work with MultiPoint geoms
const filterTrackByTimerange = (
  geojson: FeatureCollection,
  { start, end, includeNonTemporalFeatures = false } = {} as FilterTrackByTimerangeParams
): FeatureCollection => {
  if (!geojson || !geojson.features)
    return {
      type: 'FeatureCollection',
      features: [],
    }
  let leadingPoint = true
  const featuresFiltered: Feature<Geometry, GeoJsonProperties>[] = geojson.features.reduce(
    (filteredFeatures: Feature<Geometry, GeoJsonProperties>[], feature) => {
      const hasTimes = feature?.properties?.coordinateProperties?.times?.length > 0
      if (hasTimes) {
        const filtered: SegmentData = (feature.geometry as LineString).coordinates.reduce(
          (filteredCoordinates, coordinate, index) => {
            const timeCoordinate: number = feature.properties?.coordinateProperties?.times[index]
            const isInTimeline = timeCoordinate >= start && timeCoordinate <= end
            if (isInTimeline) {
              if (leadingPoint && index > 0) {
                leadingPoint = false
                const leadingIndex = index - 1
                const leadingCoordinatePoint = (feature.geometry as LineString).coordinates[
                  leadingIndex
                ]
                const leadingCoordinateTime: number =
                  feature.properties?.coordinateProperties?.times[leadingIndex]
                filteredCoordinates.coordinates.push(leadingCoordinatePoint)
                filteredCoordinates.times.push(leadingCoordinateTime)
              }

              filteredCoordinates.coordinates.push(coordinate)
              filteredCoordinates.times.push(timeCoordinate)
            }

            return filteredCoordinates
          },
          { coordinates: [] as Position[], times: [] as number[] }
        )

        if (!filtered.coordinates.length) return filteredFeatures

        //
        const geometry: LineString = {
          type: 'LineString',
          coordinates: filtered.coordinates,
        }

        const properties: GeoJsonProperties = {
          ...feature.properties,
          coordinateProperties: {
            times: filtered.times,
          },
        }

        const filteredFeature: Feature = {
          ...feature,
          geometry,
          properties,
        }
        filteredFeatures.push(filteredFeature)
      } else if (includeNonTemporalFeatures) {
        filteredFeatures.push(feature)
      }
      return filteredFeatures
    },
    []
  )
  const geojsonFiltered: FeatureCollection = {
    ...geojson,
    features: featuresFiltered,
  }
  return geojsonFiltered
}

export default filterTrackByTimerange
