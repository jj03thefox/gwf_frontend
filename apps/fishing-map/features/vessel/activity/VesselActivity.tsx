import { useTranslation } from 'react-i18next'
import { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, IconButton, Spinner } from '@globalfishingwatch/ui-components'
import { ActivityByType } from 'features/vessel/activity/activity-by-type/ActivityByType'
import ActivityByVoyage from 'features/vessel/activity/activity-by-voyage/ActivityByVoyage'
import { selectVesselEventsLoading } from 'features/vessel/activity/vessels-activity.selectors'
import VesselActivityDownload from 'features/vessel/activity/VesselActivityDownload'
import { useLocationConnect } from 'routes/routes.hook'
import { selectVesselActivityMode } from 'features/vessel/vessel.config.selectors'
import { VesselProfileActivityMode } from 'types'
import VesselEventsLegend from 'features/workspace/vessels/VesselEventsLegend'
import { selectVesselsDataviews } from 'features/dataviews/dataviews.slice'
import TooltipContainer from 'features/workspace/shared/TooltipContainer'
import { selectVisibleEvents } from 'features/app/app.selectors'
import styles from './VesselActivity.module.css'
import { VesselActivitySummary } from './VesselActivitySummary'

const VesselActivity = () => {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const [showEventsLegend, setShowEventsLegend] = useState(false)
  const visibleEvents = useSelector(selectVisibleEvents)
  const dataviews = useSelector(selectVesselsDataviews)
  const activityMode = useSelector(selectVesselActivityMode)
  const eventsLoading = useSelector(selectVesselEventsLoading)

  const setActivityMode = (vesselActivityMode: VesselProfileActivityMode) => {
    dispatchQueryParams({ vesselActivityMode })
  }
  const toggleEventsLegend = () => {
    setShowEventsLegend(!showEventsLegend)
  }

  if (eventsLoading) {
    return (
      <div className={styles.placeholder}>
        <Spinner />
      </div>
    )
  }
  return (
    <Fragment>
      <div className={styles.summaryContainer}>
        <VesselActivitySummary />
        <div className={styles.actions}>
          <TooltipContainer
            visible={showEventsLegend}
            className={styles.eventsLegendContainer}
            arrowClass={styles.arrow}
            onClickOutside={toggleEventsLegend}
            placement="left-start"
            component={
              <div className={styles.eventsLegendOptions}>
                <VesselEventsLegend dataviews={dataviews} />
              </div>
            }
          >
            <IconButton
              className={styles.eventsLegendButton}
              size="medium"
              type="border"
              icon={visibleEvents === 'all' ? 'filter-off' : 'filter-on'}
              onClick={toggleEventsLegend}
            />
          </TooltipContainer>
          <VesselActivityDownload />
        </div>
      </div>
      <div className={styles.activityTitleContainer}>
        <label>
          {activityMode === 'voyage'
            ? t('vessel.activityByVoyages', 'Timeline by voyages')
            : t('vessel.activityByType', 'Activity by type')}
        </label>
        <Button
          size="small"
          type="border-secondary"
          onClick={(e) => setActivityMode(activityMode === 'type' ? 'voyage' : 'type')}
        >
          {activityMode === 'voyage'
            ? t('vessel.activityGroupByType', 'Group by type')
            : t('vessel.activityGroupByVoyages', 'Group by voyages')}
        </Button>
      </div>
      {eventsLoading && (
        <div className={styles.placeholder}>
          <Spinner />
        </div>
      )}
      {!eventsLoading && activityMode === 'type' && <ActivityByType />}
      {!eventsLoading && activityMode === 'voyage' && <ActivityByVoyage />}
    </Fragment>
  )
}

export default VesselActivity
