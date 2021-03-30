import React, { Fragment, useCallback, useMemo } from 'react'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import { Modal } from '@globalfishingwatch/ui-components'
import { ValueItem } from 'types'
import { VesselFieldLabel } from './InfoField'
import styles from './Info.module.css'

interface ListItemProps {
  current: ValueItem
  history: ValueItem[]
  isOpen: boolean
  label: VesselFieldLabel
  vesselName: string
  onClose?: () => void
}

const InfoFieldHistory: React.FC<ListItemProps> = ({
  current,
  history,
  isOpen,
  label,
  vesselName,
  onClose = () => void 0,
}): React.ReactElement => {
  const { t } = useTranslation()

  const formatedDate = useCallback((date: string | null = null) => {
    return date
      ? [DateTime.fromISO(date, { zone: 'UTC' }).toLocaleString(DateTime.DATETIME_MED), 'UTC'].join(
          ' '
        )
      : ''
  }, [])

  const defaultTitle = useMemo(() => {
    return `${label} History for ${vesselName}`
  }, [label, vesselName])

  if (history.length < 1) {
    return <div></div>
  }

  return (
    <Fragment>
      {history.length && (
        <Modal
          title={`${t('vessel.historyLabelByField', defaultTitle, {
            label: t(`vessel.${label}` as any, label),
            vesselName,
          })}`}
          isOpen={isOpen}
          onClose={onClose}
        >
          <div>
            <div className={styles.historyItem}>
              <div className={styles.identifierField}>
                <label>{t(`vessel.${label}` as any, label)}</label>
                <div>{current.value}</div>
              </div>
              <div className={styles.identifierField}>
                <label>{t('common.currentTimeRange', 'CURRENT TIME RANGE')}</label>
                <div>
                  {t('common.since', 'Since')}{' '}
                  {formatedDate(current.firstSeen ?? history.slice(0, 1)?.shift()?.endDate)}
                </div>
              </div>
            </div>
            {history.map((historyValue: ValueItem, index) => (
              <div className={styles.historyItem} key={index}>
                <div className={styles.identifierField}>
                  <label>{t(`vessel.${label}` as any, label)}</label>
                  <div>{historyValue.value}</div>
                </div>
                <div className={styles.identifierField}>
                  <label>{t('common.timeRange', 'Time Range')}</label>
                  <div>
                    {historyValue.firstSeen && (
                      <div>
                        {t('common.from', 'From')} {formatedDate(historyValue.firstSeen)}
                      </div>
                    )}
                    {historyValue.endDate && (
                      <div>
                        {t('common.to', 'To')} {formatedDate(historyValue.endDate)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </Fragment>
  )
}

export default InfoFieldHistory
