import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { selectReportCategory } from 'features/app/selectors/app.reports.selector'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { getCommonProperties } from 'features/reports/report-area/area-reports.utils'
import { PROPERTIES_EXCLUDED } from 'features/reports/report-area/summary/ReportSummary'
import { ReportCategory } from 'features/reports/reports.types'
import ReportVessels from 'features/reports/shared/vessels/ReportVessels'
import type { ReportActivityUnit } from 'features/reports/tabs/activity/reports-activity.types'

import styles from './ReportVessels.module.css'

type ReportVesselTableProps = {
  activityUnit: ReportActivityUnit
  reportName?: string
}

export default function ActivityReportVessels({
  activityUnit,
  reportName,
}: ReportVesselTableProps) {
  const { t } = useTranslation()
  const reportCategory = useSelector(selectReportCategory)
  const dataviews = useSelector(selectActiveReportDataviews)

  // const data = useSelector(selectReportVesselsGraphDataGrouped)!
  // const individualData = useSelector(selectReportVesselsGraphIndividualData)

  const commonProperties = useMemo(() => {
    return getCommonProperties(dataviews).filter(
      (property) =>
        !dataviews[0].config?.filters?.[property] || !PROPERTIES_EXCLUDED.includes(property)
    )
  }, [dataviews])

  const title =
    reportCategory === ReportCategory.Detections
      ? t('common.matchedVessels', 'Matched vessels')
      : t('common.vessel_other', 'Vessels')

  return (
    <div className={styles.graph} data-test="activity-report-vessels-graph">
      {/* TODO:CVP add activityUnit */}
      <ReportVessels title={title} loading={false} />
    </div>
  )
}
