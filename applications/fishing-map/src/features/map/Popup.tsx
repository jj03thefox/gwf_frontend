import React from 'react'
import { useSelector } from 'react-redux'
import { Anchor } from 'mapbox-gl'
import { useTranslation } from 'react-i18next'
import { Popup } from '@globalfishingwatch/react-map-gl'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { Generators } from '@globalfishingwatch/layer-composer'
import { formatInfoField, formatNumber } from 'utils/info'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { selectTracksDatasets, selectVesselsDatasets } from 'features/workspace/workspace.selectors'
import I18nNumber from 'features/i18n/i18nNumber'
import { TooltipEvent, TooltipEventFeature } from '../map/map.hooks'
import styles from './Popup.module.css'

// Translations by feature.unit static keys
// t('common.hour')

type ContextTooltipRowProps = {
  feature: TooltipEventFeature
}

// TODO: don't use titles here, think how to get the layer id
const propertyByTitle: Record<string, string> = {
  EEZ: 'geoname',
  'Tuna RFMO areas': 'id',
  'WPP NRI areas': 'region_id',
  mpa: 'name',
}
function ContextTooltipRow({ feature }: ContextTooltipRowProps) {
  const property = propertyByTitle[feature.title]
    ? feature.properties[propertyByTitle[feature.title]]
    : ''
  return (
    <div className={styles.popupSection}>
      <span className={styles.popupSectionColor} style={{ backgroundColor: feature.color }} />
      <div className={styles.popupSectionContent}>
        <h3 className={styles.popupSectionTitle}>{feature.title}</h3>
        <div>{property || feature.value}</div>
      </div>
    </div>
  )
}

type HeatmapTooltipRowProps = {
  feature: TooltipEventFeature
  loading: boolean
}
function HeatmapTooltipRow({ feature, loading }: HeatmapTooltipRowProps) {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const trackDatasets = useSelector(selectTracksDatasets)
  const searchDatasets = useSelector(selectVesselsDatasets)
  const onVesselClick = (vessel: { id: string }, feature: TooltipEventFeature) => {
    const trackDatasetByFeature = trackDatasets.filter((trackDataset) =>
      feature.dataset?.relatedDatasets?.some(
        (featureRelatedDataset) => featureRelatedDataset.id === trackDataset.id
      )
    )
    const searchDatasetByFeature = searchDatasets.filter((trackDataset) =>
      feature.dataset?.relatedDatasets?.some(
        (featureRelatedDataset) => featureRelatedDataset.id === trackDataset.id
      )
    )
    const vesselDataviewInstance = getVesselDataviewInstance(
      vessel,
      trackDatasetByFeature,
      searchDatasetByFeature
    )
    if (vesselDataviewInstance) {
      upsertDataviewInstance(vesselDataviewInstance)
    }
  }
  return (
    <div className={styles.popupSection}>
      <span className={styles.popupSectionColor} style={{ backgroundColor: feature.color }} />
      <div className={styles.popupSectionContent}>
        <h3 className={styles.popupSectionTitle}>{feature.title}</h3>
        <div>
          <I18nNumber number={feature.value} />{' '}
          {t([`common.${feature.unit}`, 'common.hour'], 'hours', {
            count: parseInt(feature.value), // neded to select the plural automatically
          })}
        </div>
        {loading && (
          <div className={styles.loading}>
            <Spinner size="small" />
          </div>
        )}
        {feature.vesselsInfo && (
          <div className={styles.vesselsTable}>
            <div className={styles.vesselsHeader}>
              <label className={styles.vesselsHeaderLabel}>{t('common.vessel_plural')}</label>
              <label className={styles.vesselsHeaderLabel}>{t('common.hour_plural')}</label>
            </div>
            {feature.vesselsInfo.vessels.map((vessel, i) => (
              <button
                key={i}
                className={styles.vesselRow}
                onClick={() => {
                  onVesselClick(vessel, feature)
                }}
              >
                <span className={styles.vesselName}>
                  {vessel.shipname ? formatInfoField(vessel.shipname, 'name') : vessel.id}
                </span>
                <span>{formatNumber(vessel.hours)}</span>
              </button>
            ))}
            {feature.vesselsInfo.overflow && (
              <div className={styles.vesselsMore}>
                + {feature.vesselsInfo.numVessels - feature.vesselsInfo.vessels.length}{' '}
                {t('common.more')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

type PopupWrapperProps = {
  tooltipEvent: TooltipEvent
  closeButton?: boolean
  closeOnClick?: boolean
  className: string
  onClose?: () => void
  loading?: boolean
  anchor?: Anchor
}
function PopupWrapper({
  tooltipEvent,
  closeButton = false,
  closeOnClick = false,
  className,
  onClose,
  loading = false,
  anchor,
}: PopupWrapperProps) {
  return (
    <Popup
      latitude={tooltipEvent.latitude}
      longitude={tooltipEvent.longitude}
      closeButton={closeButton}
      closeOnClick={closeOnClick}
      onClose={onClose}
      className={styles.popup}
      anchor={anchor}
    >
      <div className={className}>
        {tooltipEvent.features.map((feature: TooltipEventFeature, i: number) => {
          if (feature.type === Generators.Type.HeatmapAnimated) {
            return <HeatmapTooltipRow key={i} feature={feature} loading={loading} />
          }
          if (feature.type === Generators.Type.Context) {
            return <ContextTooltipRow key={i} feature={feature} />
          }
          return null
        })}
      </div>
    </Popup>
  )
}

export function HoverPopup({ event }: { event: TooltipEvent | null }) {
  if (event && event.features) {
    return <PopupWrapper tooltipEvent={event} className={styles.hover} anchor="top" />
  }
  return null
}

type ClickPopupProps = {
  event: TooltipEvent | null
  onClose?: () => void
  loading?: boolean
}

export function ClickPopup({ event, onClose, loading = false }: ClickPopupProps) {
  if (event && event.features) {
    return (
      <PopupWrapper
        tooltipEvent={event}
        closeButton={true}
        closeOnClick={false}
        className={styles.click}
        onClose={onClose}
        loading={loading}
      />
    )
  }
  return null
}
