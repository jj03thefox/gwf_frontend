import type { Geometry, Polygon, MultiPolygon } from 'geojson'
import simplify from '@turf/simplify'
import booleanContains from '@turf/boolean-contains'
// import booleanOverlap from '@turf/boolean-overlap'
import center from '@turf/center'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'

type Feature = GeoJSON.Feature<GeoJSON.Geometry>
export type FilteredPolygons = {
  contained: Feature[]
  overlapping: Feature[]
}

export function filterByPolygon(cells: Feature[], polygon: Geometry): FilteredPolygons {
  // const t0 = performance.now()

  const simplifiedPoly = simplify(polygon as Polygon | MultiPolygon, { tolerance: 0.1 })
  const filtered = cells.reduce(
    (acc, cell) => {
      const isContained =
        simplifiedPoly.type === 'MultiPolygon'
          ? simplifiedPoly.coordinates.some((coordinates) =>
              booleanContains({ type: 'Polygon', coordinates }, cell.geometry as Polygon)
            )
          : booleanContains(simplifiedPoly, cell.geometry as Polygon)

      if (isContained) {
        acc.contained.push(cell)
      } else {
        // TODO try to get the % of overlapping to use it in the value calculation
        // const overlaps = booleanOverlap(cell.geometry as Polygon, simplifiedPoly)
        const cellCenter = center(cell.geometry as Polygon)
        const overlaps = booleanPointInPolygon(cellCenter, simplifiedPoly)
        if (overlaps) {
          acc.overlapping.push(cell)
        }
      }
      return acc
    },
    { contained: [] as Feature[], overlapping: [] as Feature[] }
  )

  // const t1 = performance.now()
  // console.log(`Call to filterByPolygon took ${t1 - t0} milliseconds.`)
  return filtered
}
