import { useTranslation } from 'react-i18next'
import { InsightErrorResponse, InsightIUUResponse } from '@globalfishingwatch/api-types'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import styles from './Insights.module.css'

const InsightIUU = ({
  insightData,
  isLoading,
  error,
}: {
  insightData: InsightIUUResponse
  isLoading: boolean
  error: InsightErrorResponse
}) => {
  const { t } = useTranslation()
  const { iuuVesselList } = insightData?.vesselIdentity || {}
  return (
    <div className={styles.insightContainer}>
      <label>{t('vessel.insights.IUU', 'RFMO IUU Vessel List')}</label>
      {isLoading ? (
        <div style={{ width: '50rem' }} className={styles.loadingPlaceholder} />
      ) : error ? (
        <InsightError error={error} />
      ) : (
        <div>
          <p>
            {iuuVesselList?.valuesInThePeriod.length !== 0 ? (
              <span>
                {t('vessel.insights.IUUBlackListsCount', {
                  // value: iuuBlacklist.valuesInThePeriod.join(', '),
                  // defaultValue: 'The vessel is present on an RFMO IUU blacklist ({{value}})',
                  defaultValue: 'The vessel is present on an RFMO IUU vessel list',
                })}
              </span>
            ) : (
              <span className={styles.secondary}>
                {t(
                  'vessel.insights.IUUBlackListsEmpty',
                  'The vessel is not present on an RFMO IUU vessel list'
                )}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

export default InsightIUU
