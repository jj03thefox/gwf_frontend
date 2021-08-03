import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { ActivityEvent } from 'types/activity'
import { toFixed } from 'utils/shared'
import ActivityModalContentField from './ActivityModalContentField'
import styles from './ActivityModalDetails.module.css'

interface ActivityModalContentProps {
  event: ActivityEvent
}

const ActivityModalContentDetailsLoitering: React.FC<ActivityModalContentProps> = (
  props
): React.ReactElement => {
  const event = props.event
  const { t } = useTranslation()

  return (
    <Fragment>
      <ActivityModalContentField
        label={t('event.distance', 'Distance')}
        value={
          event.loitering?.totalDistanceKilometers
            ? t('event.formatDistanceKm', '{{value}} km', {
                value: event.loitering?.totalDistanceKilometers.toFixed(2),
              })
            : DEFAULT_EMPTY_VALUE
        }
      />
      <ActivityModalContentField
        label={t('event.medianSpeed', 'Median Speed')}
        value={
          event.loitering?.medianSpeedKnots
            ? t('event.formatSpeedKnots', '{{value}} knots', {
                value: event.loitering?.medianSpeedKnots.toFixed(2),
              })
            : DEFAULT_EMPTY_VALUE
        }
      />
      <ActivityModalContentField
        className={styles.oneColumnField}
        label={t('event.position', 'Position')}
        value={`${toFixed(event.position.lat, 4)}, ${toFixed(event.position.lon, 4)}`}
      />
    </Fragment>
  )
}

export default ActivityModalContentDetailsLoitering
