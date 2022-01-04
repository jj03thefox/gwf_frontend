import React, { useContext, useMemo } from 'react'
import cx from 'classnames'
import { TimelineContextProps, TimelineScale } from '../types'
import TimelineContext from '../timelineContext'
import ImmediateContext from '../immediateContext'
import { DEFAULT_CSS_TRANSITION } from '../constants'
import { TimebarChartData, TimebarChartItem, TrackEventChunkProps } from './common/types'
import styles from './tracks-events.module.css'
import { useFilteredChartData } from './common/hooks'
import { getTrackY } from './common/utils'

const getTracksEventsWithCoords = (
  tracksEvents: TimebarChartData,
  outerScale: TimelineScale,
  graphHeight: number
) => {
  // TODO merge with Tracks' getTracksWithCoords
  return tracksEvents.map((trackEvents, trackIndex) => {
    const baseTrackY = getTrackY(tracksEvents.length, trackIndex, graphHeight)
    const trackItemWithCoords: TimebarChartItem = {
      ...trackEvents,
      y: baseTrackY.defaultY,
      chunks: !trackEvents.chunks
        ? []
        : trackEvents.chunks.map((chunk) => {
            const x = outerScale(chunk.start)
            const x2 = chunk.end ? outerScale(chunk.end) : x
            const width = Math.max(1, x2 - x)
            return {
              ...chunk,
              x,
              width,
            }
          }),
    }
    return trackItemWithCoords
  })
}

const TracksEvents = ({ data }: { data: TimebarChartData }) => {
  const { immediate } = useContext(ImmediateContext) as any
  const {
    outerScale,
    outerWidth,
    graphHeight,
    tooltipContainer,
    start,
    end,
    outerStart,
    outerEnd,
  } = useContext(TimelineContext) as TimelineContextProps
  const filteredTracksEvents = useFilteredChartData(data as TimebarChartData)
  const tracksEventsWithCoords = useMemo(
    () => getTracksEventsWithCoords(filteredTracksEvents, outerScale, graphHeight),
    [filteredTracksEvents, outerScale, graphHeight]
  ) as TimebarChartData<TrackEventChunkProps>

  return (
    <div className={styles.Events}>
      {tracksEventsWithCoords.map((trackEvents, index) => (
        <div
          key={index}
          className={styles.track}
          style={{
            top: `${trackEvents.y}px`,
          }}
        >
          {trackEvents.chunks.map((event) => (
            <div
              key={event.id}
              className={cx(styles.event, {
                // [styles.highlighted]: eventHighlighted && eventHighlighted.id === event.id,
              })}
              data-type={event.props?.type}
              style={{
                background: event.props?.color || 'white',
                left: `${event.x}px`,
                width: `${event.width}px`,
                height: '5px',
                // ...(event.height && { height: `${event.height}px` }),
                transition: immediate
                  ? 'none'
                  : `left ${DEFAULT_CSS_TRANSITION}, height ${DEFAULT_CSS_TRANSITION}, width ${DEFAULT_CSS_TRANSITION}`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default TracksEvents
