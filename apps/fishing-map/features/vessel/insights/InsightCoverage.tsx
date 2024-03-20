import { useTranslation } from 'react-i18next'
import { InsightCoverageResponse } from '@globalfishingwatch/api-types'
import styles from './Insights.module.css'

const InsightCoverage = ({
  insightData,
  isLoading,
}: {
  insightData: InsightCoverageResponse
  isLoading: boolean
}) => {
  const { t } = useTranslation()
  return (
    <div className={styles.insightContainer}>
      <label>{t('vessel.insights.coverage', 'AIS Coverage')}</label>
      {isLoading || !insightData ? (
        <div style={{ width: '20rem' }} className={styles.loadingPlaceholder} />
      ) : (
        <div className={styles.coverageBar}>
          <div
            className={styles.coverageIndicator}
            style={{ left: `${Math.round(insightData.coverage.percentage)}%` }}
          >
            <span className={styles.coverageLabel}>
              {Math.round(insightData.coverage.percentage)}%
            </span>
            <span className={styles.coverageDot} />
          </div>
        </div>
      )}
    </div>
  )
}

export default InsightCoverage
