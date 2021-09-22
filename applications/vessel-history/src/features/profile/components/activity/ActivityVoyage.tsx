import { Fragment, useCallback, useMemo } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { IconButton } from '@globalfishingwatch/ui-components'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { RenderedVoyage } from 'types/voyage'
import styles from './Activity.module.css'

interface EventProps {
  event: RenderedVoyage
  onMapClick?: (event: RenderedVoyage) => void
  onToggleClick?: (event: RenderedVoyage) => void
}

const ActivityVoyage: React.FC<EventProps> = ({
  event,
  onMapClick = () => {},
  onToggleClick = () => {},
}): React.ReactElement => {
  const { t } = useTranslation()

  const voyageLabel = useMemo(() => {
    const parts: string[] = []
    const { from, to, start, end, eventsQuantity } = event

    if (from && to) {
      parts.push(
        `${t('common.from', 'from')} ${formatI18nDate(start ?? 0, {
          format: DateTime.DATE_FULL,
        })}`
      )
      parts.push(
        `${t('common.to', 'to')} ${formatI18nDate(end ?? 0, {
          format: DateTime.DATE_FULL,
        })}`
      )
      parts.push(`(${eventsQuantity} ${t('common.events', 'Events')})`)
    } else if (!event.to) {
      parts.push(t('event.currentVoyage' as any, 'Ongoing Voyage') as string)
      parts.push(
        `${t('common.from', 'from')} ${formatI18nDate(start ?? 0, {
          format: DateTime.DATE_FULL,
        })}`
      )
    } else {
      parts.push(
        `${t('common.to', 'to')} ${formatI18nDate(end ?? 0, {
          format: DateTime.DATE_FULL,
        })}`
      )
    }

    return parts.join(' ')
  }, [event.from, event.start, event.to, event.end, event.eventsQuantity, t])

  const hasEvents = useMemo(() => event.eventsQuantity > 0, [event.eventsQuantity])
  const onToggle = useCallback(
    () => (hasEvents ? onToggleClick(event) : {}),
    [hasEvents, onToggleClick, event]
  )
  const onMap = useCallback(
    () => (hasEvents ? onMapClick(event) : {}),
    [hasEvents, onMapClick, event]
  )
  return (
    <Fragment>
      <div
        className={cx(styles.event, styles.voyage, { [styles.open]: event.status === 'expanded' })}
      >
        <div className={styles.eventData} onClick={onToggle}>
          <div className={styles.description}>{voyageLabel}</div>
        </div>
        {hasEvents && (
          <div className={styles.actions}>
            <IconButton
              icon={event.status === 'expanded' ? 'arrow-top' : 'arrow-down'}
              size="small"
              onClick={onToggle}
            ></IconButton>
            <IconButton icon="view-on-map" size="small" onClick={onMap}></IconButton>
          </div>
        )}
      </div>
      <div className={styles.divider}></div>
    </Fragment>
  )
}

export default ActivityVoyage
