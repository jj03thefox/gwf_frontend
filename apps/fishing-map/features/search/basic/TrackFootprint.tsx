import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import cx from 'classnames'
import { geoEqualEarth, geoPath } from 'd3'
import { Feature, FeatureCollection, GeoJsonProperties, Geometry, LineString } from 'geojson'
import { DateTime } from 'luxon'
import qs from 'qs'
import area from '@turf/area'
import bbox from '@turf/bbox'
import bboxPolygon from '@turf/bbox-polygon'
import { GFWAPI, THINNING_LEVELS } from '@globalfishingwatch/api-client'
import { Icon, Spinner } from '@globalfishingwatch/ui-components'
import { segmentsToGeoJSON, trackValueArrayToSegments } from '@globalfishingwatch/data-transforms'
import { Field } from '@globalfishingwatch/api-types'
import { useOnScreen, useScreenDPI } from 'hooks/screen.hooks'
import styles from './TrackFootprint.module.css'

type TrackFootprintProps = {
  vesselIds: string[]
  trackDatasetId?: string
  highlightedYear?: number
  onDataLoad?: (data: FeatureCollection) => void
}

const FOOTPRINT_WIDTH = 300
const FOOTPRINT_HEIGHT = 150
const MAX_SMALL_AREA_M = 2000000000000

const TRACK_FOOTPRINT_QUERY = {
  ...THINNING_LEVELS.Footprint,
  binary: true,
  fields: 'lonlat,timestamp',
  format: 'valueArray',
}

function TrackFootprint({
  vesselIds,
  trackDatasetId,
  highlightedYear,
  onDataLoad,
}: TrackFootprintProps) {
  const [trackData, setTrackData] = useState<FeatureCollection<Geometry, GeoJsonProperties>>()
  const [error, setError] = useState(false)
  const fullCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const highlightCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const onScreen = useOnScreen(fullCanvasRef)
  const screenDPI = useScreenDPI()
  const isHighDensityDisplay = screenDPI && screenDPI >= 96
  const densityMultiplier = isHighDensityDisplay ? 2 : 1
  const footprintWidth = FOOTPRINT_WIDTH * densityMultiplier
  const footprintHeight = FOOTPRINT_HEIGHT * densityMultiplier
  const fullContext = fullCanvasRef.current?.getContext('2d')
  const highlightContext = highlightCanvasRef.current?.getContext('2d')

  const projection = useMemo(
    () =>
      geoEqualEarth()
        .scale(isHighDensityDisplay ? 107 : 53.5)
        .translate([footprintWidth / 2, footprintHeight / 2]),
    [footprintHeight, footprintWidth, isHighDensityDisplay]
  )

  const fetchData = useCallback(
    async (vesselIds: string[]) => {
      if (!trackDatasetId) {
        setError(true)
        return
      }
      const vesselData = await GFWAPI.fetch<any>(
        `/vessels/${vesselIds}/tracks?${qs.stringify({
          ...TRACK_FOOTPRINT_QUERY,
          datasets: trackDatasetId,
        })}`,
        {
          responseType: 'vessel',
        }
      )

      if (vesselData.length === 0) {
        setError(true)
        return
      }

      const segments = trackValueArrayToSegments(vesselData, [Field.lonlat, Field.timestamp])
      const geoJson = segmentsToGeoJSON(segments)
      setTrackData(geoJson)
      if (onDataLoad) onDataLoad(geoJson)
    },
    [onDataLoad, trackDatasetId]
  )

  useEffect(() => {
    if (onScreen && !trackData && !error && vesselIds?.length) {
      fetchData(vesselIds)
    }
  }, [error, fetchData, onScreen, trackData, vesselIds])

  useEffect(() => {
    if (fullContext && trackData) {
      const isSmallFootprint = area(bboxPolygon(bbox(trackData))) < MAX_SMALL_AREA_M
      const fullPath = geoPath(projection, fullContext).pointRadius(1)
      fullContext.lineCap = 'round'
      fullContext.lineJoin = 'round'
      fullContext.lineWidth = isSmallFootprint ? 12 * densityMultiplier : 2 * densityMultiplier
      fullContext.strokeStyle = '#42639C'
      trackData.features.forEach((feature: Feature<any>) => {
        fullContext.beginPath()
        fullPath(
          feature.geometry.coordinates.length === 1
            ? { type: 'Point', coordinates: feature.geometry.coordinates[0] }
            : feature
        )
        fullContext.stroke()
      })
    }
  }, [densityMultiplier, fullContext, isHighDensityDisplay, projection, trackData, vesselIds])

  useEffect(() => {
    highlightContext?.clearRect(0, 0, footprintWidth, footprintHeight)
    const highlightPath = geoPath(projection, highlightContext)
    if (trackData && highlightedYear && highlightContext) {
      const highlightedYearDateTime = DateTime.fromObject({ year: highlightedYear })
      const highlightStart = highlightedYearDateTime.toMillis()
      const highlightEnd = highlightedYearDateTime.plus({ year: 1 }).toMillis()
      const highlightedTrack = {
        ...trackData,
        features: trackData.features.flatMap((feature) => {
          const featureTimes = feature.properties?.coordinateProperties.times
          if (
            featureTimes[featureTimes.length - 1] < highlightStart ||
            featureTimes[0] > highlightEnd
          ) {
            return []
          }
          return {
            ...feature,
            geometry: {
              ...feature.geometry,
              coordinates: (feature.geometry as any).coordinates.filter(
                (_: any, index: number) =>
                  featureTimes[index] > highlightStart && featureTimes[index] < highlightEnd
              ),
            },
          }
        }),
      }
      highlightContext.lineCap = 'round'
      highlightContext.lineJoin = 'round'
      highlightContext.lineWidth = 4 * densityMultiplier
      highlightContext.strokeStyle = '#42639C'
      highlightedTrack.features.forEach((feature) => {
        highlightContext.beginPath()
        highlightPath(feature)
        highlightContext.stroke()
      })
    }
  }, [
    densityMultiplier,
    footprintHeight,
    footprintWidth,
    highlightContext,
    highlightedYear,
    projection,
    trackData,
  ])

  return (
    <div className={styles.map}>
      <canvas
        className={cx(styles.canvas, { [styles.faint]: highlightedYear })}
        width={footprintWidth}
        height={footprintHeight}
        ref={fullCanvasRef}
      />
      <canvas
        className={styles.canvas}
        width={footprintWidth}
        height={footprintHeight}
        ref={highlightCanvasRef}
      />
      {!trackData && !error && vesselIds?.length > 0 && (
        <Spinner size="small" className={styles.spinner} />
      )}
      {error && <Icon icon="warning" type="warning" />}
    </div>
  )
}

export default TrackFootprint
