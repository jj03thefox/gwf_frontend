import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { CSVLink } from 'react-csv'
import { Fragment } from 'react'
import { Button, IconButton } from '@globalfishingwatch/ui-components'
import { DatasetTypes, DataviewCategory, DataviewInstance } from '@globalfishingwatch/api-types'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { getVesselDataviewInstance, getVesselInWorkspace } from 'features/dataviews/dataviews.utils'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import I18nNumber from 'features/i18n/i18nNumber'
import { useLocationConnect } from 'routes/routes.hook'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import VesselGroupAddButton from 'features/vessel-groups/VesselGroupAddButton'
import {
  selectReportCategory,
  selectReportVesselFilter,
  selectTimeRange,
} from 'features/app/app.selectors'
import {
  ReportVesselWithDatasets,
  selectReportDownloadVessels,
  selectReportVesselsFiltered,
  selectReportVesselsList,
  selectReportVesselsPaginated,
  selectReportVesselsPagination,
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
  const allVessels = useSelector(selectReportVesselsList)
  const allFilteredVessels = useSelector(selectReportVesselsFiltered)
  const downloadVessels = useSelector(selectReportDownloadVessels)
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const vessels = useSelector(selectReportVesselsPaginated)
  const reportVesselFilter = useSelector(selectReportVesselFilter)
  const pagination = useSelector(selectReportVesselsPagination)
  const vesselsInWorkspace = useSelector(selectActiveTrackDataviews)
  const reportCategory = useSelector(selectReportCategory)
  const isDetections = reportCategory === DataviewCategory.Detections
  const { start, end } = useSelector(selectTimeRange)

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

  const hasLessVesselsThanAPage =
    pagination.page === 0 && pagination?.resultsNumber < pagination?.resultsPerPage
  const isLastPaginationPage = pagination?.offset + pagination?.resultsPerPage >= pagination?.total

  return (
    <Fragment>
      <div className={styles.tableContainer}>
        <div className={cx(styles.vesselsTable, { [styles.detections]: isDetections })}>
          <div className={cx(styles.header, styles.spansFirstTwoColumns)}>
            {t('common.name', 'Name')}
          </div>
          {!isDetections && <div className={styles.header}>{t('vessel.mmsi', 'mmsi')}</div>}
          <div className={styles.header}>{t('layer.flagState_one', 'Flag state')}</div>
          {!isDetections && (
            <div className={styles.header}>{t('vessel.gearType_short', 'gear')}</div>
          )}
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
                  {formatInfoField(vessel.shipName, 'name')}
                </div>
                {!isDetections && (
                  <div className={cx({ [styles.border]: !isLastRow })}>
                    <span>{vessel.mmsi || EMPTY_FIELD_PLACEHOLDER}</span>
                  </div>
                )}
                <div className={cx({ [styles.border]: !isLastRow })}>
                  <span>{t(`flags:${vessel.flag as string}` as any, EMPTY_FIELD_PLACEHOLDER)}</span>
                </div>
                {!isDetections && (
                  <div className={cx({ [styles.border]: !isLastRow })}>
                    {t(`vessel.gearTypes.${vessel.geartype}` as any, EMPTY_FIELD_PLACEHOLDER)}
                  </div>
                )}
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
          {!hasLessVesselsThanAPage && (
            <Fragment>
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
                    ? pagination?.total
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
              <span className={cx(styles.noWrap, styles.expand, styles.right)}>
                {reportVesselFilter && (
                  <Fragment>
                    <I18nNumber number={allFilteredVessels?.length} /> {t('common.of', 'of')}{' '}
                  </Fragment>
                )}
                <I18nNumber number={pagination?.total} />{' '}
                {t('common.vessel', { count: pagination?.total })}
              </span>
            </Fragment>
          )}
        </div>
        <div className={cx(styles.flex, styles.expand)}>
          <VesselGroupAddButton
            vessels={reportVesselFilter ? allFilteredVessels : allVessels}
            showCount={false}
          />
          <Button className={styles.expand} disabled={!downloadVessels?.length}>
            {downloadVessels?.length ? (
              <CSVLink filename={`${reportName}-${start}-${end}.csv`} data={downloadVessels}>
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
