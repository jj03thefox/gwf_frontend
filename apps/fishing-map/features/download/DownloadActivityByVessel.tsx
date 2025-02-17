import { useMemo, useState, Fragment } from 'react'
import parse from 'html-react-parser'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Icon, Button, Choice, Tag } from '@globalfishingwatch/ui-components'
import { DRAW_DATASET_SOURCE } from '@globalfishingwatch/api-types'
import {
  selectUrlBufferOperationQuery,
  selectUrlBufferUnitQuery,
  selectUrlBufferValueQuery,
} from 'routes/routes.selectors'
import type { DownloadActivityParams, DateRange } from 'features/download/downloadActivity.slice'
import {
  downloadActivityThunk,
  selectIsDownloadActivityLoading,
  selectIsDownloadActivityFinished,
  selectDownloadActivityAreaKey,
  selectHadDownloadActivityTimeoutError,
} from 'features/download/downloadActivity.slice'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import { TimelineDatesRange } from 'features/map/controls/MapInfo'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import {
  selectActiveHeatmapDowloadDataviewsByTab,
  selectActiveHeatmapVesselDatasets,
} from 'features/dataviews/selectors/dataviews.selectors'
import { getActivityFilters, getEventLabel } from 'utils/analytics'
import { selectUserData } from 'features/user/selectors/user.selectors'
import {
  checkDatasetReportPermission,
  getActiveDatasetsInDataview,
  getDatasetsReportNotSupported,
} from 'features/datasets/datasets.utils'
import { getSourcesSelectedInDataview } from 'features/workspace/activity/activity.utils'
import { useAppDispatch } from 'features/app/app.hooks'
import DownloadActivityProductsBanner from 'features/download/DownloadActivityProductsBanner'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import UserGuideLink from 'features/help/UserGuideLink'
import type { AreaKeyId } from 'features/areas/areas.slice'
import { selectIsDownloadActivityAreaLoading } from 'features/download/download.selectors'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import styles from './DownloadModal.module.css'
import type { HeatmapDownloadFormat, GroupBy, TemporalResolution } from './downloadActivity.config'
import { VESSEL_FORMAT_OPTIONS, getVesselGroupOptions } from './downloadActivity.config'
import {
  getDownloadReportSupported,
  getSupportedGroupByOptions,
  getSupportedTemporalResolutions,
} from './download.utils'
import ActivityDownloadError, { useActivityDownloadTimeoutRefresh } from './DownloadActivityError'

function DownloadActivityByVessel() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const userData = useSelector(selectUserData)
  const dataviews = useSelector(selectActiveHeatmapDowloadDataviewsByTab)
  const vesselDatasets = useSelector(selectActiveHeatmapVesselDatasets)
  const { start, end, timerange } = useTimerangeConnect()
  const datasetsDownloadNotSupported = getDatasetsReportNotSupported(
    dataviews,
    userData?.permissions || []
  )
  const isDownloadLoading = useSelector(selectIsDownloadActivityLoading)
  const isDownloadFinished = useSelector(selectIsDownloadActivityFinished)
  const hadDownloadTimeoutError = useSelector(selectHadDownloadActivityTimeoutError)
  const [format, setFormat] = useState(VESSEL_FORMAT_OPTIONS[0].id)
  const isDownloadReportSupported = getDownloadReportSupported(start, end)
  const downloadAreaKey = useSelector(selectDownloadActivityAreaKey)
  const downloadAreaDataset = useSelector(selectDatasetById(downloadAreaKey?.datasetId as string))
  const isDownloadAreaLoading = useSelector(selectIsDownloadActivityAreaLoading)

  const bufferUnit = useSelector(selectUrlBufferUnitQuery)
  const bufferValue = useSelector(selectUrlBufferValueQuery)
  const bufferOperation = useSelector(selectUrlBufferOperationQuery)

  const filteredGroupByOptions = useMemo(
    () => getSupportedGroupByOptions(getVesselGroupOptions(), vesselDatasets),
    [vesselDatasets]
  )
  const [groupBy, setGroupBy] = useState(filteredGroupByOptions[0]?.id)

  const filteredTemporalResolutionOptions = useMemo(
    () => getSupportedTemporalResolutions(dataviews, { start, end }),
    [dataviews, start, end]
  )
  const [temporalResolution, setTemporalResolution] = useState(
    filteredTemporalResolutionOptions[0].id
  )
  const downloadAreaName =
    downloadAreaDataset?.source === DRAW_DATASET_SOURCE
      ? downloadAreaDataset.name
      : downloadAreaKey?.areaName

  const onDownloadClick = async () => {
    const downloadDataviews = dataviews
      .map((dataview) => {
        const datasets = getActiveDatasetsInDataview(dataview)?.flatMap((d) => d.id || []) || []
        const activityDatasets = datasets.filter((id: string) => {
          return id ? checkDatasetReportPermission(id, userData!.permissions) : false
        })
        return {
          filter: dataview.config?.filter || '',
          filters: dataview.config?.filters || {},
          ...(dataview.config?.['vessel-groups']?.length && {
            'vessel-groups': dataview.config?.['vessel-groups'] as string[],
          }),
          datasets: activityDatasets,
        }
      })
      .filter((dataview) => dataview.datasets.length > 0)

    trackEvent({
      category: TrackCategory.DataDownloads,
      action: `Download ${format.toUpperCase()} file`,
      label: JSON.stringify({
        regionName: downloadAreaName || EMPTY_FIELD_PLACEHOLDER,
        downloadType: 'active vessels',
        temporalResolution,
        groupBy,
        sourceNames: dataviews.flatMap((dataview) =>
          getSourcesSelectedInDataview(dataview).map((source) => source.label)
        ),
      }),
    })

    const downloadParams: DownloadActivityParams = {
      areaId: downloadAreaKey?.areaId as AreaKeyId,
      datasetId: downloadAreaKey?.datasetId as string,
      dateRange: timerange as DateRange,
      areaName: downloadAreaName as string,
      dataviews: downloadDataviews,
      format,
      temporalResolution,
      spatialAggregation: true,
      groupBy,
      bufferUnit,
      bufferValue,
      bufferOperation,
    }
    const action = await dispatch(downloadActivityThunk(downloadParams))

    trackEvent({
      category: TrackCategory.DataDownloads,
      action: `Activity download`,
      label: getEventLabel([
        downloadAreaName || EMPTY_FIELD_PLACEHOLDER,
        ...downloadDataviews
          .map(({ datasets, filters }) => [datasets.join(','), ...getActivityFilters(filters)])
          .flat(),
      ]),
    })
    return action
  }

  useActivityDownloadTimeoutRefresh()

  const parsedLabel =
    typeof downloadAreaName === 'string' ? parse(downloadAreaName) : downloadAreaName

  return (
    <Fragment>
      <div className={styles.container} data-test="download-activity-byvessel">
        <div className={styles.info}>
          <div>
            <label>{t('download.area', 'Area')}</label>
            <Tag testId="area-name">{parsedLabel || EMPTY_FIELD_PLACEHOLDER}</Tag>
          </div>
          <div>
            <label>{t('download.timeRange', 'Time Range')}</label>
            <Tag>
              <TimelineDatesRange />
            </Tag>
          </div>
        </div>
        <div>
          <label>{t('download.format', 'Format')}</label>
          <Choice
            options={VESSEL_FORMAT_OPTIONS}
            size="small"
            testId="report-format"
            activeOption={format}
            onSelect={(option) => setFormat(option.id as HeatmapDownloadFormat)}
          />
        </div>
        <div>
          <label>{t('download.groupVesselsBy', 'Group vessels by')}</label>
          <Choice
            options={filteredGroupByOptions}
            size="small"
            testId="group-vessels-by"
            activeOption={groupBy}
            onSelect={(option) => setGroupBy(option.id as GroupBy)}
          />
        </div>
        <div>
          <label>{t('download.temporalResolution', 'Group time by')}</label>
          <Choice
            options={filteredTemporalResolutionOptions}
            size="small"
            testId="group-time-by"
            activeOption={temporalResolution}
            onSelect={(option) => setTemporalResolution(option.id as TemporalResolution)}
          />
        </div>
        <UserGuideLink section="downloadActivity" />
        <div className={styles.footer}>
          {!isDownloadReportSupported ? (
            <p className={cx(styles.footerLabel, styles.error)}>
              {t('download.timerangeTooLong', 'The maximum time range is 1 year')}
            </p>
          ) : datasetsDownloadNotSupported.length > 0 ? (
            <p className={styles.footerLabel}>
              {t(
                'download.datasetsNotAllowed',
                "You don't have permissions to download the following datasets:"
              )}{' '}
              {datasetsDownloadNotSupported.map((dataset, index) => (
                <Fragment>
                  <DatasetLabel key={dataset} dataset={{ id: dataset }} />
                  {index < datasetsDownloadNotSupported.length - 1 && ', '}
                </Fragment>
              ))}
            </p>
          ) : null}
          <ActivityDownloadError />
          <Button
            testId="download-activity-vessel-button"
            onClick={onDownloadClick}
            className={styles.downloadBtn}
            loading={isDownloadAreaLoading || isDownloadLoading || hadDownloadTimeoutError}
            disabled={
              isDownloadAreaLoading || !isDownloadReportSupported || hadDownloadTimeoutError
            }
          >
            {isDownloadFinished ? <Icon icon="tick" /> : t('download.title', 'Download')}
          </Button>
        </div>
      </div>
      <DownloadActivityProductsBanner format={format} />
    </Fragment>
  )
}

export default DownloadActivityByVessel
