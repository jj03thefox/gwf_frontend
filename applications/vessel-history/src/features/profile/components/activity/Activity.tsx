import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import { Modal, Spinner } from '@globalfishingwatch/ui-components'
import { ApiEvent } from '@globalfishingwatch/api-types/dist'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import { VesselWithHistory } from 'types'
import {
  RenderedEvent,
  selectFilteredEvents,
} from 'features/vessels/activity/vessels-activity.selectors'
import { fetchRegionsThunk } from 'features/regions/regions.slice'
import ActivityFilters from 'features/profile/filters/ActivityFilters'
import { fetchPsmaThunk } from 'features/psma/psma.slice'
import { setHighlightedEvent } from 'features/map/map.slice'
import { useLocationConnect } from 'routes/routes.hook'
import useViewport from 'features/map/map-viewport.hooks'
import ActivityItem from './ActivityItem'
import ActivityModalContent from './ActivityModalContent'
import styles from './Activity.module.css'
interface ActivityProps {
  vessel: VesselWithHistory | null
  lastPosition: any
  lastPortVisit: any
  onMoveToMap: () => void
}

const Activity: React.FC<ActivityProps> = (props): React.ReactElement => {
  const dispatch = useDispatch()

  const eventsLoading = useSelector(selectResourcesLoading)
  const events = useSelector(selectFilteredEvents)

  const [isModalOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<RenderedEvent>()
  const openModal = useCallback((event: RenderedEvent) => {
    setSelectedEvent(event)
    setIsOpen(true)
  }, [])
  const closeModal = useCallback(() => setIsOpen(false), [])

  const {  setMapCoordinates } = useViewport()
  const { dispatchQueryParams } = useLocationConnect()
  const selectEventOnMap = useCallback((event: RenderedEvent) => {
    dispatch(setHighlightedEvent({id: event.id} as ApiEvent))
    dispatchQueryParams({ latitude: event.position.lat, longitude: event.position.lon })
    setMapCoordinates({
      latitude: event.position.lat,
      longitude: event.position.lon,
      zoom: 8,
      pitch: 0,
      bearing: 0,
    })
    props.onMoveToMap()
  }, [dispatch, dispatchQueryParams, props, setMapCoordinates])

  useEffect(() => {
    dispatch(fetchRegionsThunk())
    dispatch(fetchPsmaThunk())
  }, [dispatch])

  return (
    <div className={styles.activityContainer}>
      <ActivityFilters></ActivityFilters>
      {eventsLoading && <Spinner className={styles.spinnerFull} />}
      {!eventsLoading && (
        <Fragment>
          <Modal title={selectedEvent?.description ?? ''} isOpen={isModalOpen} onClose={closeModal}>
            {selectedEvent && <ActivityModalContent event={selectedEvent}></ActivityModalContent>}
          </Modal>
          <div className={styles.activityContainer}>
            {events && events.length > 0 ? (
              <AutoSizer disableWidth={true}>
                {({ width, height }) => (
                  <List
                    width={width}
                    height={height}
                    itemCount={events.length}
                    itemData={events}
                    itemSize={() => 79}
                  >
                    {({ index, style }) => {
                      const event = events[index]
                      return (
                        <div style={style}>
                          <ActivityItem
                            key={index}
                            event={event}
                            onMapClick={(event) => selectEventOnMap(event)}
                            onInfoClick={(event) => openModal(event)}
                          />
                        </div>
                      )
                    }}
                  </List>
                )}
              </AutoSizer>
            ) : (
              <p>No events results, try change the filters</p>
            )}
          </div>
        </Fragment>
      )}
    </div>
  )
}

export default Activity