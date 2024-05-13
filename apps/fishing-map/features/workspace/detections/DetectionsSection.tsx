import { Fragment, useCallback } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Choice, IconButton } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import {
  selectDetectionsDataviews,
  selectActivityDataviews,
} from 'features/dataviews/selectors/dataviews.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useLocationConnect } from 'routes/routes.hook'
import { selectBivariateDataviews, selectReadOnly } from 'features/app/selectors/app.selectors'
import { getActivityFilters, getActivitySources, getEventLabel } from 'utils/analytics'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { setModalOpen } from 'features/modals/modals.slice'
import LayerPanelContainer from '../shared/LayerPanelContainer'
import LayerPanel from '../activity/ActivityLayerPanel'
import activityStyles from '../activity/ActivitySection.module.css'
import { useVisualizationsOptions } from '../activity/activity.hooks'

function DetectionsSection(): React.ReactElement {
  const { t } = useTranslation()
  const readOnly = useSelector(selectReadOnly)
  const dataviews = useSelector(selectDetectionsDataviews)
  const activityDataviews = useSelector(selectActivityDataviews)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { dispatchQueryParams } = useLocationConnect()
  const bivariateDataviews = useSelector(selectBivariateDataviews)
  const { visualizationOptions, activeVisualizationOption, onVisualizationModeChange } =
    useVisualizationsOptions(DataviewCategory.Detections)

  const dispatch = useAppDispatch()
  const onAddLayerClick = useCallback(() => {
    dispatch(setModalOpen({ id: 'layerLibrary', open: DataviewCategory.Detections }))
  }, [dispatch])

  const onBivariateDataviewsClick = useCallback(
    (dataview1: UrlDataviewInstance, dataview2: UrlDataviewInstance) => {
      dispatchQueryParams({ bivariateDataviews: [dataview1.id, dataview2.id] })
      // automatically set other animated heatmaps to invisible
      const detectionsDataviewsToDisable = (dataviews || [])?.filter(
        (dataview) =>
          dataview.id !== dataview1.id &&
          dataview.id !== dataview2.id &&
          dataview.config?.type === DataviewType.HeatmapAnimated
      )
      const dataviewsToDisable = [...detectionsDataviewsToDisable, ...activityDataviews]
      if (dataviewsToDisable.length) {
        upsertDataviewInstance(
          dataviewsToDisable?.map((dataview) => ({
            id: dataview.id,
            config: {
              visible: false,
            },
          }))
        )
      }
      trackEvent({
        category: TrackCategory.ActivityData,
        action: 'Click on bivariate option',
        label: getEventLabel([
          'combine',
          dataview1.name ?? dataview1.id,
          getActivitySources(dataview1),
          ...getActivityFilters(dataview1.config?.filters),
          dataview2.name ?? dataview2.id,
          getActivitySources(dataview2),
          ...getActivityFilters(dataview2.config?.filters),
        ]),
      })
    },
    [activityDataviews, dataviews, dispatchQueryParams, upsertDataviewInstance]
  )

  const onToggleLayer = useCallback(
    (dataview: UrlDataviewInstance) => () => {
      const isVisible = dataview?.config?.visible ?? false
      const action = isVisible ? 'disable' : 'enable'
      trackEvent({
        category: TrackCategory.ActivityData,
        action: `Toggle ${dataview.category} layer`,
        label: getEventLabel([
          action,
          getActivitySources(dataview),
          ...getActivityFilters(dataview.config?.filters),
        ]),
      })
    },
    []
  )
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)

  return (
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={styles.header}>
        <h2 className={cx('print-hidden', styles.sectionTitle)}>
          {t('common.detections', 'Detections')}
        </h2>
        {!readOnly && (
          <div className={cx('print-hidden', styles.sectionButtons)}>
            <Choice
              options={visualizationOptions}
              size="small"
              testId="detections-visualizations-change"
              activeOption={activeVisualizationOption}
              onSelect={(option) => onVisualizationModeChange(option.id)}
            />
            <IconButton
              icon="plus"
              type="border"
              size="medium"
              tooltip={t('layer.add', 'Add layer')}
              tooltipPlacement="top"
              onClick={() => onAddLayerClick()}
            />
          </div>
        )}
      </div>
      {dataviews?.map((dataview, index) => {
        const isLastElement = index === dataviews?.length - 1
        const isVisible = dataview?.config?.visible ?? false
        const isNextVisible = dataviews[index + 1]?.config?.visible ?? false
        const showBivariateIcon =
          bivariateDataviews === undefined && isVisible && isNextVisible && !isLastElement
        return (
          <Fragment key={dataview.id}>
            <LayerPanelContainer key={dataview.id} dataview={dataview}>
              <LayerPanel
                dataview={dataview}
                showBorder={!showBivariateIcon}
                isOpen={false}
                onToggle={onToggleLayer(dataview)}
              />
            </LayerPanelContainer>
            {showBivariateIcon && (
              <div className={cx(activityStyles.bivariateToggleContainer, 'print-hidden')}>
                <IconButton
                  icon={bivariateDataviews ? 'split' : 'compare'}
                  type="border"
                  size="small"
                  className={activityStyles.bivariateToggle}
                  tooltip={t('layer.toggleCombinationMode.combine', 'Combine layers')}
                  tooltipPlacement="top"
                  onClick={() => onBivariateDataviewsClick(dataview, dataviews[index + 1])}
                />
              </div>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

export default DetectionsSection
