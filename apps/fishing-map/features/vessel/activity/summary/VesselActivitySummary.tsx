import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Icon, IconType, Tooltip } from '@globalfishingwatch/ui-components'
import I18nNumber, { formatI18nNumber } from 'features/i18n/i18nNumber'
import useActivityEventConnect from 'features/vessel/activity/event/event.hook'
import {
  selectActivityRegions,
  selectEventsGroupedByType,
} from 'features/vessel/activity/vessels-activity.selectors'
import { REGIONS_PRIORITY } from 'features/vessel/vessel.config'
import styles from './VesselActivitySummary.module.css'

export const VesselActivitySummary = () => {
  const { t } = useTranslation()
  const eventsByType = useSelector(selectEventsGroupedByType)
  const activityRegions = useSelector(selectActivityRegions)
  const activityRegionsLength = Object.keys(activityRegions).length
  const { getRegionNamesByType } = useActivityEventConnect()

  return (
    <div>
      <label>{t('common.summary', 'Summary')}</label>
      <ul className={styles.summary}>
        <li>
          {t('vessel.activeIn', 'Active in')}{' '}
          {REGIONS_PRIORITY.map((regionType, index) => {
            if (activityRegions[regionType] && activityRegions[regionType].length !== 0) {
              const tooltipContent = (
                <ul>
                  {activityRegions[regionType]
                    .sort((a, b) => b.count - a.count)
                    .map(({ id, count }) => {
                      return (
                        <li key={id}>
                          {getRegionNamesByType(regionType, [id])[0] || id} (
                          {<I18nNumber number={count} />}{' '}
                          {t('common.event', { defaultValue: 'events', count })})
                        </li>
                      )
                    })}
                </ul>
              )
              return (
                <Tooltip key={regionType} content={tooltipContent}>
                  <span className={styles.area}>
                    {activityRegions[regionType].length}{' '}
                    {t(`layer.areas.${regionType}`, {
                      defaultvalue: regionType,
                      count: activityRegions[regionType].length,
                    })}
                    {(regionType === 'fao' || regionType === 'rfmo') && (
                      <span>
                        {' '}
                        {t(`common.area`, {
                          defaultValue: 'areas',
                          count: activityRegions[regionType].length,
                        })}
                      </span>
                    )}
                    {index < activityRegionsLength - 1 && ', '}
                  </span>
                </Tooltip>
              )
            }

            return null
          })}
        </li>
        {Object.entries(eventsByType).map(([eventType, events]) => {
          return (
            <li key={eventType} className={styles.eventsCount}>
              <div className={styles.iconContainer}>
                <Icon icon={`event-legend-${eventType}` as IconType} type="original-colors" />
              </div>
              <strong>{formatI18nNumber(events.length)}</strong>
              {t(`event.${eventType}` as any, {
                defaultValue: eventType,
                count: events.length,
              })}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
