import React, { useMemo, useCallback } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { getLegendId, useMapLegend } from '@globalfishingwatch/react-hooks'
import {
  TimebarStackedActivity,
  HighlighterCallbackFn,
  HighlighterCallbackFnArgs,
} from '@globalfishingwatch/timebar'
import {
  selectActiveActivityDataviews,
  selectActiveNonTrackEnvironmentalDataviews,
} from 'features/dataviews/dataviews.selectors'
import { useStackedActivity } from 'features/timebar/TimebarActivityGraph.hooks'
import { formatNumber } from 'utils/info'
import { useMapStyle } from 'features/map/map-style.hooks'
import { TimebarVisualisations } from 'types'
import { useTimebarEnvironmentConnect } from 'features/timebar/timebar.hooks'
import { t } from 'features/i18n/i18n'
import styles from './Timebar.module.css'

const TimebarActivityGraph = ({ visualisation }: { visualisation: TimebarVisualisations }) => {
  const activityDataviews = useSelector(selectActiveActivityDataviews)
  const environmentDataviews = useSelector(selectActiveNonTrackEnvironmentalDataviews)
  const { timebarSelectedEnvId } = useTimebarEnvironmentConnect()
  const activeDataviews = useMemo(() => {
    if (visualisation === TimebarVisualisations.Heatmap) {
      return activityDataviews
    }
    const selectedEnvDataview =
      timebarSelectedEnvId && environmentDataviews.find((d) => d.id === timebarSelectedEnvId)

    if (selectedEnvDataview) return [selectedEnvDataview]
    else if (environmentDataviews[0]) return [environmentDataviews[0]]
  }, [activityDataviews, environmentDataviews, timebarSelectedEnvId, visualisation])
  const { loading, stackedActivity, error } = useStackedActivity(activeDataviews)
  const style = useMapStyle()
  const mapLegends = useMapLegend(style, activeDataviews)

  const getActivityHighlighterLabel: HighlighterCallbackFn = useCallback(
    ({ chunk, value, item }: HighlighterCallbackFnArgs) => {
      if (!value || !value.value) return ''
      const dataviewId = item.props?.dataviewId
      const unit = mapLegends.find((l) => l.id === getLegendId(dataviewId))?.unit || ''
      const maxHighlighterFractionDigits =
        visualisation === TimebarVisualisations.Environment ? 2 : undefined
      const labels = [
        formatNumber(value.value, maxHighlighterFractionDigits),
        unit,
        t('common.onScreen', 'on screen'),
      ]
      if (visualisation === TimebarVisualisations.Environment) {
        labels.push(t('common.averageAbbreviated', 'avg.'))
      }

      return labels.join(' ')
    },
    [mapLegends, visualisation]
  )

  if (error) {
    return (
      <div className={styles.error}>
        {t(
          'analysis.error',
          'There was a problem loading the data, please try refreshing the page'
        )}
      </div>
    )
  }
  if (!stackedActivity || !stackedActivity.length) return null

  return (
    <div className={cx({ [styles.loading]: loading })}>
      <TimebarStackedActivity
        key="stackedActivity"
        timeseries={stackedActivity}
        dataviews={activeDataviews}
        highlighterCallback={getActivityHighlighterLabel}
        highlighterIconCallback="heatmap"
      />
    </div>
  )
}

export default TimebarActivityGraph
