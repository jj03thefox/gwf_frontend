import { Fragment } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { capitalize } from 'lodash'
import { Icon, IconButton } from '@globalfishingwatch/ui-components'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import ActivityDate from './ActivityDate'
import styles from './Activity.module.css'

interface EventProps {
  classname?: string
  event: RenderedEvent
  highlighted?: boolean
  onInfoClick?: (event: RenderedEvent) => void
  onMapClick?: (event: RenderedEvent) => void
  options?: {
    displayPortVisitsAsOneEvent: boolean
  }
}

const ActivityEventPortVisit: React.FC<EventProps> = ({
  classname = '',
  event,
  highlighted = false,
  onInfoClick = () => {},
  onMapClick = () => {},
  options: { displayPortVisitsAsOneEvent } = { displayPortVisitsAsOneEvent: false },
}): React.ReactElement => {
  const { t } = useTranslation()
  if (event.type !== 'port_visit') return

  const isPortExit = event.id.endsWith('-exit')
  const isPortEntry = event.id.endsWith('-entry')
  const isPortVisit = !isPortExit && !isPortEntry
  const portType = isPortVisit ? null : isPortExit ? 'exited' : 'entered'

  console.log(event, { isPortExit, isPortEntry, isPortVisit })

  return (
    <Fragment>
      {isPortVisit && displayPortVisitsAsOneEvent && (
        <Fragment>
          <div className={styles.displayPortVisitsAsOneEvent}>
            <div className={cx(styles.event, classname)}>
              <div
                className={cx(
                  styles.eventIcon,
                  styles[event.type],
                  highlighted ? styles.highlighted : ''
                )}
              >
                <Icon icon="event-port-visit" type="default" />
              </div>
              <div className={styles.eventData}>
                <label className={styles.date}>{event.durationDescription}</label>
                <div className={styles.description}>{event.description}</div>
              </div>
              <div className={styles.actions}>
                <IconButton
                  icon="info"
                  size="small"
                  onClick={() => onInfoClick(event)}
                ></IconButton>
              </div>
            </div>
            <div className={styles.divider}></div>
          </div>
        </Fragment>
      )}
      {(isPortExit || isPortEntry) && (
        <Fragment>
          <div
            className={cx(
              displayPortVisitsAsOneEvent && styles.displayPortVisitsAsOneEvent,
              styles[`${event.type}_${[portType]}`]
            )}
          >
            <div className={cx(styles.event, classname)}>
              <div
                className={cx(
                  styles.eventIcon,
                  styles[event.type],
                  styles[`${event.type}_${[portType]}`],
                  highlighted ? styles.highlighted : ''
                )}
              >
                {event.type === 'port_visit' && <Icon icon="event-port-visit" type="default" />}
              </div>
              <div className={styles.eventData}>
                {displayPortVisitsAsOneEvent && (
                  <Fragment>
                    <div className={styles.description}>
                      {t(`event.${portType}On`, `${capitalize(portType)} on {{date}}`, {
                        date: formatI18nDate(event.timestamp, { format: DateTime.DATETIME_SHORT }),
                      })}{' '}
                    </div>
                  </Fragment>
                )}
                {!displayPortVisitsAsOneEvent && (
                  <Fragment>
                    <ActivityDate event={event} />
                    <div className={styles.description}>{event.description}</div>
                  </Fragment>
                )}
              </div>
              <div className={styles.actions}>
                {!displayPortVisitsAsOneEvent && (
                  <IconButton
                    icon="info"
                    size="small"
                    onClick={() => onInfoClick(event)}
                  ></IconButton>
                )}
                <IconButton
                  icon="view-on-map"
                  size="small"
                  onClick={() => onMapClick(event)}
                ></IconButton>
              </div>
            </div>
            <div className={styles.divider}></div>
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

export default ActivityEventPortVisit

// t('events.eenteredPortOn', 'Entered on {{date}}')
// t('events.exitedPortOn', 'Exited on {{date}}')
