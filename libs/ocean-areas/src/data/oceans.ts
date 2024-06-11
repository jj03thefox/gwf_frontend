import { Feature, FeatureCollection, Geometry, MultiPolygon, Polygon } from 'geojson'
import { OceanAreaProperties } from '../ocean-areas'
import oceansData from './source/oceans.json'

const oceans: FeatureCollection<Geometry, OceanAreaProperties> = {
  type: 'FeatureCollection',
  features: oceansData as Feature<Polygon | MultiPolygon, OceanAreaProperties>[],
}

export default oceans
