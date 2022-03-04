import React, { Fragment, useState, ComponentType } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import { IconButton, Radio } from '@globalfishingwatch/ui-components'
import useClickedOutside from 'hooks/use-clicked-outside'
import { TimebarGraphs, TimebarVisualisations } from 'types'
import { selectActiveActivityDataviews } from 'features/dataviews/dataviews.selectors'
import { selectActivityCategory } from 'features/app/app.selectors'
import { getEventLabel } from 'utils/analytics'
import {
  selectActiveTrackDataviews,
  selectActiveVesselsDataviews,
} from 'features/dataviews/dataviews.slice'
import { ReactComponent as AreaIcon } from 'assets/icons/timebar-area.svg'
import { ReactComponent as TracksIcon } from 'assets/icons/timebar-tracks.svg'
import { ReactComponent as TrackSpeedIcon } from 'assets/icons/timebar-track-speed.svg'
import { ReactComponent as TrackDepthIcon } from 'assets/icons/timebar-track-depth.svg'
import { COLOR_PRIMARY_BLUE } from 'features/app/App'
import { useTimebarVisualisationConnect, useTimebarGraphConnect } from './timebar.hooks'
import styles from './TimebarSettings.module.css'

const Icon = ({
  SvgIcon,
  label,
  color,
  disabled,
}: {
  SvgIcon: ComponentType
  label: string
  color: string
  disabled: boolean
}) => {
  const svgProps = {
    fill: color,
    stroke: color,
  }
  return (
    <Fragment>
      <SvgIcon
        className={cx(styles.icon, { [styles.iconDisabled]: disabled })}
        {...(svgProps as any)}
      />
      {label}
    </Fragment>
  )
}

const TimebarSettings = ({ loading = false }: { loading: boolean }) => {
  const { t } = useTranslation()
  const [optionsPanelOpen, setOptionsPanelOpen] = useState(false)
  const activeHeatmapDataviews = useSelector(selectActiveActivityDataviews)
  const activeTrackDataviews = useSelector(selectActiveTrackDataviews)
  const activeVesselsDataviews = useSelector(selectActiveVesselsDataviews)
  const { timebarVisualisation, dispatchTimebarVisualisation } = useTimebarVisualisationConnect()
  const { timebarGraph, dispatchTimebarGraph } = useTimebarGraphConnect()
  const activityCategory = useSelector(selectActivityCategory)
  const timebarGraphEnabled = activeVesselsDataviews && activeVesselsDataviews.length <= 2

  const openOptions = () => {
    uaEvent({
      category: 'Timebar',
      action: 'Open timebar settings',
      label: getEventLabel([`visualization: ${timebarVisualisation}`]),
    })
    setOptionsPanelOpen(true)
  }
  const closeOptions = () => {
    setOptionsPanelOpen(false)
  }
  const setHeatmapActive = () => {
    dispatchTimebarVisualisation(TimebarVisualisations.Heatmap)
  }
  const setVesselActive = () => {
    dispatchTimebarVisualisation(TimebarVisualisations.Vessel)
    dispatchTimebarGraph(TimebarGraphs.None)
  }
  const setVesselGraphSpeed = () => {
    dispatchTimebarVisualisation(TimebarVisualisations.Vessel)
    dispatchTimebarGraph(TimebarGraphs.Speed)
  }
  const setVesselGraphDepth = () => {
    dispatchTimebarVisualisation(TimebarVisualisations.Vessel)
    dispatchTimebarGraph(TimebarGraphs.Depth)
  }

  const expandedContainerRef = useClickedOutside(closeOptions)

  const activityLabel = `
    ${t('common.activity', 'Activity')} - ${
    activityCategory === 'fishing'
      ? t('common.fishing', 'Fishing')
      : t('common.presence', 'Presence')
  }
  `

  const activityTooltipLabel = !activeHeatmapDataviews?.length
    ? activityCategory === 'fishing'
      ? t(
          'timebarSettings.fishingEffortDisabled',
          'Select at least one apparent fishing effort layer'
        )
      : t('timebarSettings.presenceDisabled', 'Select at least one presence layer')
    : activityCategory === 'fishing'
    ? t('timebarSettings.showFishingEffort', 'Show fishing hours graph')
    : t('timebarSettings.showPresence', 'Show presence graph')

  return (
    <div className={cx('print-hidden', styles.container)} ref={expandedContainerRef}>
      <IconButton
        icon={optionsPanelOpen ? 'close' : 'settings'}
        loading={loading}
        type="map-tool"
        onClick={optionsPanelOpen ? closeOptions : openOptions}
        tooltip={
          optionsPanelOpen
            ? t('timebarSettings.settings_close', 'Close timebar settings')
            : t('timebarSettings.settings_open', 'Open timebar settings')
        }
      />
      {optionsPanelOpen && (
        <div className={styles.optionsContainer}>
          <h1>{t('timebarSettings.title', 'Timebar settings')}</h1>
          <div className={styles.radiosContainer}>
            <Radio
              label={
                <Icon
                  SvgIcon={AreaIcon}
                  label={activityLabel}
                  color={activeHeatmapDataviews[0]?.config.color || COLOR_PRIMARY_BLUE}
                  disabled={!activeHeatmapDataviews?.length}
                />
              }
              disabled={!activeHeatmapDataviews?.length}
              active={timebarVisualisation === TimebarVisualisations.Heatmap}
              tooltip={activityTooltipLabel}
              onClick={setHeatmapActive}
            />
            <Radio
              label={
                <Icon
                  SvgIcon={TracksIcon}
                  label={t('timebarSettings.tracks', 'Tracks')}
                  color={activeTrackDataviews[0]?.config.color || COLOR_PRIMARY_BLUE}
                  disabled={!activeTrackDataviews?.length}
                />
              }
              disabled={!activeTrackDataviews?.length}
              active={
                timebarVisualisation === TimebarVisualisations.Vessel &&
                (timebarGraph === TimebarGraphs.None || !timebarGraphEnabled)
              }
              tooltip={
                !activeTrackDataviews?.length
                  ? t('timebarSettings.tracksDisabled', 'Select at least one vessel')
                  : t('timebarSettings.showTracks', 'Show tracks graph')
              }
              onClick={setVesselActive}
            />
            <Radio
              label={
                <Icon
                  SvgIcon={TrackSpeedIcon}
                  label={t('timebarSettings.graphSpeed', 'Track Speed')}
                  color={activeTrackDataviews[0]?.config.color || COLOR_PRIMARY_BLUE}
                  disabled={!activeTrackDataviews?.length || !timebarGraphEnabled}
                />
              }
              disabled={!activeTrackDataviews?.length || !timebarGraphEnabled}
              active={
                timebarVisualisation === TimebarVisualisations.Vessel &&
                timebarGraph === TimebarGraphs.Speed &&
                timebarGraphEnabled
              }
              tooltip={
                !activeTrackDataviews?.length
                  ? t('timebarSettings.tracksDisabled', 'Select at least one vessel')
                  : !timebarGraphEnabled
                  ? t(
                      'timebarSettings.graphDisabled',
                      'Not available with more than 2 vessels selected'
                    )
                  : t('timebarSettings.showGraphSpeed', 'Show track speed graph')
              }
              onClick={setVesselGraphSpeed}
            />
            <Radio
              label={
                <Icon
                  SvgIcon={TrackDepthIcon}
                  label={t('timebarSettings.graphDepth', 'Track Depth')}
                  color={activeTrackDataviews[0]?.config.color || COLOR_PRIMARY_BLUE}
                  disabled={!activeTrackDataviews?.length || !timebarGraphEnabled}
                />
              }
              disabled={!activeTrackDataviews?.length || !timebarGraphEnabled}
              active={
                timebarVisualisation === TimebarVisualisations.Vessel &&
                timebarGraph === TimebarGraphs.Depth &&
                timebarGraphEnabled
              }
              tooltip={
                !activeTrackDataviews?.length
                  ? t('timebarSettings.tracksDisabled', 'Select at least one vessel')
                  : !timebarGraphEnabled
                  ? t(
                      'timebarSettings.graphDisabled',
                      'Not available with more than 2 vessels selected'
                    )
                  : t('timebarSettings.showGraphDepth', 'Show track depth graph')
              }
              onClick={setVesselGraphDepth}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default TimebarSettings
