import { createSelector } from "@reduxjs/toolkit"
import { featureCollection, point } from "@turf/helpers"
import buffer from "@turf/buffer"
import concave from "@turf/concave"
import { flags } from "@globalfishingwatch/i18n-labels"
import { selectCountry, selectMapData, selectSelectedPoints } from "features/labeler/labeler.slice"
import { AreaGeneratorConfig, PortPosition, PortPositionFeature, PortPositionsGeneratorConfig } from "types"
import { groupBy } from "utils/group-by"
import { selectPortPointsByCountry, selectPortValuesByCountry, selectSubareaColors, selectSubareaValuesByCountry } from "features/labeler/labeler.selectors"

// Return the list of countries that are present in the json input
export const selectCountries = createSelector([selectMapData],
  (data) => {
    if (!data) {
      return []
    }
    const countriesDuplicated: string[] = data.map(e => {
      return e.iso3
    })
    const countries = [...new Set(countriesDuplicated)];

    return countries.map(e => {
      return {
        id: e,
        label: flags[e] ?? e,
      }
    }).sort((a, b) => a.label > b.label ? 1 : -1)
  }
)


/**
 * Creates a custom features for the port points
 */
export const selectPortPointsFeatures = createSelector([
  selectSelectedPoints,
  selectPortPointsByCountry,
  selectSubareaColors,
  selectSubareaValuesByCountry]
  ,
  (selectedPoints, countryPoints, colors, subareaValues): PortPositionFeature[] => {
    const points: PortPositionFeature[] = countryPoints?.map((point) => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [point.lon, point.lat],
        },
        properties: {
          id: point.s2id,
          color: colors[subareaValues[point.s2id]] ?? '#ffffff',
          selected: selectedPoints.indexOf(point.s2id) !== -1
        },
        id: parseInt(point.s2id, 16),
      } as PortPositionFeature
    })

    return points
  }
)

// Return the points grouped by ports (this is to generate the port layers)
export const selectPointsByPort = createSelector([selectPortPointsByCountry, selectPortValuesByCountry],
  (countryPoints, portValues): PortPosition[][] => {
    const areas = groupBy(countryPoints, portValues, 'label')
    const areaNames = Object.keys(areas)
    return areaNames.map(areaName => {
      return areas[areaName].length > 2 ? areas[areaName] : null
    }).filter(area => area)
  }
)

// Return the points grouped by subareas (this is to generate the subarea layers)
export const selectPointsByPortAndSubarea = createSelector([selectPointsByPort, selectSubareaValuesByCountry],
  (portPoints, subareasValues): PortPosition[][] => {
    const subareas = portPoints.flatMap((poins) => groupBy(poins, subareasValues, 'community_iso3'))

    return subareas.flatMap(subarea => {
      const subareaNames = Object.keys(subarea)
      return subareaNames.map(subareaName => {
        return subarea[subareaName].length > 2 ? subarea[subareaName] : null
      })
    }).filter(area => area)
  }
)

/**
 * Creates a custom features for the port layers
 */
export const selectPortAreaFeatures = createSelector([selectPointsByPort],
  (areas): any[] => {
    const result = areas.map(areaPositions => {
      const positions = areaPositions.map((p) => point([p.lon, p.lat]))
      if (positions.length < 3) return null
      const collection = featureCollection(
        positions
      )
      const concav = concave(collection, { units: 'miles', maxEdge: 10000 })
      return concav ? {
        ...buffer(concav, 0.2, { units: 'miles' }),
        properties: {
          color: '#ffffff'
        }
      } : null
    }).filter(feature => feature)

    return result
  }
)
/**
 * Creates a custom features for the subarea layers
 */
export const selectSubareaFeatures = createSelector([selectPointsByPortAndSubarea, selectSubareaColors, selectSubareaValuesByCountry],
  (areas, colors, subareaValues): any[] => {
    const result = areas.map(areaPositions => {
      const positions = areaPositions.map((p) => point([p.lon, p.lat]))
      if (positions.length < 3) return null
      const collection = featureCollection(
        positions
      )
      const concav = concave(collection, { units: 'miles', maxEdge: 10000 })
      return concav ? {
        ...buffer(concav, 0.1, { units: 'miles' }),
        properties: {
          color: colors[subareaValues[areaPositions[0].s2id]]
        }
      } : null
    }).filter(feature => feature)

    return result
  }
)

/**
 * Using the custom Mapbox GL features, it return the layer needed to render the polygons
 */
export const selectAreaLayer = createSelector(
  [selectPortAreaFeatures, selectSubareaFeatures],
  (areas, subareas): AreaGeneratorConfig => {
    return {
      type: 'geojson',
      data: {
        features: [...areas, ...subareas],
        type: 'FeatureCollection',
      },
    }
  }
)

/**
 * Using the custom Mapbox GL features, it return the layer needed to render port points
 */
export const selectPortPositionLayer = createSelector(
  [selectPortPointsFeatures],
  (points): PortPositionsGeneratorConfig => {
    return {
      type: 'geojson',
      data: {
        features: points,
        type: 'FeatureCollection',
      },
    }
  }
)
