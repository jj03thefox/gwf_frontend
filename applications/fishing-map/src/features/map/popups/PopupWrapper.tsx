import React, { Fragment } from 'react'
import cx from 'classnames'
import { groupBy } from 'lodash'
import type { Anchor } from '@globalfishingwatch/mapbox-gl'
import { Popup } from '@globalfishingwatch/react-map-gl'
import { Generators } from '@globalfishingwatch/layer-composer'
import { DataviewCategory } from '@globalfishingwatch/api-types/dist'
import { TooltipEvent } from 'features/map/map.hooks'
import { POPUP_CATEGORY_ORDER } from 'data/config'
import styles from './Popup.module.css'
import FishingTooltipRow from './FishingLayers'
import PresenceTooltipRow from './PresenceLayers'
import ViirsTooltipRow from './ViirsLayers'
import TileClusterRow from './TileClusterLayers'
import EnvironmentTooltipSection from './EnvironmentLayers'
import ContextTooltipSection from './ContextLayers'
import UserContextTooltipSection from './UserContextLayers'
import VesselEventsLayers from './VesselEventsLayers'

type PopupWrapperProps = {
  event: TooltipEvent | null
  closeButton?: boolean
  closeOnClick?: boolean
  className?: string
  onClose?: () => void
  anchor?: Anchor
  type?: 'hover' | 'click'
}
function PopupWrapper({
  event,
  closeButton = false,
  closeOnClick = false,
  type = 'hover',
  className = '',
  onClose,
  anchor,
}: PopupWrapperProps) {
  if (!event) return null

  const visibleFeatures = event.features.filter((feature) => feature.visible)
  const featureByCategory = groupBy(
    visibleFeatures.sort(
      (a, b) => POPUP_CATEGORY_ORDER.indexOf(a.category) - POPUP_CATEGORY_ORDER.indexOf(b.category)
    ),
    'category'
  )

  return (
    <Popup
      latitude={event.latitude}
      longitude={event.longitude}
      closeButton={closeButton}
      closeOnClick={closeOnClick}
      onClose={onClose}
      className={cx(styles.popup, styles[type], className)}
      anchor={anchor}
      captureClick
    >
      <div className={styles.content}>
        {Object.entries(featureByCategory).map(([featureCategory, features]) => {
          switch (featureCategory) {
            case DataviewCategory.Fishing:
              return features.map((feature, i) => (
                <FishingTooltipRow
                  key={i + (feature.title as string)}
                  feature={feature}
                  showFeaturesDetails={type === 'click'}
                />
              ))
            case DataviewCategory.Presence:
              return features.map((feature, i) => {
                if (feature.temporalgrid?.sublayerInteractionType === 'presence-detail') {
                  return (
                    <FishingTooltipRow
                      key={i + (feature.title as string)}
                      feature={feature}
                      showFeaturesDetails={type === 'click'}
                    />
                  )
                }
                return feature.temporalgrid?.sublayerInteractionType === 'viirs' ? (
                  <ViirsTooltipRow
                    key={i + (feature.title as string)}
                    feature={feature}
                    showFeaturesDetails={type === 'click'}
                  />
                ) : (
                  <PresenceTooltipRow
                    key={i + (feature.title as string)}
                    feature={feature}
                    showFeaturesDetails={type === 'click'}
                  />
                )
              })
            case DataviewCategory.Events:
              return (
                <TileClusterRow
                  key={featureCategory}
                  features={features}
                  showFeaturesDetails={type === 'click'}
                />
              )
            case DataviewCategory.Environment:
              return (
                <EnvironmentTooltipSection
                  key={featureCategory}
                  features={features}
                  showFeaturesDetails={type === 'click'}
                />
              )
            // TODO: merge UserContextTooltipSection and ContextTooltipSection
            case DataviewCategory.Context:
              const userContextFeatures = features.filter(
                (feature) => feature.type === Generators.Type.UserContext
              )
              const defaultContextFeatures = features.filter(
                (feature) => feature.type === Generators.Type.Context
              )
              return (
                <Fragment key={featureCategory}>
                  <UserContextTooltipSection
                    features={userContextFeatures}
                    showFeaturesDetails={type === 'click'}
                  />
                  <ContextTooltipSection
                    features={defaultContextFeatures}
                    showFeaturesDetails={type === 'click'}
                  />
                </Fragment>
              )

            case DataviewCategory.Vessels:
              if (type === 'click') {
                return null
              }
              return <VesselEventsLayers key={featureCategory} features={features} />

            default:
              return null
          }
        })}
      </div>
    </Popup>
  )
}

export default PopupWrapper
