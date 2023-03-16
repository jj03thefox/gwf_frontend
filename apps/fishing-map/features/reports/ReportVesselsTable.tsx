import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { CSVLink } from 'react-csv'
import { Fragment, useState } from 'react'
import { Button, IconButton } from '@globalfishingwatch/ui-components'
import { DatasetTypes, DataviewInstance } from '@globalfishingwatch/api-types'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { getVesselDataviewInstance, getVesselInWorkspace } from 'features/dataviews/dataviews.utils'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import I18nNumber from 'features/i18n/i18nNumber'
import { useLocationConnect } from 'routes/routes.hook'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import VesselGroupAddButton from 'features/vessel-groups/VesselGroupAddButton'
import { selectReportVesselFilter, selectTimeRange } from 'features/app/app.selectors'
import { REPORT_SHOW_MORE_VESSELS_PER_PAGE, REPORT_VESSELS_PER_PAGE } from 'data/config'
import {
  EMPTY_API_VALUES,
  ReportVesselWithDatasets,
  selectReportVesselsFiltered,
  selectReportVesselsList,
  selectReportVesselsListWithAllInfo,
  selectReportVesselsPaginated,
  selectReportVesselsPagination,
  getVesselsFiltered,
} from './reports.selectors'
import { ReportActivityUnit } from './Report'
import styles from './ReportVesselsTable.module.css'

type ReportVesselTableProps = {
  activityUnit: ReportActivityUnit
  reportName: string
}

export default function ReportVesselsTable({ activityUnit, reportName }: ReportVesselTableProps) {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const [allVesselsWithAllInfoFiltered, setAllVesselsWithAllInfoFiltered] = useState([])
  const allVesselsWithAllInfo = useSelector(selectReportVesselsListWithAllInfo)
  const allVessels = useSelector(selectReportVesselsList)
  const allFilteredVessels = useSelector(selectReportVesselsFiltered)
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const vessels = useSelector(selectReportVesselsPaginated)
  const reportVesselFilter = useSelector(selectReportVesselFilter)
  const pagination = useSelector(selectReportVesselsPagination)
  const vesselsInWorkspace = useSelector(selectActiveTrackDataviews)
  const { start, end } = useSelector(selectTimeRange)

  const getDownloadVessels = () => {
    setAllVesselsWithAllInfoFiltered(getVesselsFiltered(allVesselsWithAllInfo, reportVesselFilter))
  }

  const onVesselClick = async (
    ev: React.MouseEvent<Element, MouseEvent>,
    vessel: ReportVesselWithDatasets
  ) => {
    const vesselInWorkspace = getVesselInWorkspace(vesselsInWorkspace, vessel.vesselId)
    if (vesselInWorkspace) {
      deleteDataviewInstance(vesselInWorkspace.id)
      return
    }
    const vesselEventsDatasets = getRelatedDatasetsByType(vessel.infoDataset, DatasetTypes.Events)
    const eventsDatasetsId =
      vesselEventsDatasets && vesselEventsDatasets?.length
        ? vesselEventsDatasets.map((d) => d.id)
        : []
    const vesselDataviewInstance: DataviewInstance = getVesselDataviewInstance(
      { id: vessel.vesselId },
      {
        trackDatasetId: vessel.trackDataset?.id,
        infoDatasetId: vessel.infoDataset?.id,
        ...(eventsDatasetsId.length > 0 && { eventsDatasetsId }),
      }
    )
    upsertDataviewInstance(vesselDataviewInstance)
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
  }
  const onShowLessClick = () => {
    dispatchQueryParams({ reportResultsPerPage: REPORT_VESSELS_PER_PAGE, reportVesselPage: 0 })
  }
  const onFilterClick = (reportVesselFilter) => {
    dispatchQueryParams({ reportVesselFilter, reportVesselPage: 0 })
  }

  const isShowingMore = pagination.resultsPerPage === REPORT_SHOW_MORE_VESSELS_PER_PAGE
  const hasLessVesselsThanAPage =
    pagination.page === 0 && pagination?.resultsNumber < pagination?.resultsPerPage
  const isLastPaginationPage =
    pagination?.offset + pagination?.resultsPerPage >= pagination?.totalFiltered

  return (
    <Fragment>
      <div className={styles.tableContainer}>
        <div className={styles.vesselsTable}>
          <div className={cx(styles.header, styles.spansFirstTwoColumns)}>
            {t('common.name', 'Name')}
          </div>
          <div className={styles.header}>{t('vessel.mmsi', 'mmsi')}</div>
          <div className={styles.header}>{t('layer.flagState_one', 'Flag state')}</div>
          <div className={styles.header}>{t('vessel.vessel_type', 'Vessel Type')}</div>
          <div className={cx(styles.header, styles.right)}>
            {activityUnit === 'hour'
              ? t('common.hour_other', 'hours')
              : t('common.detection_other', 'detections')}
          </div>
          {vessels?.map((vessel, i) => {
            const hasDatasets = true
            // TODO get datasets from the vessel
            // const hasDatasets = vessel.infoDataset !== undefined || vessel.trackDataset !== undefined
            const vesselInWorkspace = getVesselInWorkspace(vesselsInWorkspace, vessel.vesselId)
            const pinTrackDisabled = !hasDatasets
            const isLastRow = i === vessels.length - 1
            const flag = t(`flags:${vessel.flag as string}` as any, EMPTY_FIELD_PLACEHOLDER)
            const flagInteractionEnabled = !EMPTY_API_VALUES.includes(vessel.flag)
            const gearType = vessel.geartype
              ? t(`vessel.gearTypes.${vessel.geartype}` as any, vessel.geartype)
              : t(`vessel.vesselTypes.${vessel.vesselType}` as any, vessel.vesselType)
            const gearTypeInteractionEnabled = !EMPTY_API_VALUES.includes(vessel.geartype)
            return (
              <Fragment key={vessel.vesselId}>
                {!pinTrackDisabled && (
                  <div className={cx({ [styles.border]: !isLastRow }, styles.icon)}>
                    <IconButton
                      icon={vesselInWorkspace ? 'pin-filled' : 'pin'}
                      style={{
                        color: vesselInWorkspace ? vesselInWorkspace.config.color : '',
                      }}
                      tooltip={
                        vesselInWorkspace
                          ? t(
                              'search.vesselAlreadyInWorkspace',
                              'This vessel is already in your workspace'
                            )
                          : t('search.seeVessel', 'See vessel')
                      }
                      onClick={(e) => onVesselClick(e, vessel)}
                      size="small"
                    />
                  </div>
                )}
                <div className={cx({ [styles.border]: !isLastRow })}>
                  {vessel.sourceColor && (
                    <span
                      className={styles.dot}
                      style={{ backgroundColor: vessel.sourceColor }}
                    ></span>
                  )}
                  {formatInfoField(vessel.shipName, 'name')}
                </div>
                <div className={cx({ [styles.border]: !isLastRow })}>
                  <span>{vessel.mmsi || EMPTY_FIELD_PLACEHOLDER}</span>
                </div>
                <div
                  className={cx({
                    [styles.border]: !isLastRow,
                    [styles.pointer]: flagInteractionEnabled,
                  })}
                  title={
                    flagInteractionEnabled
                      ? `${t('analysis.clickToFilterBy', `Click to filter by:`)} ${flag}`
                      : flag
                  }
                  onClick={flagInteractionEnabled ? () => onFilterClick(flag) : undefined}
                >
                  <span>{flag}</span>
                </div>
                <div
                  className={cx({
                    [styles.border]: !isLastRow,
                    [styles.pointer]: gearTypeInteractionEnabled,
                  })}
                  title={
                    gearTypeInteractionEnabled
                      ? `${t('analysis.clickToFilterBy', `Click to filter by:`)} ${gearType}`
                      : gearType
                  }
                  onClick={gearTypeInteractionEnabled ? () => onFilterClick(gearType) : undefined}
                >
                  {gearType}
                </div>
                <div className={cx({ [styles.border]: !isLastRow }, styles.right)}>
                  <I18nNumber number={vessel.hours} />
                </div>
              </Fragment>
            )
          })}
        </div>
      </div>
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
            <label
              className={styles.pointer}
              onClick={isShowingMore ? onShowLessClick : onShowMoreClick}
            >
              {t('analysis.resultsPerPage', {
                results: isShowingMore
                  ? REPORT_VESSELS_PER_PAGE
                  : REPORT_SHOW_MORE_VESSELS_PER_PAGE,
                defaultValue: `Show ${
                  isShowingMore ? REPORT_VESSELS_PER_PAGE : REPORT_SHOW_MORE_VESSELS_PER_PAGE
                } per page`,
              })}
            </label>
            <span className={cx(styles.noWrap, styles.right)}>
              {reportVesselFilter && (
                <Fragment>
                  <I18nNumber number={allFilteredVessels?.length} /> {t('common.of', 'of')}{' '}
                </Fragment>
              )}
              <I18nNumber number={pagination?.total} />{' '}
              {t('common.vessel', { count: pagination?.total })}
            </span>
          </Fragment>
        </div>
        <div className={cx(styles.flex, styles.expand)}>
          <VesselGroupAddButton
            vessels={reportVesselFilter ? allFilteredVessels : allVessels}
            showCount={false}
          />
          <Button className={styles.expand} disabled={!allVesselsWithAllInfo?.length}>
            {allVesselsWithAllInfo?.length ? (
              <CSVLink
                filename={`${reportName}-${start}-${end}.csv`}
                onClick={getDownloadVessels}
                data={allVesselsWithAllInfoFiltered}
              >
                {t('analysis.downloadVesselsList', 'Download csv')}
              </CSVLink>
            ) : (
              t('analysis.downloadVesselsList', 'Download csv')
            )}
          </Button>
        </div>
      </div>
    </Fragment>
  )
}
