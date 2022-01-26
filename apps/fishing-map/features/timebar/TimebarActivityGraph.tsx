import React, { useEffect, useState, useRef, useCallback } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
// eslint-disable-next-line import/no-webpack-loader-syntax
import { TimebarStackedActivity } from '@globalfishingwatch/timebar'
import { useDebounce, useSmallScreen } from '@globalfishingwatch/react-hooks'
import {
  TimeChunk,
  TimeChunks,
  TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
  ExtendedStyle,
} from '@globalfishingwatch/layer-composer'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { MapLibreEvent, MapSourceDataEvent } from '@globalfishingwatch/maplibre-gl'
import { MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID } from '@globalfishingwatch/dataviews-client'
import { useMapBounds, mglToMiniGlobeBounds } from 'features/map/map-viewport.hooks'
import {
  selectActiveActivityDataviews,
  selectActiveEnvironmentalDataviews,
} from 'features/dataviews/dataviews.selectors'
import useMapInstance from 'features/map/map-context.hooks'
import { BIG_QUERY_PREFIX } from 'features/dataviews/dataviews.utils'
import { getTimeseries } from './timebarActivityGraph.worker'
import styles from './Timebar.module.css'

const getMetadata = (style: ExtendedStyle) => {
  const generatorsMetadata = style?.metadata?.generatorsMetadata
  if (!generatorsMetadata) return null

  const activityHeatmapMetadata = generatorsMetadata[MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID]
  if (activityHeatmapMetadata?.timeChunks) {
    return activityHeatmapMetadata
  }

  const environmentalMetadata = Object.entries(generatorsMetadata).filter(
    ([id, metadata]) => metadata.temporalgrid === true
  )
  const bqEnvironmentalMetadata = environmentalMetadata.filter(([id]) =>
    id.includes(BIG_QUERY_PREFIX)
  )
  if (environmentalMetadata?.length === 1 && bqEnvironmentalMetadata?.length === 1) {
    return bqEnvironmentalMetadata[0][1]
  }

  return null
}

const TimebarActivityGraph = () => {
  const activityDataviews = useSelector(selectActiveActivityDataviews)
  const environmentalDataviews = useSelector(selectActiveEnvironmentalDataviews)
  const temporalGridDataviews = [...activityDataviews, ...environmentalDataviews]
  const [stackedActivity, setStackedActivity] = useState<any>()
  const { bounds } = useMapBounds()
  const debouncedBounds = useDebounce(bounds, 1000)
  const isSmallScreen = useSmallScreen()
  const attachedListener = useRef<boolean>(false)
  const map = useMapInstance()
  const computeStackedActivity = useCallback(
    (metadata: any, bounds: MiniglobeBounds) => {
      if (!map || !metadata) {
        return
      }
      const numSublayers = metadata.numSublayers
      const timeChunks = metadata.timeChunks as TimeChunks
      const allChunksFeatures = metadata.timeChunks.chunks.map((chunk: TimeChunk) => {
        const features = map.querySourceFeatures(chunk.sourceId as string, {
          sourceLayer: TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
        })

        const serializedFeatures = features.map(({ properties, geometry }) => ({
          type: 'Feature' as any,
          properties,
          geometry,
        }))

        return {
          features: serializedFeatures,
          quantizeOffset: chunk.quantizeOffset,
        }
      })

      const getTimeseriesAsync = async () => {
        const timeseries = await getTimeseries(
          allChunksFeatures,
          bounds,
          numSublayers,
          timeChunks.interval,
          metadata.visibleSublayers
        )
        if (attachedListener.current) {
          setStackedActivity(timeseries)
        }
      }
      getTimeseriesAsync()
    },
    [map]
  )

  const sourcesLoadedTimeout = useRef<number>(NaN)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!map || attachedListener.current || isSmallScreen) return
    attachedListener.current = true

    const isEventSourceActiveChunk = (e: MapSourceDataEvent) => {
      const style = (e as any).style.stylesheet
      const metadata = getMetadata(style)
      if (!metadata) {
        return {
          isActive: false,
        }
      }
      const chunkSourceIds: string[] = metadata.timeChunks.chunks.map((c: TimeChunk) => c.sourceId)
      return {
        isActive: chunkSourceIds.includes(e.sourceId),
        metadata,
      }
    }
    map.on('data', (e: MapSourceDataEvent) => {
      const { metadata, isActive } = isEventSourceActiveChunk(e)
      if (isActive && (e as any).previousState !== 'reloading') {
        if (attachedListener.current) setLoading(true)
        if (!isNaN(sourcesLoadedTimeout.current)) {
          window.clearTimeout(sourcesLoadedTimeout.current)
        }
        sourcesLoadedTimeout.current = window.setTimeout(() => {
          computeStackedActivity(metadata, mglToMiniGlobeBounds(map.getBounds()))
        }, 2000)
      }
    })
    map.on('dataloading', (e: MapSourceDataEvent) => {
      const { isActive } = isEventSourceActiveChunk(e)
      if (isActive && attachedListener.current) setLoading(true)
    })
    map.on('idle', (e: MapLibreEvent) => {
      // If there's still a timer running when idle, skip it and render graph immediately
      if (!isNaN(sourcesLoadedTimeout.current)) {
        window.clearTimeout(sourcesLoadedTimeout.current)
        sourcesLoadedTimeout.current = NaN
        const style = (e.target as any).style.stylesheet
        const metadata = getMetadata(style)

        computeStackedActivity(metadata, mglToMiniGlobeBounds(map.getBounds()))
      }

      if (attachedListener.current) setLoading(false)
    })
    return () => {
      attachedListener.current = false
    }
  }, [map, computeStackedActivity, isSmallScreen])

  useEffect(() => {
    // Need to check for first load to ensure getStyle doesn't crash
    if (!map || !map.loaded || !map.loaded() || !debouncedBounds || isSmallScreen) return
    const metadata = getMetadata(map?.getStyle())
    computeStackedActivity(metadata, debouncedBounds)
  }, [debouncedBounds, computeStackedActivity, map, isSmallScreen])

  if (!stackedActivity) return null
  return (
    <div className={cx({ [styles.loading]: loading })}>
      <TimebarStackedActivity
        key="stackedActivity"
        timeseries={stackedActivity}
        dataviews={temporalGridDataviews}
      />
    </div>
  )
}

export default TimebarActivityGraph
