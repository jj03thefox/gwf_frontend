import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo } from 'react'
import type { Tab } from '@globalfishingwatch/ui-components'
import { Button, Tabs } from '@globalfishingwatch/ui-components'
import { selectReportVesselGroupId } from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import type { VGRSection } from 'features/vessel-groups/vessel-groups.types'
import { TimebarVisualisations } from 'types'
import {
  useTimebarVesselGroupConnect,
  useTimebarVisualisationConnect,
} from 'features/timebar/timebar.hooks'
import VGREvents from 'features/reports/vessel-groups/events/VGREvents'
import VGRActivity from 'features/reports/vessel-groups/activity/VGRActivity'
import { useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import { selectUserData } from 'features/user/selectors/user.selectors'
import { isOutdatedVesselGroup } from 'features/vessel-groups/vessel-groups.utils'
import { getEventLabel } from 'utils/analytics'
import {
  useFitAreaInViewport,
  useReportAreaCenter,
  useVesselGroupBounds,
} from 'features/reports/areas/area-reports.hooks'
import { useEditVesselGroupModal, useFetchVesselGroupReport } from './vessel-group-report.hooks'
import { selectVGRData, selectVGRStatus } from './vessel-group-report.slice'
import VesselGroupReportTitle from './VesselGroupReportTitle'
import VesselGroupReportVessels from './vessels/VesselGroupReportVessels'
import { selectVGRSection } from './vessel-group.config.selectors'
import VesselGroupReportInsights from './insights/VGRInsights'
import { selectVGRDataview } from './vessel-group-report.selectors'
import styles from './VesselGroupReport.module.css'
import { selectVGRVesselsTimeRange } from './vessels/vessel-group-report-vessels.selectors'
import VesselGroupReportError from './VesselGroupReportError'

function VesselGroupReport() {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const fetchVesselGroupReport = useFetchVesselGroupReport()
  const vesselGroupId = useSelector(selectReportVesselGroupId)
  const vesselGroup = useSelector(selectVGRData)!
  const reportStatus = useSelector(selectVGRStatus)
  const reportSection = useSelector(selectVGRSection)
  const reportDataview = useSelector(selectVGRDataview)
  const timeRange = useSelector(selectVGRVesselsTimeRange)
  const userData = useSelector(selectUserData)
  const { dispatchTimebarVisualisation } = useTimebarVisualisationConnect()
  const { dispatchTimebarSelectedVGId } = useTimebarVesselGroupConnect()
  const fitAreaInViewport = useFitAreaInViewport()
  const { bbox } = useVesselGroupBounds(reportDataview?.id)
  const coordinates = useReportAreaCenter(bbox!)
  const setMapCoordinates = useSetMapCoordinates()
  const bboxHash = bbox ? bbox.join(',') : ''
  const isOutdated = isOutdatedVesselGroup(vesselGroup)
  const onEditClick = useEditVesselGroupModal()

  useEffect(() => {
    fetchVesselGroupReport(vesselGroupId)
    if (reportDataview) {
      dispatchTimebarVisualisation(TimebarVisualisations.VesselGroup)
      dispatchTimebarSelectedVGId(reportDataview?.id)
    }
  }, [
    reportDataview,
    dispatchTimebarSelectedVGId,
    dispatchTimebarVisualisation,
    fetchVesselGroupReport,
    vesselGroupId,
  ])

  useEffect(() => {
    if (reportSection === 'vessels' && coordinates) {
      setMapCoordinates(coordinates)
    }
  }, [bboxHash, setMapCoordinates])

  useEffect(() => {
    trackEvent({
      category: TrackCategory.VesselGroupReport,
      action: 'update_time_range_from_vessel_group_report',
      label: getEventLabel([timeRange?.start || '', timeRange?.end || '']),
    })
  }, [timeRange])

  const changeTab = useCallback(
    (tab: Tab<VGRSection>) => {
      dispatchQueryParams({ vGRSection: tab.id })
      trackEvent({
        category: TrackCategory.VesselGroupReport,
        action: `access_vessel_group_${tab.id}_tab`,
        label: getEventLabel([vesselGroup?.id, timeRange?.start || '', timeRange?.end || '']),
        value: `number of vessels: ${vesselGroup?.vessels?.length}`,
      })
      if (tab.id === 'activity') {
        fitAreaInViewport()
      }
    },
    [dispatchQueryParams, fitAreaInViewport, timeRange, vesselGroup]
  )

  const loading = reportStatus === AsyncReducerStatus.Loading

  const sectionTabs: Tab<VGRSection>[] = useMemo(
    () => [
      {
        id: 'vessels',
        title: t('common.vessels', 'vessels'),
        content: <VesselGroupReportVessels loading={loading} />,
      },
      {
        id: 'insights',
        title: t('common.insights', 'Insights'),
        content: <VesselGroupReportInsights />,
      },
      {
        id: 'activity',
        title: t('common.activity', 'Activity'),
        content: <VGRActivity />,
      },
      {
        id: 'events',
        title: t('common.events', 'Events'),
        content: <VGREvents />,
      },
    ],
    [t, loading]
  )

  const isOwnedByUser = vesselGroup?.ownerId === userData?.id
  if (isOutdated) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.updateContainer}>
          <label>
            {t(
              'vesselGroupReport.linkDisabled',
              'This vessel group needs to be updated to latest available data'
            )}
          </label>
          {isOwnedByUser && (
            <Button onClick={() => onEditClick(vesselGroup)}>
              {t('vesselGroup.clickToUpdate', 'Click to update')}
            </Button>
          )}
        </div>
      </div>
    )
  }

  if (reportStatus === AsyncReducerStatus.Error) {
    return <VesselGroupReportError vesselGroupId={vesselGroupId} />
  }

  return (
    <div>
      <VesselGroupReportTitle vesselGroup={vesselGroup} loading={loading} />
      <Tabs
        tabs={sectionTabs}
        activeTab={reportSection}
        onTabClick={changeTab}
        // mountAllTabsOnLoad
      />
    </div>
  )
}

export default VesselGroupReport
