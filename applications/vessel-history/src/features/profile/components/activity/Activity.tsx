import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { IconButton, Modal } from '@globalfishingwatch/ui-components'
import { VesselWithHistory } from 'types'
import { selectVesselActivityEvents } from 'features/vessels/activity/vessels-activity.slice'
import { ActivityEvent, ActivityEventGroup } from 'types/activity'
import I18nDate from 'features/i18n/i18nDate'
import { fetchRegionsThunk } from 'features/regions/regions.slice'
import styles from './Activity.module.css'
import ActivityDate from './ActivityDate'
import ActivityDescription from './description/ActivityDescription'
import ActivityGroupDescription from './description/ActivityGroupDescription'
import ActivityModalContent from './ActivityModalContent'
interface InfoProps {
  vessel: VesselWithHistory | null
  lastPosition: any
  lastPortVisit: any
}

const Activity: React.FC<InfoProps> = (props): React.ReactElement => {
  const dispatch = useDispatch()

  const eventGroups = useSelector(selectVesselActivityEvents)
  const [groupOpen, setGroupOpen] = useState<{ [start: number]: boolean }>({})

  const onOpenGroup = useCallback((index: number) => {
    setGroupOpen({
      ...groupOpen,
      [index]: !(groupOpen[index] ?? false),
    })
  }, [])

  const [isModalOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent>()
  const openModal = useCallback((event: ActivityEvent) => {
    setSelectedEvent(event)
    setIsOpen(true)
  }, [])
  const closeModal = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    dispatch(fetchRegionsThunk())
  }, [dispatch])

  // console.log(eventGroups)
  return (
    <Fragment>
      <Modal
        title={
          selectedEvent ? <ActivityDescription event={selectedEvent}></ActivityDescription> : ''
        }
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        {selectedEvent && <ActivityModalContent event={selectedEvent}></ActivityModalContent>}
      </Modal>
      <div className={styles.activityContainer}>
        {eventGroups &&
          eventGroups.map((group: ActivityEventGroup, groupIndex) => (
            <Fragment key={groupIndex}>
              {!groupOpen[groupIndex] && group.entries && (
                <Fragment>
                  <div className={styles.event}>
                    <div className={styles.eventIcon}>
                      <i></i>
                      <span className={styles.eventCount}>{group.entries.length}</span>
                    </div>
                    <div className={styles.eventData}>
                      <div className={styles.date}>
                        <I18nDate date={group.start} format={DateTime.DATE_SHORT} /> -
                        <I18nDate date={group.end} format={DateTime.DATE_SHORT} />
                      </div>
                      <div className={styles.description}>
                        <ActivityGroupDescription group={group}></ActivityGroupDescription>
                      </div>
                    </div>
                    {group.entries.length > 1 && (
                      <div className={styles.actions}>
                        <IconButton
                          icon="compare"
                          size="small"
                          onClick={() => onOpenGroup(groupIndex)}
                        ></IconButton>
                      </div>
                    )}
                  </div>
                  <div className={styles.divider}></div>
                </Fragment>
              )}
              {groupOpen[groupIndex] &&
                group.entries &&
                group.entries.map((event: ActivityEvent, eventIndex) => (
                  <Fragment key={eventIndex}>
                    <div className={styles.event}>
                      <div className={styles.eventIcon}>
                        <i></i>
                      </div>
                      <div className={styles.eventData}>
                        <ActivityDate event={event} />
                        <div className={styles.description}>
                          <ActivityDescription event={event}></ActivityDescription>
                        </div>
                      </div>

                      <div className={styles.actions}>
                        <IconButton
                          icon="info"
                          size="small"
                          onClick={() => openModal(event)}
                        ></IconButton>
                        <IconButton icon="view-on-map" size="small"></IconButton>
                      </div>
                      <div className={styles.divider}></div>
                    </div>
                  </Fragment>
                ))}
            </Fragment>
          ))}
      </div>
    </Fragment>
  )
}

export default Activity
