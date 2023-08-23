import { useSelector } from 'react-redux'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import Sticky from 'react-sticky-el'
import { useMemo } from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import {
  Bbox,
  eventsToBbox,
  filterSegmentsByTimerange,
  segmentsToBbox,
} from '@globalfishingwatch/data-transforms'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import {
  selectVesselEventsFilteredByTimerange,
  selectVesselTracksData,
} from 'features/vessel/vessel.selectors'
import { selectVesselInfoData, setVesselPrintMode } from 'features/vessel/vessel.slice'
import { formatInfoField } from 'utils/info'
import VesselGroupAddButton from 'features/vessel-groups/VesselGroupAddButton'
import { getCurrentIdentityVessel, getVesselProperty } from 'features/vessel/vessel.utils'
import { selectVesselProfileDataview } from 'features/dataviews/dataviews.slice'
import { COLOR_PRIMARY_BLUE } from 'features/app/App'
import { useLocationConnect } from 'routes/routes.hook'
import { selectViewOnlyVessel } from 'features/vessel/vessel.config.selectors'
import { selectIsWorkspaceVesselLocation } from 'routes/routes.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import styles from './VesselHeader.module.css'

const VesselHeader = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchQueryParams } = useLocationConnect()
  const viewOnlyVessel = useSelector(selectViewOnlyVessel)
  const vesselTrack = useSelector(selectVesselTracksData)
  const vessel = useSelector(selectVesselInfoData)
  const { start, end } = useTimerangeConnect()
  const isWorkspaceVesselLocation = useSelector(selectIsWorkspaceVesselLocation)
  const vesselDataview = useSelector(selectVesselProfileDataview)
  const events = useSelector(selectVesselEventsFilteredByTimerange)
  const fitBounds = useMapFitBounds()

  const bounds = useMemo(() => {
    let bounds: Bbox | undefined
    if (events?.length) {
      bounds = eventsToBbox(events)
    } else if (vesselTrack?.length) {
      const filteredSegments = filterSegmentsByTimerange(vesselTrack, { start, end })
      bounds = filteredSegments?.length ? segmentsToBbox(filteredSegments) : undefined
    }
    return bounds
  }, [end, events, start, vesselTrack])

  const onVesselFitBoundsClick = () => {
    if (bounds) {
      fitBounds(bounds)
    }
  }

  const onPrintClick = () => {
    dispatch(setVesselPrintMode(true))
  }

  const setViewOnlyVessel = () => {
    dispatchQueryParams({ viewOnlyVessel: !viewOnlyVessel })
  }

  return (
    <Sticky scrollElement=".scrollContainer" stickyClassName={styles.sticky}>
      <div className={cx(styles.summaryContainer, styles.titleContainer)}>
        <h1 className={styles.title}>
          <svg className={styles.vesselIcon} width="16" height="16">
            <path
              fill={vesselDataview?.config?.color || COLOR_PRIMARY_BLUE}
              stroke={COLOR_PRIMARY_BLUE}
              strokeOpacity=".5"
              d="M15.23.75v6.36l-7.8 7.8-1.58-4.78-4.78-1.59L8.87.75h6.36Z"
            />
          </svg>
          {formatInfoField(getVesselProperty(vessel, 'shipname'), 'name')} (
          {formatInfoField(getVesselProperty(vessel, 'flag'), 'flag')})
          <div>
            <a className={styles.reportLink} href={window.location.href}>
              {t('vessel.linkToVessel', 'Check the vessel profile here')}
            </a>
          </div>
        </h1>
        <div className={styles.actionsContainer}>
          {isWorkspaceVesselLocation && (
            <IconButton
              className="print-hidden"
              type="border"
              icon={viewOnlyVessel ? 'layers-on' : 'layers-off'}
              tooltip={
                viewOnlyVessel
                  ? t('vessel.showOtherLayers', 'Show other layers')
                  : t('vessel.hideOtherLayers', 'Hide other layers')
              }
              tooltipPlacement="bottom"
              size="small"
              onClick={setViewOnlyVessel}
            />
          )}
          <IconButton
            className="print-hidden"
            type="border"
            icon="target"
            tooltip={t('layer.vessel_fit_bounds', 'Center view on vessel track')}
            tooltipPlacement="bottom"
            size="small"
            disabled={!bounds}
            onClick={onVesselFitBoundsClick}
          />
          <IconButton
            className="print-hidden"
            type="border"
            icon="print"
            tooltip={t('vessel.print', 'Print or save as PDF')}
            tooltipPlacement="bottom"
            size="small"
            onClick={onPrintClick}
          />
          {/* TODO: get info and track datasets for vessel */}
          <VesselGroupAddButton
            buttonSize="small"
            buttonType="border-secondary"
            vessels={vessel ? [getCurrentIdentityVessel(vessel)] : []}
            showCount={false}
            buttonClassName="print-hidden"
          />
        </div>
      </div>
    </Sticky>
  )
}

export default VesselHeader
