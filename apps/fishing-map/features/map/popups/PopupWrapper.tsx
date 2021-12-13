import React, { Fragment, useEffect } from 'react'
import cx from 'classnames'
import { groupBy } from 'lodash'
import { Popup } from 'react-map-gl'
import type { PositionType } from 'react-map-gl/src/utils/dynamic-position'
import { useSelector } from 'react-redux'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { Spinner } from '@globalfishingwatch/ui-components'
import { TooltipEvent } from 'features/map/map.hooks'
import { POPUP_CATEGORY_ORDER } from 'data/config'
import { useTimeCompareTimeDescription } from 'features/analysis/analysisDescription.hooks'
import ViirsMatchTooltipRow from 'features/map/popups/ViirsMatchLayers'
import UserPointsTooltipSection from 'features/map/popups/UserPointsLayers'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  selectApiEventStatus,
  selectFishingInteractionStatus,
  selectViirsInteractionStatus,
} from '../map.slice'
import useViewport from '../map-viewport.hooks'
import styles from './Popup.module.css'
import FishingTooltipRow from './FishingLayers'
import PresenceTooltipRow from './PresenceLayers'
import ViirsTooltipRow from './ViirsLayers'
import TileClusterRow from './TileClusterLayers'
import EnvironmentTooltipSection from './EnvironmentLayers'
import ContextTooltipSection from './ContextLayers'
import UserContextTooltipSection from './UserContextLayers'
import VesselEventsLayers from './VesselEventsLayers'
import ComparisonRow from './ComparisonRow'

type PopupWrapperProps = {
  event: TooltipEvent | null
  closeButton?: boolean
  closeOnClick?: boolean
  className?: string
  onClose?: () => void
  anchor?: PositionType
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
  // Assuming only timeComparison heatmap is visible, so timerange description apply to all
  const timeCompareTimeDescription = useTimeCompareTimeDescription()

  const fishingInteractionStatus = useSelector(selectFishingInteractionStatus)
  const viirsInteractionStatus = useSelector(selectViirsInteractionStatus)
  const apiEventStatus = useSelector(selectApiEventStatus)

  const popupNeedsLoading = [fishingInteractionStatus, viirsInteractionStatus, apiEventStatus].some(
    (s) => s === AsyncReducerStatus.Loading
  )

  const { setMapCoordinates, viewport } = useViewport()

  // Force-trigger a rerender of the map to avoid popup repositioning flash
  useEffect(() => {
    setMapCoordinates({
      ...viewport,
      latitude: viewport.latitude + 0.00001,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popupNeedsLoading])

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
      closeButton={closeButton && !popupNeedsLoading}
      closeOnClick={closeOnClick}
      onClose={onClose}
      className={cx(styles.popup, styles[type], className)}
      anchor={anchor}
      captureClick
      // dynamicPosition={false}
    >
      {popupNeedsLoading ? (
        <div className={styles.loading}>
          <Spinner size="small" />
        </div>
      ) : (
        <div className={styles.content}>
          {timeCompareTimeDescription && (
            <div className={styles.popupSection}>{timeCompareTimeDescription}</div>
          )}
          {Object.entries(featureByCategory).map(([featureCategory, features]) => {
            switch (featureCategory) {
              case DataviewCategory.Comparison:
                return (
                  <ComparisonRow
                    key={featureCategory}
                    feature={features[0]}
                    showFeaturesDetails={type === 'click'}
                  />
                )
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
                  if (feature.temporalgrid?.sublayerInteractionType === 'viirs-match') {
                    return (
                      <ViirsMatchTooltipRow
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
              case DataviewCategory.Context: {
                const userPointFeatures = features.filter(
                  (feature) => feature.type === GeneratorType.UserPoints
                )
                const userContextFeatures = features.filter(
                  (feature) => feature.type === GeneratorType.UserContext
                )
                const defaultContextFeatures = features.filter(
                  (feature) => feature.type === GeneratorType.Context
                )
                return (
                  <Fragment key={featureCategory}>
                    <UserPointsTooltipSection
                      features={userPointFeatures}
                      showFeaturesDetails={type === 'click'}
                    />
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
              }

              case DataviewCategory.Vessels:
                return <VesselEventsLayers key={featureCategory} features={features} />

              default:
                return null
            }
          })}
        </div>
      )}
    </Popup>
  )
}

export default PopupWrapper
