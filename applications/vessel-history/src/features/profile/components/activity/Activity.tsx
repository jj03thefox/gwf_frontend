import React, { Fragment, useCallback, useEffect } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { IconButton } from '@globalfishingwatch/ui-components'
import { VesselWithHistory } from 'types'
import { selectVesselId } from 'routes/routes.selectors'
import { fetchVesselActivityThunk } from 'features/vessels/activity/vessels-activity.thunk'
import {
  selectVesselActivity,
  selectVesselActivityEvents,
  toggleGroup,
} from 'features/vessels/activity/vessels-activity.slice'
import { ActivityEvent, ActivityEventGroup } from 'types/activity'
import I18nDate from 'features/i18n/i18nDate'
import { fetchRegionsThunk } from 'features/regions/regions.slice'
import styles from './Activity.module.css'
import ActivityDate from './ActivityDate'
import ActivityDescription from './description/ActivityDescription'
import ActivityGroupDescription from './description/ActivityGroupDescription'

interface InfoProps {
  vessel: VesselWithHistory | null
  lastPosition: any
  lastPortVisit: any
}

const Activity: React.FC<InfoProps> = (props): React.ReactElement => {
  const { t } = useTranslation()
  // const vesselId = useSelector(selectVesselId)

  const dispatch = useDispatch()
  // useEffect(() => {
  //   if (vesselId) {
  //     const start = '2017-01-01'
  //     const end = '2021-07-01'
  //     dispatch(fetchVesselActivityThunk({ vesselId, start, end }))
  //   }
  // }, [dispatch, vesselId])

  const onOpenGroup = useCallback(
    (index: number) => {
      dispatch(toggleGroup({ index }))
    },
    [dispatch]
  )

  useEffect(() => {
    dispatch(fetchRegionsThunk())
  }, [dispatch])

  // const eventGroups = useSelector(selectVesselActivity)
  const eventGroups = useSelector(selectVesselActivityEvents)
  // console.log(events)
  return (
    <Fragment>
      <div className={styles.activityContainer}>
        {eventGroups &&
          eventGroups.map((group: ActivityEventGroup, groupIndex) => (
            <Fragment key={groupIndex}>
              {!group.open && group.entries && (
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
              {group.open &&
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
                        <IconButton icon="info" size="small"></IconButton>
                        <IconButton icon="view-on-map" size="small"></IconButton>
                      </div>
                    </div>
                    <div className={styles.divider}></div>
                  </Fragment>
                ))}
            </Fragment>
          ))}
      </div>
    </Fragment>
  )
}

export default Activity
