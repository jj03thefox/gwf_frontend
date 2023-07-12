import React, { Fragment } from 'react'
import cx from 'classnames'
import { Icon, IconButton } from '@globalfishingwatch/ui-components'
import { EventTypes } from '@globalfishingwatch/api-types'
import { getEncounterStatus } from 'features/vessel/activity/vessels-activity.utils'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import ActivityDate from './ActivityDate'
import ActivityEventPortVisit from './EventPortVisit'
import useActivityEventConnect from './event.hook'
import styles from './Event.module.css'

interface EventProps {
  classname?: string
  style?: React.CSSProperties
  event: ActivityEvent
  onInfoClick?: (event: ActivityEvent) => void
  onMapClick?: (event: ActivityEvent) => void
}

const EventItem: React.FC<EventProps> = (props): React.ReactElement => {
  const { classname = '', event, style, onInfoClick = () => {}, onMapClick = () => {} } = props
  const { getEventDescription } = useActivityEventConnect()
  return event.type !== EventTypes.Port ? (
    <Fragment>
      <li className={cx(styles.event, classname)} style={style}>
        <div
          className={cx(styles.eventIcon, styles[event.type], styles[getEncounterStatus(event)])}
        >
          <Icon icon={`event-${event.type}`} />
        </div>
        <div className={styles.eventData}>
          <ActivityDate event={event} />
          <div className={styles.description}>{getEventDescription(event)}</div>
        </div>
        <div className={styles.actions}>
          <IconButton icon="info" size="small" onClick={() => onInfoClick(event)}></IconButton>
          <IconButton
            icon="view-on-map"
            size="small"
            onClick={() => onMapClick(event)}
          ></IconButton>
        </div>
      </li>
    </Fragment>
  ) : (
    <ActivityEventPortVisit {...props} />
  )
}

export default EventItem
