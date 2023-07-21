import { useCallback, useMemo } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { useSelector } from 'react-redux'
import saveAs from 'file-saver'
import { IconButton } from '@globalfishingwatch/ui-components'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { RenderedVoyage } from 'features/vessel/activity/activity-by-voyage/activity-by-voyage.selectors'
import { selectVesselInfoDataId } from 'features/vessel/vessel.slice'
import { parseEventsToCSV } from 'features/vessel/vessel.utils'
import styles from '../ActivityGroup.module.css'

interface EventProps {
  voyage: RenderedVoyage
  expanded: boolean
  children: React.ReactNode
  onMapClick?: (event: RenderedVoyage) => void
  onMapHover?: (event?: RenderedVoyage) => void
  onToggleClick?: (event: RenderedVoyage) => void
}

const VoyageGroup: React.FC<EventProps> = ({
  voyage,
  children,
  expanded = false,
  onMapClick = () => {},
  onMapHover = () => {},
  onToggleClick = () => {},
}): React.ReactElement => {
  const { t } = useTranslation()
  const vesselId = useSelector(selectVesselInfoDataId)
  const voyageLabel = useMemo(() => {
    const parts: string[] = []
    if (voyage.from && voyage.to) {
      parts.push(
        `${t('common.from', 'from')} ${formatI18nDate(voyage.start ?? 0, {
          format: DateTime.DATE_FULL,
        })}`
      )
      parts.push(
        `${t('common.to', 'to')} ${formatI18nDate(voyage.end ?? 0, {
          format: DateTime.DATE_FULL,
        })}`
      )
    } else if (!voyage.to) {
      parts.push(t('event.currentVoyage' as any, 'Ongoing Voyage') as string)
      parts.push(
        `${t('common.from', 'from')} ${formatI18nDate(voyage.start ?? 0, {
          format: DateTime.DATE_FULL,
        })}`
      )
    } else {
      parts.push(
        `${t('common.to', 'to')} ${formatI18nDate(voyage.end ?? 0, {
          format: DateTime.DATE_FULL,
        })}`
      )
    }
    parts.push(`(${voyage.eventsQuantity} ${t('common.events', 'Events')})`)

    return parts.join(' ')
  }, [voyage, t])

  const hasEvents = voyage.eventsQuantity > 0

  const onDownloadClick = () => {
    if (voyage.events.length) {
      const data = parseEventsToCSV(voyage.events)
      const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, `${vesselId}-voyage-${voyage.start}-${voyage.end}-events.csv`)
    }
  }

  const onToggle = useCallback(
    () => (hasEvents ? onToggleClick(voyage) : {}),
    [hasEvents, onToggleClick, voyage]
  )

  const handleMapClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (hasEvents) {
        onMapClick(voyage)
      }
      if (!expanded) {
        onToggle()
      }
    },
    [hasEvents, expanded, onMapClick, voyage, onToggle]
  )

  return (
    <li className={cx(styles.eventGroup, { [styles.open]: expanded })}>
      <div
        className={styles.header}
        onClick={onToggle}
        onMouseEnter={() => onMapHover(voyage)}
        onMouseLeave={() => onMapHover(undefined)}
      >
        <p className={styles.title}>{voyageLabel}</p>
        {hasEvents && (
          <div className={styles.actions}>
            <IconButton size="small" icon={expanded ? 'arrow-top' : 'arrow-down'} />
            <IconButton
              icon="download"
              size="small"
              onClick={onDownloadClick}
              tooltip={t('download.dataDownload', 'Download Data')}
              tooltipPlacement="top"
            />
            <IconButton icon="target" size="small" onClick={handleMapClick} />
          </div>
        )}
      </div>
      {children && <ul className={styles.content}>{children}</ul>}
    </li>
  )
}

export default VoyageGroup
