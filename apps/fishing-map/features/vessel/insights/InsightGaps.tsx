import { useTranslation } from 'react-i18next'
import { Fragment, useCallback, useState } from 'react'
import { InsightErrorResponse, InsightGapsResponse } from '@globalfishingwatch/api-types'
import InsightError from './InsightErrorMessage'
import styles from './Insights.module.css'
import InsightGapsDetails from './InsightGapsDetails'

const InsightGaps = ({
  insightData,
  isLoading,
  error,
}: {
  insightData: InsightGapsResponse
  isLoading: boolean
  error: InsightErrorResponse
}) => {
  const { t } = useTranslation()
  const { aisOff } = insightData?.gap || {}
  const [eventDetailsVisibility, setEventDetailsVisibility] = useState(false)

  const toggleEventDetailsVisibility = useCallback(() => {
    setEventDetailsVisibility(!eventDetailsVisibility)
  }, [eventDetailsVisibility])

  return (
    <div className={styles.insightContainer}>
      <label>{t('vessel.insights.gaps', 'AIS Off Events')}</label>
      {isLoading ? (
        <div style={{ width: '20rem' }} className={styles.loadingPlaceholder} />
      ) : error ? (
        <InsightError error={error} />
      ) : (
        <div>
          {aisOff?.length !== 0 ? (
            <Fragment>
              <span>
                {t('vessel.insights.gapsEvents', {
                  count: aisOff?.length,
                  defaultValue: '{{count}} AIS Off events detected',
                })}
              </span>
              <InsightGapsDetails
                insightData={insightData}
                visible={eventDetailsVisibility}
                toggleVisibility={toggleEventDetailsVisibility}
              />
            </Fragment>
          ) : (
            <p className={styles.secondary}>
              {t('vessel.insights.gapsEventsEmpty', 'No AIS Off events detected')}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default InsightGaps
