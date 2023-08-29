import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Link from 'redux-first-router-link'
import { IconButton } from '@globalfishingwatch/ui-components'
import {
  selectActiveHeatmapDataviews,
  selectHasReportLayersVisible,
} from 'features/dataviews/dataviews.selectors'
import { getActivityDatasetsReportSupported } from 'features/datasets/datasets.utils'
import { isGuestUser, selectUserData } from 'features/user/user.slice'
import LoginButtonWrapper from 'routes/LoginButtonWrapper'
import { WORKSPACE_REPORT } from 'routes/routes'
import { DEFAULT_WORKSPACE_ID, WorkspaceCategory } from 'data/workspaces'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import { selectLocationAreaId, selectLocationQuery } from 'routes/routes.selectors'
import { selectSidebarOpen } from 'features/app/app.selectors'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { getFeatureAreaId, getFeatureBounds } from 'features/map/popups/ContextLayers.hooks'
import { resetSidebarScroll } from 'features/sidebar/Sidebar'
import { resetReportData } from 'features/reports/report.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import styles from './Popup.module.css'

interface DownloadPopupButtonProps {
  onClick: (e: React.MouseEvent<Element, MouseEvent>) => void
}
const DownloadPopupButton: React.FC<DownloadPopupButtonProps> = ({
  onClick,
}: DownloadPopupButtonProps) => {
  const { t } = useTranslation()
  const guestUser = useSelector(isGuestUser)
  const userData = useSelector(selectUserData)
  const activityDataviews = useSelector(selectActiveHeatmapDataviews)
  const hasAnalysableLayer = useSelector(selectHasReportLayersVisible)
  const datasetsReportAllowed = getActivityDatasetsReportSupported(
    activityDataviews,
    userData?.permissions || []
  )

  const datasetsReportSupported = datasetsReportAllowed?.length > 0
  return (
    <LoginButtonWrapper
      tooltip={t(
        'download.activityLogin',
        'Register and login to download activity (free, 2 minutes)'
      )}
    >
      <IconButton
        icon="download"
        disabled={!guestUser && (!hasAnalysableLayer || !datasetsReportSupported)}
        testId="download-activity-layers"
        tooltip={
          datasetsReportSupported
            ? t('download.activityAction', 'Download visible activity layers for this area')
            : t('analysis.onlyAISAllowed', 'Only AIS datasets are allowed to download')
        }
        onClick={onClick}
        size="small"
      />
    </LoginButtonWrapper>
  )
}

interface ReportPopupButtonProps {
  feature: TooltipEventFeature
  onClick?: (e: React.MouseEvent<Element, MouseEvent>, feature: TooltipEventFeature) => void
}

export const ReportPopupLink = ({ feature, onClick }: ReportPopupButtonProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const hasAnalysableLayer = useSelector(selectHasReportLayersVisible)
  const workspace = useSelector(selectWorkspace)
  const isSidebarOpen = useSelector(selectSidebarOpen)
  const query = useSelector(selectLocationQuery)
  const bounds = getFeatureBounds(feature)
  const reportAreaId = useSelector(selectLocationAreaId)
  const areaId = getFeatureAreaId(feature)
  const isSameArea = reportAreaId?.toString() === areaId?.toString()
  if (!hasAnalysableLayer || isSameArea) {
    return (
      <IconButton
        icon="analysis"
        disabled={!hasAnalysableLayer}
        size="small"
        tooltip={
          isSameArea
            ? ''
            : t(
                'common.analysisNotAvailable',
                'Toggle an activity or environmenet layer on to analyse in in this area'
              )
        }
      />
    )
  }
  const onReportClick = (e: React.MouseEvent<Element, MouseEvent>) => {
    trackEvent({
      category: TrackCategory.Analysis,
      action: 'Open analysis panel',
      label: areaId,
    })
    resetSidebarScroll()
    dispatch(resetReportData())
    if (onClick) {
      onClick(e, feature)
    }
  }

  return (
    <Link
      className={styles.workspaceLink}
      to={{
        type: WORKSPACE_REPORT,
        payload: {
          category: workspace?.category || WorkspaceCategory.FishingActivity,
          workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
          datasetId: feature.datasetId,
          areaId,
        },
        query: {
          ...query,
          reportAreaSource: feature.source,
          ...(bounds && { reportAreaBounds: bounds }),
          ...(!isSidebarOpen && { sidebarOpen: true }),
        },
      }}
      onClick={onReportClick}
    >
      <IconButton
        icon="analysis"
        tooltip={t('common.analysis', 'Create an analysis for this area')}
        testId="open-analysis"
        size="small"
      />
    </Link>
  )
}

interface ContextLayersRowProps {
  id: string
  label: string
  feature: TooltipEventFeature
  showFeaturesDetails: boolean
  showActions?: boolean
  linkHref?: string
  handleDownloadClick?: (e: React.MouseEvent<Element, MouseEvent>) => void
  handleReportClick?: (
    e: React.MouseEvent<Element, MouseEvent>,
    feature: TooltipEventFeature
  ) => void
}
const ContextLayersRow: React.FC<ContextLayersRowProps> = ({
  id,
  label,
  showFeaturesDetails,
  linkHref,
  feature,
  handleDownloadClick,
  handleReportClick,
}: ContextLayersRowProps) => {
  const { t } = useTranslation()

  return (
    <div className={styles.row} key={id}>
      <span className={styles.rowText}>{label}</span>
      {showFeaturesDetails && (
        <div className={styles.rowActions}>
          {handleDownloadClick && <DownloadPopupButton onClick={handleDownloadClick} />}
          <ReportPopupLink feature={feature} onClick={handleReportClick} />
          {linkHref && (
            <a target="_blank" rel="noopener noreferrer" href={linkHref}>
              <IconButton icon="info" tooltip={t('common.learnMore', 'Learn more')} size="small" />
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default ContextLayersRow
