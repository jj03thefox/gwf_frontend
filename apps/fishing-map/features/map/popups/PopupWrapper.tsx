import { Fragment, forwardRef, useRef } from 'react'
import cx from 'classnames'
import { groupBy } from 'lodash'
import { useSelector } from 'react-redux'
import {
  autoPlacement,
  autoUpdate,
  useFloating,
  detectOverflow,
  Middleware,
  arrow,
} from '@floating-ui/react'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { IconButton, Spinner } from '@globalfishingwatch/ui-components'
import { InteractionEvent } from '@globalfishingwatch/deck-layer-composer'
import { ContextPickingObject, VesselEventPickingObject } from '@globalfishingwatch/deck-layers'
import { POPUP_CATEGORY_ORDER } from 'data/config'
import { useTimeCompareTimeDescription } from 'features/reports/reports-timecomparison.hooks'
import DetectionsTooltipRow from 'features/map/popups/DetectionsLayers'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useMapViewport } from 'features/map/map-viewport.hooks'
import {
  SliceExtendedFourwingsPickingObject,
  selectApiEventStatus,
  selectFishingInteractionStatus,
} from '../map.slice'
import { MAP_WRAPPER_ID } from '../map.config'
import styles from './Popup.module.css'
import ActivityTooltipRow from './ActivityLayers'
import EncounterTooltipRow from './EncounterTooltipRow'
import ContextTooltipSection from './ContextLayers'
import VesselEventsLayers from './VesselEventsLayers'

const overflowMiddlware: Middleware = {
  name: 'overflow',
  async fn(state) {
    if (!state) {
      return {}
    }
    const overflow = await detectOverflow(state, {
      boundary: document.getElementById(MAP_WRAPPER_ID),
    })
    Object.entries(overflow).forEach(([key, value]) => {
      if (value > 0) {
        const property = key === 'top' || key === 'bottom' ? 'y' : 'x'
        state[property] =
          key === 'bottom' || key === 'right' ? state[property] - value : state[property] + value
      }
    })
    return state
  },
}

type PopupWrapperProps = {
  interaction: InteractionEvent | null
  closeButton?: boolean
  closeOnClick?: boolean
  className?: string
  onClose?: () => void
  type?: 'hover' | 'click'
}

const PopupArrow = forwardRef(function (
  {
    arrow = {},
    placement,
  }: {
    arrow?: { x?: number; y?: number }
    placement: string
  },
  ref: any
) {
  const { x, y } = arrow
  const side = placement.split('-')[0]
  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[side] as string
  const arrowLen = ref?.current?.clientWidth || 0
  return (
    <div
      className={styles.arrow}
      ref={ref}
      style={{
        left: x != null ? `${x}px` : '',
        top: y != null ? `${y}px` : '',
        // Ensure the static side gets unset when
        // flipping to other placements' axes.
        right: '',
        bottom: '',
        [staticSide]: `${-arrowLen / 2}px`,
      }}
    />
  )
})

function PopupWrapper({ interaction, type = 'hover', className = '', onClose }: PopupWrapperProps) {
  // Assuming only timeComparison heatmap is visible, so timerange description apply to all
  const timeCompareTimeDescription = useTimeCompareTimeDescription()
  const mapViewport = useMapViewport()

  const activityInteractionStatus = useSelector(selectFishingInteractionStatus)
  const apiEventStatus = useSelector(selectApiEventStatus)

  const arrowRef = useRef<HTMLDivElement>(null)
  const { refs, floatingStyles, placement, middlewareData /*, update, elements */ } = useFloating({
    whileElementsMounted: autoUpdate,
    middleware: [
      autoPlacement({ padding: 10 }),
      overflowMiddlware,
      arrow({
        element: arrowRef,
        padding: -5,
      }),
    ],
  })

  if (!mapViewport || !interaction || !interaction.features?.length) return null

  // const visibleFeatures = interaction.features.filter(
  //   (feature) => feature.visible || feature.source === WORKSPACE_GENERATOR_ID
  // )

  const [left, top] = mapViewport.project([interaction.longitude, interaction.latitude])

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

  // useEffect(() => {
  //   if (elements.reference && elements.floating) {
  //     const cleanup = autoUpdate(elements.reference, elements.floating, update)
  //     return cleanup
  //   }

  return (
    <div
      ref={refs.setReference}
      style={{ position: 'absolute', top, left }}
      className={cx(styles.popup, styles[type], className)}
    >
      <div ref={refs.setFloating} style={floatingStyles}>
        {type === 'click' && (
          <PopupArrow ref={arrowRef} placement={placement} arrow={middlewareData.arrow} />
        )}
        {type === 'click' && onClose !== undefined && (
          <div className={styles.close}>
            <IconButton type="invert" size="small" icon="close" onClick={onClose} />
          </div>
        )}
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
                return (features as SliceExtendedFourwingsPickingObject[])?.map((feature, i) => {
                  return feature.sublayers.map((sublayer, j) => (
                    <ActivityTooltipRow
                      key={`${i}-${j}`}
                      loading={activityInteractionStatus === AsyncReducerStatus.Loading}
                      feature={{
                        ...sublayer,
                        category: feature.category as DataviewCategory,
                        title: feature.title,
                      }}
                      showFeaturesDetails={type === 'click'}
                    />
                  ))
                })
              }
              case DataviewCategory.Detections: {
                return (features as SliceExtendedFourwingsPickingObject[])?.map((feature, i) => {
                  return feature.sublayers.map((sublayer, j) => (
                    <DetectionsTooltipRow
                      key={`${i}-${j}`}
                      loading={activityInteractionStatus === AsyncReducerStatus.Loading}
                      feature={{
                        ...sublayer,
                        category: feature.category as DataviewCategory,
                        title: feature.title,
                      }}
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
                    // TODO:deck review typings here
                    features={features as any}
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
                      features={features as ContextPickingObject[]}
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

              case DataviewCategory.Vessels:
                return (
                  <VesselEventsLayers
                    key={featureCategory}
                    features={features as VesselEventPickingObject[]}
                    showFeaturesDetails={type === 'click'}
                  />
                )

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
