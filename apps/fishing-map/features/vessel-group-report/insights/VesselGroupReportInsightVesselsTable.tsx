import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Fragment } from 'react'
import VesselLink from 'features/vessel/VesselLink'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField, getVesselGearTypeLabel } from 'utils/info'
import styles from './VesselGroupReportInsightVesselsTable.module.css'
import { VesselGroupReportInsightVessel } from './vessel-group-report-insights.selectors'

const VesselGroupReportInsightVesselTable = ({
  vessels,
}: {
  vessels: VesselGroupReportInsightVessel[]
}) => {
  const { t } = useTranslation()
  return (
    <div className={styles.vesselsTable}>
      <div className={styles.header}>{t('common.name', 'Name')}</div>
      <div className={styles.header}>{t('vessel.mmsi', 'mmsi')}</div>
      <div className={styles.header}>{t('layer.flagState_one', 'Flag state')}</div>
      <div className={styles.header}>{t('vessel.geartype', 'Gear Type')}</div>

      {vessels.map((vessel, i) => {
        const vesselId = vessel.identity.id
        const isLastRow = i === vessels.length - 1
        return (
          <Fragment key={vessel.vesselId}>
            <div className={cx({ [styles.border]: !isLastRow })}>
              <VesselLink
                className={styles.link}
                vesselId={vesselId}
                datasetId={
                  typeof vessel.identity.dataset === 'string'
                    ? vessel.identity.dataset
                    : vessel.identity.dataset?.id
                }
              >
                {formatInfoField(vessel.identity.shipname, 'name')}
              </VesselLink>
            </div>
            <div className={cx({ [styles.border]: !isLastRow })}>
              <span>{vessel.identity.ssvid || EMPTY_FIELD_PLACEHOLDER}</span>
            </div>
            <div className={cx({ [styles.border]: !isLastRow })}>
              <span>
                {formatInfoField(vessel.identity.flag, 'flag') || EMPTY_FIELD_PLACEHOLDER}
              </span>
            </div>
            <div className={cx({ [styles.border]: !isLastRow })}>
              <span>{getVesselGearTypeLabel(vessel.identity) || EMPTY_FIELD_PLACEHOLDER}</span>
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}

export default VesselGroupReportInsightVesselTable
