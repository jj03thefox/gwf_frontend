import React, { memo, Fragment, useEffect, createRef, useContext } from 'react'
import { useSelector } from 'react-redux'
import { createSliderWithTooltip, Range as SliderRange } from 'rc-slider'
import './range.css'
import type { NumberValue } from 'd3-scale'
import { Timebar, TimelineContext, TimebarHighlighter } from '@globalfishingwatch/timebar'
import { useTimebarModeConnect, useTimerangeConnect } from '../../features/timebar/timebar.hooks'
import {
  selectFilteredDistanceFromPort,
  selectFilteredElevation,
  selectFilteredHours,
  selectFilteredSpeed,
} from '../../routes/routes.selectors'
import { Field } from '../../data/models'
import { useAppDispatch } from '../../store.hooks'
import {
  setHighlightedTime,
  disableHighlightedTime,
  selectHighlightedTime,
  selectTooltip,
  selectHighlightedEvent,
} from './timebar.slice'
import styles from './Timebar.module.css'
import { selectNightLayer, selectRangeFilterLimits } from './timebar.selectors'
import TimebarSelector from './selector/Selector'
import { VesselEventsPointsGraphDeckGL } from './VesselEventsPointsGraphDeckGL'

const TIMEBAR_DEFAULT_HEIGHT = 300

const DayNightTimebarLayer = () => {
  // TODO: Performance issue if we have lot of points
  const { outerScale } = useContext(TimelineContext)
  const nightSegments = useSelector(selectNightLayer)
  return (
    <div>
      {nightSegments.flatMap((segment) => {
        const startX = outerScale(new Date(segment.from))
        const endX = outerScale(new Date(segment.to))
        const width = endX - startX
        if (segment.isNight) {
          return null
        }
        return (
          <svg
            key={segment.from}
            height="100%"
            style={{
              background:
                'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 42.17%, rgba(255,255,255,0) 100%)',
              position: 'absolute',
              left: startX,
              opacity: 0.2,
              cursor: 'default',
              border: 'none',
              top: 0,
              width: width,
              height: '100%',
            }}
          ></svg>
        )
      })}
    </div>
  )
}

const TimebarWrapper = () => {
  const {
    start,
    end,
    dispatchTimerange,
    dispatchSpeed,
    dispachHours,
    dispachElevation,
    dispachDistanceFromPort,
  } = useTimerangeConnect()
  const highlightedTime = useSelector(selectHighlightedTime)
  const highlightedEvent = useSelector(selectHighlightedEvent)
  const { filterMode } = useTimebarModeConnect()
  // const tracks = useSelector(getTracksData)

  const dispatch = useAppDispatch()

  const myRef = createRef<any>()
  const { minSpeed, maxSpeed } = useSelector(selectFilteredSpeed)
  const { minElevation, maxElevation } = useSelector(selectFilteredElevation)
  const { minDistanceFromPort, maxDistanceFromPort } = useSelector(selectFilteredDistanceFromPort)
  const { fromHour, toHour } = useSelector(selectFilteredHours)
  // const tracksEvents = useSelector(getEventsForTracks)
  const rangeLimits = useSelector(selectRangeFilterLimits)
  //Those three handlers update the filters when we modify the Range
  const handleSpeedChange = (values: number[]) => {
    dispatchSpeed(values)
  }
  const handleElevationChange = (values: number[]) => {
    dispachElevation(values)
  }
  const handleDistanceFromPortChange = (values: number[]) => {
    dispachDistanceFromPort(values)
  }
  const handleTimeChange = (values: number[]) => {
    dispachHours(values)
  }

  // Transform the range slider for filter the timebar to vertical style
  useEffect(() => {
    if (myRef !== null && myRef.current !== null) {
      // OR HERE? console.log(myRef.current.value)
      myRef.current.setAttribute('orientation', 'vertical')
    }
  }, [myRef])

  const Range = createSliderWithTooltip(SliderRange)

  const tooltip = useSelector(selectTooltip)
  const absoluteStart = new Date('2012-01-01')
  const absoluteEnd = new Date()

  return (
    <Fragment>
      <div className={styles.timebarContainer}>
        {tooltip && <div className={styles.pointTooltip}>{tooltip}</div>}
        <Timebar
          start={start}
          end={end}
          showPlayback={false}
          absoluteStart={absoluteStart.toISOString()}
          absoluteEnd={absoluteEnd.toISOString()}
          onChange={dispatchTimerange}
          isResizable={true}
          defaultHeight={TIMEBAR_DEFAULT_HEIGHT}
          trackGraphOrientation={'up'}
          //bookmarkStart={bookmarkStart}
          //bookmarkEnd={bookmarkEnd}
          // showLastUpdate={false}
          //onBookmarkChange={dispatchBookmarkTimerange}
          onMouseMove={(clientX: number | null, scale: ((arg: NumberValue) => Date) | null) => {
            if (clientX === null || scale === null) {
              if (highlightedTime !== undefined) {
                dispatch(disableHighlightedTime())
              }
              return
            }
            const start = scale(clientX - 10).toISOString()
            const end = scale(clientX + 10).toISOString()
            dispatch(setHighlightedTime({ start, end }))
          }}
        >
          <Fragment>
            <DayNightTimebarLayer></DayNightTimebarLayer>
            <VesselEventsPointsGraphDeckGL />
            {/* {
              <Fragment>
                {tracks.length && <TimebarTracks key="tracks" data={tracks as any} />}
                {tracksEvents.length && (
                  <Fragment>{<TimebarTracksEvents key="events" data={tracksEvents} />}</Fragment>
                )}
              </Fragment>
            } */}
            {/* {tracks.length && false && (
                <TimebarActivity
                  key="trackActivity"
                  opacity={0.7}
                  // curve="curveBasis"
                  graphTracks={tracksGraph}
                />
              )} */}
            <Fragment>
              {highlightedTime && (
                <TimebarHighlighter
                  hoverStart={highlightedTime.start}
                  hoverEnd={highlightedTime.end}
                />
              )}
            </Fragment>
            <Fragment>
              {highlightedEvent && (
                <TimebarHighlighter
                  hoverStart={highlightedEvent.start}
                  hoverEnd={highlightedEvent.end}
                />
              )}
            </Fragment>
          </Fragment>
        </Timebar>
      </div>
      <div className={styles.filtersContainer}>
        {filterMode === Field.speed && (
          <Range
            min={rangeLimits.speed.min}
            max={rangeLimits.speed.max}
            step={0.1}
            vertical
            onAfterChange={handleSpeedChange}
            allowCross={false}
            tipFormatter={(value) => `${value} kt`}
            tipProps={{ placement: 'right' }}
            defaultValue={[minSpeed, maxSpeed]}
          />
        )}
        {filterMode === Field.timestamp && (
          <Range
            min={rangeLimits.hours.min}
            max={rangeLimits.hours.max}
            step={1}
            vertical
            onAfterChange={handleTimeChange}
            allowCross={false}
            tipFormatter={(value) => `${value} hs`}
            tipProps={{ placement: 'right' }}
            defaultValue={[fromHour, toHour]}
          />
        )}
        {filterMode === Field.elevation && (
          <Range
            min={rangeLimits.elevation.min}
            max={rangeLimits.elevation.max}
            step={1}
            vertical
            onAfterChange={handleElevationChange}
            allowCross={false}
            tipFormatter={(value) => `${value} mt`}
            tipProps={{ placement: 'right' }}
            defaultValue={[minElevation, maxElevation]}
          />
        )}
        {filterMode === Field.distanceFromPort && (
          <Range
            min={rangeLimits.distanceFromPort.min}
            max={rangeLimits.distanceFromPort.max}
            step={1}
            vertical
            onAfterChange={handleDistanceFromPortChange}
            allowCross={false}
            tipFormatter={(value) => `${value} mt`}
            tipProps={{ placement: 'right' }}
            defaultValue={[minDistanceFromPort, maxDistanceFromPort]}
          />
        )}
        <TimebarSelector />
      </div>
    </Fragment>
  )
}

export default memo(TimebarWrapper)
