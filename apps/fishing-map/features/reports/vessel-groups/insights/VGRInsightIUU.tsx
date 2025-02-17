import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { useState } from 'react'
import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import { Collapsable } from '@globalfishingwatch/ui-components'
import { useGetVesselGroupInsightQuery } from 'queries/vessel-insight-api'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectVGRData } from '../vessel-group-report.slice'
import { selectFetchVesselGroupReportIUUParams } from '../vessel-group-report.selectors'
import styles from './VGRInsights.module.css'
import VesselGroupReportInsightPlaceholder from './VGRInsightsPlaceholders'
import { selectVGRIUUVessels } from './vessel-group-report-insights.selectors'
import VesselGroupReportInsightVesselTable from './VGRInsightVesselsTable'

const VesselGroupReportInsightIUU = ({ skip }: { skip?: boolean }) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const vesselGroup = useSelector(selectVGRData)
  const fetchVesselGroupParams = useSelector(selectFetchVesselGroupReportIUUParams)

  const { error, isLoading } = useGetVesselGroupInsightQuery(fetchVesselGroupParams, {
    skip: !vesselGroup || skip,
  })
  const vesselsWithIIU = useSelector(selectVGRIUUVessels)

  const onInsightToggle = (isOpen: boolean) => {
    if (isOpen !== isExpanded) {
      setIsExpanded(!isExpanded)
    }
    if (isOpen) {
      trackEvent({
        category: TrackCategory.VesselGroupReport,
        action: 'vessel_group_profile_insights_tab_expand_insights',
        label: 'IUU expanded',
      })
    }
  }

  return (
    <div id="vessel-group-iuu" className={styles.insightContainer}>
      <div className={styles.insightTitle}>
        <label>{t('vessel.insights.IUU', 'RFMO IUU Vessel List')}</label>
        <DataTerminology
          size="tiny"
          type="default"
          title={t('vessel.insights.IUU', 'RFMO IUU Vessel List')}
          terminologyKey="insightsIUU"
        />
      </div>
      {skip || isLoading || !vesselGroup ? (
        <VesselGroupReportInsightPlaceholder />
      ) : error ? (
        <InsightError error={error as ParsedAPIError} />
      ) : !vesselsWithIIU || vesselsWithIIU.length === 0 ? (
        <span className={cx(styles.secondary, styles.nested, styles.row)}>
          {t(
            'vesselGroupReport.insights.IUUBlackListsEmpty',
            'No vessels are present on a RFMO IUU vessel list'
          )}
        </span>
      ) : (
        <div className={styles.nested}>
          <Collapsable
            id="no-take-vessels"
            open={isExpanded}
            className={styles.collapsable}
            labelClassName={cx(styles.collapsableLabel, styles.row)}
            label={t('vesselGroupReport.insights.IUUBlackListsCount', {
              defaultValue: '{{vessels}} vessels are present on a RFMO IUU vessel list',
              vessels: vesselsWithIIU.length,
            })}
            onToggle={onInsightToggle}
          >
            <div className={styles.nested}>
              <VesselGroupReportInsightVesselTable vessels={vesselsWithIIU} />
            </div>
          </Collapsable>
        </div>
      )}
    </div>
  )
}

export default VesselGroupReportInsightIUU
