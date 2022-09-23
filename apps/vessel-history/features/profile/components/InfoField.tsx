import React, { useCallback, useMemo, useState } from 'react'
import cx from 'classnames'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import I18nDate from 'features/i18n/i18nDate'
import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { Iuu, ValueItem } from 'types'
import { VesselFieldLabel } from 'types/vessel'
import DataAndTerminology from 'features/data-and-terminology/DataAndTerminology'
import InfoFieldHistory from './InfoFieldHistory'
import styles from './Info.module.css'
import Faq from './Faq'

interface ListItemProps {
  label: VesselFieldLabel
  value?: string
  className?: string
  valuesHistory?: ValueItem[]
  vesselName: string
  hideTMTDate?: boolean
  includeFaq?: boolean
  helpText?: React.ReactNode
}

const InfoField: React.FC<ListItemProps> = ({
  value = DEFAULT_EMPTY_VALUE,
  label,
  className = '',
  valuesHistory = [],
  vesselName,
  hideTMTDate = false,
  includeFaq = false,
  helpText,
}): React.ReactElement => {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const openModal = useCallback(() => {
    if (valuesHistory.length > 0) {
      setModalOpen(true)
      uaEvent({
        category: 'Vessel Detail INFO Tab',
        action: 'Vessel detail INFO tab is open and user click in the history by each field',
        label: JSON.stringify({ [label]: valuesHistory.length }),
      })
    }
  }, [label, valuesHistory.length])
  const closeModal = useCallback(() => setModalOpen(false), [])

  const since = useMemo(() => valuesHistory.slice(0, 1)?.shift()?.firstSeen, [valuesHistory])
  return (
    <div className={cx(styles.identifierField, styles[className])}>
      <label className={styles.infoLabel} >
        {t(`vessel.${label}` as any, label)}
        {helpText && (
          <DataAndTerminology size="tiny" type="default" title={t(`vessel.${label}` as any, label)}>
            {helpText}
            {includeFaq && <Faq source={label} />}
          </DataAndTerminology>
        )}
      </label>
      <div>
        <div onClick={openModal}>{value}</div>
        {valuesHistory.length > 0 && (
          <button className={styles.moreValues} onClick={openModal}>
            {t('vessel.formatValues', '{{quantity}} values', {
              quantity: valuesHistory.length,
            })}
          </button>
        )}
        {valuesHistory.length === 1 && since && (
          <p className={styles.rangeLabel}>
            {t('common.since', 'Since')} <I18nDate date={since} />
          </p>
        )}
        <InfoFieldHistory
          label={label}
          history={valuesHistory}
          isOpen={modalOpen}
          hideTMTDate={hideTMTDate}
          onClose={closeModal}
          vesselName={vesselName}
        ></InfoFieldHistory>
      </div>
    </div>
  )
}

export default InfoField
