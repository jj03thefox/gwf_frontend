import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import formatcoords from 'formatcoords'
import ResizePanel from 'react-resize-panel'
import { IconButton } from '@globalfishingwatch/ui-components'
import { ApiEvent } from '@globalfishingwatch/api-types/dist/events'
import { RenderedEvent, selectMapEvents } from 'features/vessels/activity/vessels-activity.selectors'
import ActivityModalContent from 'features/profile/components/activity/ActivityModalContent'
import ActivityDate from 'features/profile/components/activity/ActivityDate'
import { cheapDistance } from 'utils/vessel'
import { selectHighlightedEvent, setHighlightedEvent } from '../map.slice'
import styles from './Info.module.css'

interface InfoProps {
  map: any
  onEventChange: (event: RenderedEvent, pitch: number, bearing: number, padding: number) => void
}

const Info: React.FC<InfoProps> = (props): React.ReactElement => {
  const dispatch = useDispatch()
  const [height, setHeight] = useState(0)
  const events: RenderedEvent[] = useSelector(selectMapEvents)
  const eventsMap: string[] = useMemo(() => events.map(e => e.id), [events])
  const highlightedEvent = useSelector(selectHighlightedEvent)
  const [selectedEvent, setSelectedEvent] = useState<RenderedEvent | undefined>(undefined)

  const changeVesselEvent = useCallback((actualEventId, direction) => {
      const actualEventIndex = eventsMap.indexOf(actualEventId.id)
      const nextPosition = direction === 'prev' ? actualEventIndex - 1 : actualEventIndex + 1;
      if (nextPosition >= 0 && nextPosition < eventsMap.length) {
        const nextEvent = events[nextPosition]
        dispatch(setHighlightedEvent({id: eventsMap[nextPosition] } as ApiEvent))
        const distance = Math.floor(cheapDistance(nextEvent.position, events[actualEventIndex].position) * 10)
        const pitch = Math.min(distance * 4, 60)

        const bearing = Math.atan2(
          nextEvent.position.lon - events[actualEventIndex].position.lon, 
          nextEvent.position.lat - events[actualEventIndex].position.lat
        ) * pitch * -1;
        props.onEventChange(nextEvent, pitch, bearing, height)
      }
    }, [dispatch, events, eventsMap, height, props]
  )

  useEffect(() => {
    const event = events.find(e => e.id === highlightedEvent?.id)
    if (event){
      setSelectedEvent(event)
    }else{
      setSelectedEvent(undefined)
    }
  }, [highlightedEvent, dispatch, events, selectedEvent])

  return (
    <Fragment>
      {selectedEvent && (
        <ResizePanel direction="n" containerClass={styles.infoContainer} handleClass={styles.handler} style={{height: '50px'}}>
          <div className={cx(styles.footer, styles.panel)} ref={el => {
            if (!el) return;
            setHeight(el.getBoundingClientRect().height + 19) // I add the parent padding
          }}>
            <div className={styles.eventSelector}> 
              <IconButton icon="arrow-left" type="map-tool" size="small" onClick={() => changeVesselEvent(highlightedEvent, 'prev')}></IconButton>
              <span className={styles.coords}>
                {formatcoords(selectedEvent.position.lat, selectedEvent.position.lon).format('DDMMssX', {
                  latLonSeparator: ' ',
                  decimalPlaces: 2,
                })}
              </span> 
              <IconButton icon="arrow-right" type="map-tool" size="small" onClick={() => changeVesselEvent(highlightedEvent, 'next')}></IconButton>
            </div>
              <div className={cx(styles.footerArea)}>
                <div className={cx(styles.footerAreaContent)}>
                  <div className={styles.eventData}>
                    <ActivityDate event={selectedEvent} className={styles.dateFormat} />
                    <div className={styles.description}>{selectedEvent.description}</div>
                  </div>

                  <ActivityModalContent event={selectedEvent}></ActivityModalContent>
                </div>
              </div>
            </div>
        </ResizePanel>
      )}
    </Fragment>
  )
}

export default Info
