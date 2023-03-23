import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { sum } from 'lodash'
import { useMemo } from 'react'
import { Locale } from '@globalfishingwatch/api-types'
import { formatI18nDate } from 'features/i18n/i18nDate'
import {
  selectActiveReportDataviews,
  selectReportCategory,
  selectTimeRange,
} from 'features/app/app.selectors'
import ReportSummaryTags from 'features/reports/summary/ReportSummaryTags'
import { FIELDS, getCommonProperties } from 'features/reports/reports.utils'
import { ReportActivityUnit } from 'features/reports/Report'
import { getDatasetTitleByDataview } from 'features/datasets/datasets.utils'
import { useFilteredTimeSeries } from 'features/reports/reports-timeseries.hooks'
import { formatEvolutionData } from 'features/reports/reports-timeseries.utils'
import { AsyncReducerStatus } from 'utils/async-slice'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import ReportSummaryPlaceholder from 'features/reports/placeholders/ReportSummaryPlaceholder'
import ReportSummaryTagsPlaceholder from 'features/reports/placeholders/ReportSummaryTagsPlaceholder'
import { getSourcesSelectedInDataview } from 'features/workspace/activity/activity.utils'
import { listAsSentence } from 'utils/shared'
import { ReportCategory } from 'types'
import { selectReportVesselsHours, selectReportVesselsNumber } from '../reports.selectors'
import styles from './ReportSummary.module.css'

type ReportSummaryProps = {
  activityUnit: ReportActivityUnit
  reportStatus: AsyncReducerStatus
}

const PROPERTIES_EXCLUDED = ['flag', 'geartype']

export default function ReportSummary({ activityUnit, reportStatus }: ReportSummaryProps) {
  const { t, i18n } = useTranslation()
  const timerange = useSelector(selectTimeRange)
  const category = useSelector(selectReportCategory)
  const reportVessels = useSelector(selectReportVesselsNumber)
  const { loading: timeseriesLoading, layersTimeseriesFiltered } = useFilteredTimeSeries()
  const reportHours = useSelector(selectReportVesselsHours)
  const dataviews = useSelector(selectActiveReportDataviews)
  const commonProperties = useMemo(() => {
    return getCommonProperties(dataviews).filter(
      (property) =>
        !dataviews[0].config.filters?.[property] || !PROPERTIES_EXCLUDED.includes(property)
    )
  }, [dataviews])

  const summary = useMemo(() => {
    if (!dataviews.length) return
    const datasetTitles = dataviews?.map((dataview) =>
      getDatasetTitleByDataview(dataview, { showPrivateIcon: false })
    )
    const sameTitleDataviews = datasetTitles.every((d) => d === datasetTitles?.[0])
    const datasetTitle = sameTitleDataviews
      ? datasetTitles?.[0]
      : category === ReportCategory.Fishing || category === ReportCategory.Presence
      ? `${t('common.of', 'of')} <strong>${t(`common.activity`, 'Activity').toLowerCase()}</strong>`
      : undefined

    if (
      reportHours &&
      reportStatus === AsyncReducerStatus.Finished &&
      category !== ReportCategory.Detections
    ) {
      return t('analysis.summary', {
        defaultValue:
          '<strong>{{vessels}} $t(common.vessel_other){{sources}}</strong> had <strong>{{activityQuantity}} {{activityUnit}}</strong> of <strong>{{activityType}}</strong> in the area between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
        vessels: formatI18nNumber(reportVessels || 0, {
          locale: i18n.language as Locale,
        }),
        activityQuantity: formatI18nNumber(Math.floor(reportHours), {
          locale: i18n.language as Locale,
        }),
        activityUnit: t(`common.${activityUnit}`, {
          defaultValue: 'hours',
          count: Math.floor(reportHours),
        }),
        activityType: datasetTitle,
        start: formatI18nDate(timerange?.start),
        end: formatI18nDate(timerange?.end),
        sources: commonProperties.includes('source')
          ? ` (${listAsSentence(
              getSourcesSelectedInDataview(dataviews[0]).map((source) => source.label)
            )})`
          : '',
      })
    }
    if (
      (!timeseriesLoading && layersTimeseriesFiltered?.[0]) ||
      (category === ReportCategory.Detections &&
        reportStatus === AsyncReducerStatus.Finished &&
        reportHours)
    ) {
      const formattedTimeseries = formatEvolutionData(layersTimeseriesFiltered?.[0])
      const timeseriesHours = sum(formattedTimeseries?.map((t) => sum(t.avg)))
      const timeseriesMaxHours = sum(formattedTimeseries?.map((t) => sum(t.range.map((r) => r[1]))))
      const timeseriesImprecision = ((timeseriesMaxHours - timeseriesHours) / timeseriesHours) * 100
      let activityQuantity =
        !timeseriesLoading && layersTimeseriesFiltered?.[0]
          ? `<span title="± ${timeseriesImprecision.toFixed(2)}%">~${formatI18nNumber(
              timeseriesHours.toFixed(),
              {
                locale: i18n.language as Locale,
              }
            )}</span>`
          : ''
      if (
        category === ReportCategory.Detections &&
        reportStatus === AsyncReducerStatus.Finished &&
        reportHours
      ) {
        activityQuantity = formatI18nNumber(Math.floor(reportHours), {
          locale: i18n.language as Locale,
        }) as string
      }
      const activityUnitLabel =
        category === ReportCategory.Detections
          ? ''
          : `<strong>${t(`common.${activityUnit}`, {
              defaultValue: 'hours',
              count: Math.floor(reportHours),
            })}</strong> ${t('common.of', 'of')}`

      return t('analysis.summaryNoVessels', {
        defaultValue:
          '<strong>{{sources}} {{activityQuantity}}</strong> {{activityUnit}} <strong>{{activityType}}</strong> in the area between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
        activityQuantity,
        activityUnit: activityUnitLabel,
        activityType: datasetTitle,
        start: formatI18nDate(timerange?.start),
        end: formatI18nDate(timerange?.end),
        sources: commonProperties.includes('source')
          ? `(${listAsSentence(
              getSourcesSelectedInDataview(dataviews[0]).map((source) => source.label)
            )}) `
          : '',
      })
    }
  }, [
    t,
    activityUnit,
    category,
    commonProperties,
    dataviews,
    i18n.language,
    layersTimeseriesFiltered,
    reportHours,
    reportStatus,
    reportVessels,
    timerange?.end,
    timerange?.start,
    timeseriesLoading,
  ])

  return (
    <div className={styles.container}>
      {summary ? (
        <p className={styles.summary} dangerouslySetInnerHTML={{ __html: summary }}></p>
      ) : (
        <ReportSummaryPlaceholder />
      )}
      <div className={styles.tagsContainer}>
        {dataviews.length > 0 ? (
          dataviews?.map((dataview, index) => (
            <ReportSummaryTags
              key={dataview.id}
              dataview={dataview}
              index={index}
              hiddenProperties={commonProperties}
              availableFields={FIELDS}
            />
          ))
        ) : (
          <ReportSummaryTagsPlaceholder />
        )}
      </div>
    </div>
  )
}
