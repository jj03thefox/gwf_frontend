import { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { uniq } from 'es-toolkit'
import type { Tab } from '@globalfishingwatch/ui-components'
import { Tabs } from '@globalfishingwatch/ui-components'
import type { ContextFeature } from '@globalfishingwatch/deck-layers'
import { DataviewType } from '@globalfishingwatch/api-types'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useLocationConnect } from 'routes/routes.hook'
import { isActivityReport } from 'features/dataviews/selectors/dataviews.selectors'
import WorkspaceError, { ErrorPlaceHolder } from 'features/workspace/WorkspaceError'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { selectWorkspaceVesselGroupsStatus } from 'features/vessel-groups/vessel-groups.slice'
import {
  selectHasReportBuffer,
  selectReportArea,
  selectReportAreaStatus,
} from 'features/reports/areas/area-reports.selectors'
import { TimebarVisualisations } from 'types'
import {
  useTimebarEnvironmentConnect,
  useTimebarVisualisationConnect,
} from 'features/timebar/timebar.hooks'
import { getReportCategoryFromDataview } from 'features/reports/areas/area-reports.utils'
import {
  resetReportData,
  selectReportVesselsStatus,
} from 'features/reports/shared/activity/reports-activity.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectReportCategory } from 'features/app/selectors/app.reports.selector'
import { useSetTimeseries } from 'features/reports/shared/activity/reports-activity-timeseries.hooks'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import ActivityReport from 'features/reports/shared/activity/ReportActivity'
import ReportTitle from 'features/reports/areas/title/ReportTitle'
import { ReportCategory } from 'features/reports/areas/area-reports.types'
import ReportSummary from 'features/reports/areas/summary/ReportSummary'
import ReportEnvironment from 'features/reports/areas/environment/ReportEnvironment'
import {
  useFetchReportArea,
  useFitAreaInViewport,
  useHighlightReportArea,
} from 'features/reports/areas/area-reports.hooks'
import styles from 'features/reports/areas/AreaReport.module.css'
import { selectAllDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'

export type ReportActivityUnit = 'hour' | 'detection'

export default function Report() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const setTimeseries = useSetTimeseries()
  const highlightArea = useHighlightReportArea()
  const { dispatchQueryParams } = useLocationConnect()
  const reportCategory = useSelector(selectReportCategory)
  const reportStatus = useSelector(selectReportVesselsStatus)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const reportAreaError = useSelector(selectReportAreaStatus) === AsyncReducerStatus.Error
  const { dispatchTimebarVisualisation } = useTimebarVisualisationConnect()
  const { dispatchTimebarSelectedEnvId } = useTimebarEnvironmentConnect()
  const workspaceVesselGroupsStatus = useSelector(selectWorkspaceVesselGroupsStatus)
  const reportArea = useSelector(selectReportArea)
  const hasReportBuffer = useSelector(selectHasReportBuffer)
  const activityUnit = isActivityReport(reportCategory) ? 'hour' : 'detection'

  const dataviews = useSelector(selectAllDataviewInstancesResolved)
  const heatmapDataviews = useMemo(
    () =>
      dataviews?.filter(
        (d) =>
          d.config?.visible === true &&
          (d.config?.type === DataviewType.HeatmapAnimated ||
            d.config?.type === DataviewType.HeatmapStatic)
      ),
    [dataviews]
  )
  const dataviewCategories = useMemo(
    () => uniq(heatmapDataviews?.map((d) => getReportCategoryFromDataview(d)) || []),
    [heatmapDataviews]
  )
  const categoryTabs: Tab<ReportCategory>[] = [
    {
      id: ReportCategory.Fishing,
      title: t('common.fishing', 'Fishing'),
    },
    {
      id: ReportCategory.Presence,
      title: t('common.presence', 'Presence'),
    },
    {
      id: ReportCategory.Detections,
      title: t('common.detections', 'Detections'),
    },
    {
      id: ReportCategory.Environment,
      title: t('common.environment', 'Environment'),
    },
  ]
  const filteredCategoryTabs = categoryTabs.flatMap((tab) => {
    if (!dataviewCategories.includes(tab.id)) {
      return []
    }
    return {
      ...tab,
      disabled: tab.id !== reportCategory && reportStatus === AsyncReducerStatus.Loading,
    }
  })

  const { status } = useFetchReportArea()
  const fitAreaInViewport = useFitAreaInViewport()

  // This ensures that the area is in viewport when then area load finishes
  useEffect(() => {
    if (status === AsyncReducerStatus.Finished && reportArea?.bounds) {
      fitAreaInViewport()
    }
    // Reacting only to the area status and fitting bounds after load
  }, [status, reportArea])

  useEffect(() => {
    if (reportArea && !hasReportBuffer) {
      highlightArea(reportArea as ContextFeature)
    }
  }, [highlightArea, reportArea, hasReportBuffer])

  const setTimebarVisualizationByCategory = useCallback(
    (category: ReportCategory) => {
      if (category === ReportCategory.Environment && dataviews && dataviews.length > 0) {
        dispatchTimebarVisualisation(TimebarVisualisations.Environment)
        dispatchTimebarSelectedEnvId(dataviews[0]?.id)
      } else {
        dispatchTimebarVisualisation(
          category === ReportCategory.Detections
            ? TimebarVisualisations.HeatmapDetections
            : TimebarVisualisations.HeatmapActivity
        )
      }
    },
    [dataviews, dispatchTimebarSelectedEnvId, dispatchTimebarVisualisation]
  )

  useEffect(() => {
    setTimebarVisualizationByCategory(reportCategory)
  }, [reportCategory])

  const handleTabClick = (option: Tab<ReportCategory>) => {
    if (option.id !== reportCategory) {
      setTimeseries([])
      dispatch(resetReportData())
      dispatchQueryParams({ reportCategory: option.id, reportVesselPage: 0 })
      fitAreaInViewport()
      trackEvent({
        category: TrackCategory.Analysis,
        action: `Click on ${option.id} report`,
      })
    }
  }

  if (
    workspaceStatus === AsyncReducerStatus.Error ||
    workspaceVesselGroupsStatus === AsyncReducerStatus.Error
  ) {
    return <WorkspaceError />
  }

  if (reportAreaError) {
    return (
      <ErrorPlaceHolder
        title={t('errors.areaLoad', 'There was an error loading the report area')}
      ></ErrorPlaceHolder>
    )
  }

  return (
    <Fragment>
      {reportArea && <ReportTitle area={reportArea} />}
      {filteredCategoryTabs.length > 1 && (
        <div className={styles.tabContainer}>
          <Tabs
            tabs={filteredCategoryTabs}
            activeTab={reportCategory}
            onTabClick={handleTabClick}
          />
        </div>
      )}
      {reportCategory === ReportCategory.Environment ? (
        <ReportEnvironment />
      ) : (
        <div>
          <ReportSummary activityUnit={activityUnit} reportStatus={reportStatus} />
          <ActivityReport reportName={reportArea?.name} />
        </div>
      )}
    </Fragment>
  )
}
