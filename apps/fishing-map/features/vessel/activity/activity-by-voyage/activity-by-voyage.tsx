import { Fragment, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import { Modal, Spinner } from '@globalfishingwatch/ui-components'
import {
  RenderedEvent,
  selectEventsLoading,
} from 'features/vessel/activity/vessels-activity.selectors'
import { EventTypeVoyage, Voyage } from 'types/voyage'
import { t } from 'features/i18n/i18n'
import useVoyagesConnect from 'features/vessel/voyages/voyages.hook'
import { selectVesselId } from 'routes/routes.selectors'
//import useMapEvents from 'features/map/map-events.hooks'
import useViewport from 'features/map/map-viewport.hooks'
import ActivityModalContent from 'features/vessel/activity/modals/ActivityModalContent'
import { DEFAULT_VIEWPORT } from 'data/config'
import ActivityItem from '../ActivityItem'
import styles from '../activity-by-type/activity-by-type.module.css'
interface ActivityProps {
  onMoveToMap: () => void
}

const ActivityByVoyage: React.FC<ActivityProps> = (props): React.ReactElement => {
  const { events, toggleVoyage } = useVoyagesConnect()
  const eventsLoading = useSelector(selectEventsLoading)
  const [isModalOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<RenderedEvent>()
  const openModal = useCallback((event: RenderedEvent) => {
    setSelectedEvent(event)
    setIsOpen(true)
  }, [])
  const closeModal = useCallback(() => setIsOpen(false), [])
  //const { highlightEvent, highlightVoyage } = useMapEvents()
  const { viewport, setMapCoordinates } = useViewport()
  //const highlightsIds = useSelector(selectHighlightEventIds)

  const selectEventOnMap = useCallback(
    (event: RenderedEvent | Voyage) => {
      if (event.type === EventTypeVoyage.Voyage) {
        //highlightVoyage(event)
      } else {
        //highlightEvent(event)

        setMapCoordinates({
          latitude: event.position.lat,
          longitude: event.position.lon,
          zoom: viewport.zoom ?? DEFAULT_VIEWPORT.zoom,
        })
      }

      props.onMoveToMap()
    },
    [/*highlightEvent, highlightVoyage,*/ props, setMapCoordinates, viewport.zoom]
  )
  return (
    <div className={styles.activityContainer}>
      {eventsLoading && <Spinner className={styles.spinnerFull} />}
      {!eventsLoading && (
        <Fragment>
          <Modal
            appSelector="__next"
            title={selectedEvent?.description ?? ''}
            isOpen={isModalOpen}
            onClose={closeModal}
          >
            {selectedEvent && <ActivityModalContent event={selectedEvent}></ActivityModalContent>}
          </Modal>
          <div className={styles.activityContainer}>
            {events &&
              events.length &&
              events.map((event, index) => (
                <div>
                  <ActivityItem
                    key={index}
                    event={event}
                    highlighted={
                      event.type !== EventTypeVoyage.Voyage //&& highlightsIds[event.id]
                    }
                    onToggleClick={toggleVoyage}
                    onMapClick={selectEventOnMap}
                    onInfoClick={openModal}
                  />
                </div>
              ))}
          </div>
        </Fragment>
      )}
    </div>
  )
}

export default ActivityByVoyage
