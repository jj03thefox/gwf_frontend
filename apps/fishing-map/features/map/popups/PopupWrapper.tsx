import { Fragment } from 'react'
import cx from 'classnames'
import { groupBy } from 'lodash'
import { Popup } from 'react-map-gl'
import type { Anchor } from 'react-map-gl'
import { useSelector } from 'react-redux'
import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import { IconButton, Spinner } from '@globalfishingwatch/ui-components'
import { InteractionEvent } from '@globalfishingwatch/deck-layer-composer'
import { ContextFeature, FourwingsPickingObject } from '@globalfishingwatch/deck-layers'
import { TooltipEvent } from 'features/map/map.hooks'
import { POPUP_CATEGORY_ORDER } from 'data/config'
import { useTimeCompareTimeDescription } from 'features/reports/reports-timecomparison.hooks'
import DetectionsTooltipRow from 'features/map/popups/DetectionsLayers'
import UserPointsTooltipSection from 'features/map/popups/UserPointsLayers'
import { AsyncReducerStatus } from 'utils/async-slice'
import { WORKSPACE_GENERATOR_ID, REPORT_BUFFER_GENERATOR_ID } from 'features/map/map.config'
import WorkspacePointsTooltipSection from 'features/map/popups/WorkspacePointsLayers'
import AnnotationTooltip from 'features/map/popups/AnnotationTooltip'
import RulerTooltip from 'features/map/popups/RulerTooltip'
import { useDeckMap } from 'features/map/map-context.hooks'
import { useMapViewport } from 'features/map/map-viewport.hooks'
import {
  SliceExtendedFourwingsFeature,
  selectApiEventStatus,
  selectFishingInteractionStatus,
} from '../map.slice'
import styles from './Popup.module.css'
import ActivityTooltipRow from './ActivityLayers'
import EncounterTooltipRow from './EncounterTooltipRow'
import EnvironmentTooltipSection from './EnvironmentLayers'
import ContextTooltipSection from './ContextLayers'
import UserContextTooltipSection from './UserContextLayers'
import VesselEventsLayers from './VesselEventsLayers'
import ComparisonRow from './ComparisonRow'
import ReportBufferTooltip from './ReportBufferLayers'

type PopupWrapperProps = {
  interaction: InteractionEvent | null
  closeButton?: boolean
  closeOnClick?: boolean
  className?: string
  onClose?: () => void
  anchor?: Anchor
  type?: 'hover' | 'click'
}
function PopupWrapper({
  interaction,
  closeButton = false,
  closeOnClick = false,
  type = 'hover',
  className = '',
  onClose,
  anchor,
}: PopupWrapperProps) {
  // Assuming only timeComparison heatmap is visible, so timerange description apply to all
  const timeCompareTimeDescription = useTimeCompareTimeDescription()
  const mapViewport = useMapViewport()

  const activityInteractionStatus = useSelector(selectFishingInteractionStatus)
  const apiEventStatus = useSelector(selectApiEventStatus)

  // const popupNeedsLoading = [fishingInteractionStatus, apiEventStatus].some(
  //   (s) => s === AsyncReducerStatus.Loading
  // )

  if (!mapViewport || !interaction || !interaction.features) return null

  // const visibleFeatures = interaction.features.filter(
  //   (feature) => feature.visible || feature.source === WORKSPACE_GENERATOR_ID
  // )

  const featureByCategory = groupBy(
    interaction.features
      // Needed to create a new array and not muting with sort
      .map((feature) => feature)
      .sort(
        (a, b) =>
          POPUP_CATEGORY_ORDER.indexOf(a?.category as DataviewCategory) -
          POPUP_CATEGORY_ORDER.indexOf(b?.category as DataviewCategory)
      ),
    'category'
  )

  const [left, top] = mapViewport.project([interaction.longitude, interaction.latitude])
  return (
    <div
      style={{ position: 'absolute', top, left, maxWidth: '600px' }}
      className={cx(styles.popup, styles[type], className)}
    >
      <div>
        {/* <div>
            <IconButton icon="close" onClick={onClose} />
          </div> */}
        <div className={styles.content}>
          {timeCompareTimeDescription && (
            <div className={styles.popupSection}>{timeCompareTimeDescription}</div>
          )}
          {Object.entries(featureByCategory)?.map(([featureCategory, features]) => {
            switch (featureCategory) {
              // TODO: deck restore this popup
              // case DataviewCategory.Comparison:
              //   return (
              //     <ComparisonRow
              //       key={featureCategory}
              //       feature={features[0]}
              //       showFeaturesDetails={type === 'click'}
              //     />
              //   )
              case DataviewCategory.Activity: {
                return (features as SliceExtendedFourwingsFeature[])?.map((feature, i) => {
                  return feature.sublayers.map((sublayer, j) => (
                    <ActivityTooltipRow
                      key={`${i}-${j}`}
                      loading={activityInteractionStatus === AsyncReducerStatus.Loading}
                      feature={{ ...sublayer, category: feature.category as DataviewCategory }}
                      showFeaturesDetails={type === 'click'}
                    />
                  ))
                })
              }
              case DataviewCategory.Detections: {
                return (features as FourwingsPickingObject[])?.map((feature, i) => {
                  return feature.sublayers.map((sublayer, j) => (
                    <DetectionsTooltipRow
                      key={`${i}-${j}`}
                      loading={activityInteractionStatus === AsyncReducerStatus.Loading}
                      feature={{ ...sublayer, category: feature.category as DataviewCategory }}
                      showFeaturesDetails={type === 'click'}
                    />
                  ))
                })
              }
              case DataviewCategory.Events: {
                if (apiEventStatus === AsyncReducerStatus.Loading) {
                  return (
                    <div className={styles.loading}>
                      <Spinner size="small" />
                    </div>
                  )
                }
                return (
                  <EncounterTooltipRow
                    key={featureCategory}
                    features={features}
                    showFeaturesDetails={type === 'click'}
                  />
                )
              }
              // TODO: deck restore this popup
              // case DataviewCategory.Environment: {
              //   const contextEnvironmentalFeatures = features.filter(
              //     (feature) =>
              //       feature.type === DataviewType.Context ||
              //       feature.type === DataviewType.UserContext
              //   )
              //   const environmentalFeatures = features.filter(
              //     (feature) =>
              //       feature.type !== DataviewType.Context &&
              //       feature.type !== DataviewType.UserContext
              //   )
              //   return (
              //     <Fragment key={featureCategory}>
              //       <ContextTooltipSection
              //         features={contextEnvironmentalFeatures}
              //         showFeaturesDetails={type === 'click'}
              //       />
              //       <EnvironmentTooltipSection
              //         features={environmentalFeatures}
              //         showFeaturesDetails={type === 'click'}
              //       />
              //     </Fragment>
              //   )
              // }
              case DataviewCategory.Context: {
                // const defaultContextFeatures = features.filter(
                //   (feature) => feature.type === DataviewType.Context
                // )
                // const workspacePointsFeatures = features.filter(
                //   (feature) => feature.source === WORKSPACE_GENERATOR_ID
                // )
                // const areaBufferFeatures = features.filter(
                //   (feature) => feature.source === REPORT_BUFFER_GENERATOR_ID
                // )
                // const annotationFeatures = features.filter(
                //   (feature) => feature.type === DataviewType.Annotation
                // )
                // const rulersFeatures = features.filter(
                //   (feature) => feature.type === DataviewType.Rulers
                // )
                // const userPointFeatures = features.filter(
                //   (feature) => feature.type === DataviewType.UserPoints
                // )
                return (
                  <Fragment key={featureCategory}>
                    {/*
                      // TODO: deck restore this popup
                      <AnnotationTooltip features={annotationFeatures} />
                      <RulerTooltip
                        features={rulersFeatures}
                        showFeaturesDetails={type === 'click'}
                      />
                      <WorkspacePointsTooltipSection features={workspacePointsFeatures} />
                      <ReportBufferTooltip features={areaBufferFeatures} />
                      <UserPointsTooltipSection
                        features={userPointFeatures}
                        showFeaturesDetails={type === 'click'}
                      /> */}
                    <ContextTooltipSection
                      features={features as ContextFeature[]}
                      showFeaturesDetails={type === 'click'}
                    />
                  </Fragment>
                )
              }
              // TODO: deck restore this popup
              // case DataviewCategory.User: {
              //   const userPointFeatures = features.filter(
              //     (feature) => feature.type === DataviewType.UserPoints
              //   )
              //   const userContextFeatures = features.filter(
              //     (feature) => feature.type === DataviewType.UserContext
              //   )
              //   return (
              //     <Fragment key={featureCategory}>
              //       <UserPointsTooltipSection
              //         features={userPointFeatures}
              //         showFeaturesDetails={type === 'click'}
              //       />
              //       <UserContextTooltipSection
              //         features={userContextFeatures}
              //         showFeaturesDetails={type === 'click'}
              //       />
              //     </Fragment>
              //   )
              // }

              // case DataviewCategory.Vessels:
              //   return (
              //     <VesselEventsLayers
              //       key={featureCategory}
              //       features={features}
              //       showFeaturesDetails={type === 'click'}
              //     />
              //   )

              default:
                return null
            }
          })}
        </div>
      </div>
    </div>
  )
}

export default PopupWrapper
