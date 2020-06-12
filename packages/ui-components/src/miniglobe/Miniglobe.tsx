import React, { useMemo } from 'react'
import { geoOrthographic, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import { Topology, GeometryCollection } from 'topojson-specification'
import jsonData from './ne_110m_land.json'
import styles from './Miniglobe.module.css'
import { MiniglobeCenter, MiniglobeBounds } from './index'

interface MiniglobeProps {
  center: MiniglobeCenter
  bounds: MiniglobeBounds
  size?: number
  viewportThickness?: number
}

const defaultBounds = {
  north: 10,
  south: -10,
  west: -10,
  east: 10,
}

const MIN_DEGREES_PATH = 4
const MAX_DEGREES_PATH = 160
const defaultCenter = { latitude: 0, longitude: 0 }

const MiniGlobe: React.FC<MiniglobeProps> = (props) => {
  const { bounds = defaultBounds, center = defaultCenter, size = 40, viewportThickness = 4 } = props

  const projection = useMemo(() => {
    const { latitude, longitude } = center
    const projection = geoOrthographic()
      .translate([size / 2, size / 2])
      .scale(size / 2)
      .clipAngle(90)
    projection.rotate([-longitude, -latitude])
    return projection
  }, [center, size])

  const worldData = useMemo(
    () =>
      feature((jsonData as unknown) as Topology, jsonData.objects.land as GeometryCollection)
        .features,
    []
  )

  if (!bounds) {
    console.error('MiniGlobe: bounds not specified')
    return null
  }

  const { north, south, west, east } = bounds
  if (north < south || west > east) {
    console.error('MiniGlobe: bounds specified not valid')
  }

  const viewportBoundsGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [west, north],
          [east, north],
          [east, south],
          [west, south],
          [west, north],
        ],
      ],
    },
  }

  const showPoint = north - south <= MIN_DEGREES_PATH || east - west <= MIN_DEGREES_PATH
  const showPath =
    !showPoint &&
    Math.abs(north) + Math.abs(south) <= MAX_DEGREES_PATH &&
    Math.abs(west) + Math.abs(east) <= MAX_DEGREES_PATH
  const path = geoPath().projection(projection)(viewportBoundsGeoJSON as any) || undefined

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      focusable="false"
    >
      <circle className={styles.globe} cx={size / 2} cy={size / 2} r={size / 2} />
      <g className={styles.land}>
        {worldData.map((d, i) => {
          const path = geoPath().projection(projection)(d)
          return path && <path key={`path-${i}`} d={path} />
        })}
      </g>
      {showPoint && (
        <circle
          className={styles.viewportPoint}
          cx={size / 2}
          cy={size / 2}
          r={viewportThickness}
        />
      )}
      {showPath && (
        <path
          key="viewport"
          d={path}
          className={styles.viewport}
          style={{ strokeWidth: viewportThickness }}
        />
      )}
    </svg>
  )
}

export default MiniGlobe
