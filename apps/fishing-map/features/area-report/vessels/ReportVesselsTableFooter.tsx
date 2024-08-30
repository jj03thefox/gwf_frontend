import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Fragment, useMemo } from 'react'
import { unparse as unparseCSV } from 'papaparse'
import { saveAs } from 'file-saver'
import { Button, IconButton } from '@globalfishingwatch/ui-components'
import I18nNumber from 'features/i18n/i18nNumber'
import { useLocationConnect } from 'routes/routes.hook'
import VesselGroupAddButton from 'features/vessel-groups/VesselGroupAddButton'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectReportVesselFilter } from 'features/app/selectors/app.reports.selector'
import { REPORT_SHOW_MORE_VESSELS_PER_PAGE, REPORT_VESSELS_PER_PAGE } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  setVesselGroupConfirmationMode,
  setVesselGroupCurrentDataviewIds,
} from 'features/vessel-groups/vessel-groups.slice'
import { selectActiveActivityAndDetectionsDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import {
  selectReportVesselsFiltered,
  selectReportVesselsList,
  selectReportVesselsListWithAllInfo,
  selectReportVesselsPagination,
  getVesselsFiltered,
  ReportVesselWithDatasets,
  selectReportAreaName,
} from '../reports.selectors'
import { parseReportVesselsToIdentity } from '../reports.utils'
import styles from './ReportVesselsTableFooter.module.css'

type ReportVesselsTableFooterProps = {
  reportName: string
}

export default function ReportVesselsTableFooter({ reportName }: ReportVesselsTableFooterProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchQueryParams } = useLocationConnect()
  const allVesselsWithAllInfo = useSelector(selectReportVesselsListWithAllInfo)
  const allVessels = useSelector(selectReportVesselsList)
  const allFilteredVessels = useSelector(selectReportVesselsFiltered)
  const reportVesselFilter = useSelector(selectReportVesselFilter)
  const reportAreaName = useSelector(selectReportAreaName)
  const pagination = useSelector(selectReportVesselsPagination)
  const heatmapDataviews = useSelector(selectActiveActivityAndDetectionsDataviews)
  const { start, end } = useSelector(selectTimeRange)

  const vesselGroupIdentityVessels = useMemo(() => {
    return parseReportVesselsToIdentity(reportVesselFilter ? allFilteredVessels : allVessels)
  }, [allFilteredVessels, allVessels, reportVesselFilter])

  const onDownloadVesselsClick = () => {
    if (allVesselsWithAllInfo?.length) {
      const vessels = getVesselsFiltered(allVesselsWithAllInfo, reportVesselFilter)?.map(
        (vessel) => {
          const { dataviewId, category, sourceColor, flagTranslatedClean, ...rest } = vessel
          return rest
        }
      ) as ReportVesselWithDatasets[]
      trackEvent({
        category: TrackCategory.Analysis,
        action: `Click 'Download CSV'`,
        label: `region name: ${reportAreaName} | timerange: ${start} - ${end} | filters: ${reportVesselFilter}`,
      })
      const csv = unparseCSV(vessels)
      const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, `${reportName}-${start}-${end}.csv`)
    }
  }

  const onPrevPageClick = () => {
    dispatchQueryParams({ reportVesselPage: pagination.page - 1 })
  }
  const onNextPageClick = () => {
    dispatchQueryParams({ reportVesselPage: pagination.page + 1 })
  }
  const onShowMoreClick = () => {
    dispatchQueryParams({
      reportResultsPerPage: REPORT_SHOW_MORE_VESSELS_PER_PAGE,
      reportVesselPage: 0,
    })
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Click on show more vessels`,
    })
  }
  const onShowLessClick = () => {
    dispatchQueryParams({ reportResultsPerPage: REPORT_VESSELS_PER_PAGE, reportVesselPage: 0 })
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Click on show less vessels`,
    })
  }
  const onAddToVesselGroup = () => {
    const dataviewIds = heatmapDataviews.map(({ id }) => id)
    dispatch(setVesselGroupConfirmationMode('saveAndSeeInWorkspace'))
    if (dataviewIds?.length) {
      dispatch(setVesselGroupCurrentDataviewIds(dataviewIds))
    }
    trackEvent({
      category: TrackCategory.VesselGroups,
      action: 'add_to_vessel_group',
      label: 'report',
    })
  }

  const isShowingMore = pagination.resultsPerPage === REPORT_SHOW_MORE_VESSELS_PER_PAGE
  const hasLessVesselsThanAPage =
    pagination.page === 0 && pagination?.resultsNumber < pagination?.resultsPerPage
  const isLastPaginationPage =
    pagination?.offset + pagination?.resultsPerPage >= (pagination?.totalFiltered as number)

  return (
    <div className={styles.footer}>
      <div className={cx(styles.flex, styles.expand)}>
        <Fragment>
          <div className={styles.flex}>
            <IconButton
              icon="arrow-left"
              disabled={pagination?.page === 0}
              className={cx({ [styles.disabled]: pagination?.page === 0 })}
              onClick={onPrevPageClick}
              size="medium"
            />
            <span className={styles.noWrap}>
              {`${pagination?.offset + 1} - ${
                isLastPaginationPage
                  ? pagination?.totalFiltered
                  : pagination?.offset + pagination?.resultsPerPage
              }`}{' '}
            </span>
            <IconButton
              icon="arrow-right"
              onClick={onNextPageClick}
              disabled={isLastPaginationPage || hasLessVesselsThanAPage}
              className={cx({
                [styles.disabled]: isLastPaginationPage || hasLessVesselsThanAPage,
              })}
              size="medium"
            />
          </div>
          <button onClick={isShowingMore ? onShowLessClick : onShowMoreClick}>
            <label className={styles.pointer}>
              {t('analysis.resultsPerPage', {
                results: isShowingMore
                  ? REPORT_VESSELS_PER_PAGE
                  : REPORT_SHOW_MORE_VESSELS_PER_PAGE,
                defaultValue: `Show ${
                  isShowingMore ? REPORT_VESSELS_PER_PAGE : REPORT_SHOW_MORE_VESSELS_PER_PAGE
                } per page`,
              })}
            </label>
          </button>
          <span className={cx(styles.noWrap, styles.right)}>
            {reportVesselFilter && (
              <Fragment>
                <I18nNumber number={allFilteredVessels!?.length} /> {t('common.of', 'of')}{' '}
              </Fragment>
            )}
            <I18nNumber number={pagination.total} />{' '}
            {t('common.vessel', { count: pagination?.total })}
          </span>
        </Fragment>
      </div>
      <div className={cx(styles.flex, styles.expand)}>
        <VesselGroupAddButton
          vessels={vesselGroupIdentityVessels}
          onAddToVesselGroup={onAddToVesselGroup}
        />
        <Button testId="download-vessel-table-report" onClick={onDownloadVesselsClick}>
          {t('analysis.downloadVesselsList', 'Download csv')}
        </Button>
      </div>
    </div>
  )
}
