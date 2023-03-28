import { useState, useCallback, Fragment, useEffect, useMemo } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import parse from 'html-react-parser'
import { uniqBy } from 'lodash'
import { DatasetTypes, DatasetStatus, DatasetCategory } from '@globalfishingwatch/api-types'
import { Tooltip, ColorBarOption, Modal, IconButton } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { DEFAULT_CONTEXT_SOURCE_LAYER, GeneratorType } from '@globalfishingwatch/layer-composer'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { selectViewport } from 'features/app/app.selectors'
import { selectUserId } from 'features/user/user.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useAddDataset, useAutoRefreshImportingDataset } from 'features/datasets/datasets.hook'
import { isGFWUser, isGuestUser } from 'features/user/user.slice'
import DatasetLoginRequired from 'features/workspace/shared/DatasetLoginRequired'
import { useLayerPanelDataviewSort } from 'features/workspace/shared/layer-panel-sort.hook'
import GFWOnly from 'features/user/GFWOnly'
import { PRIVATE_SUFIX, ROOT_DOM_ELEMENT } from 'data/config'
import { ONLY_GFW_STAFF_DATAVIEW_SLUGS } from 'data/workspaces'
import { selectBasemapLabelsDataviewInstance } from 'features/dataviews/dataviews.selectors'
import { useMapDataviewFeatures } from 'features/map/map-sources.hooks'
import {
  CONTEXT_FEATURES_LIMIT,
  filterFeaturesByDistance,
  parseContextFeatures,
} from 'features/workspace/context-areas/context.utils'
import { ReportPopupLink } from 'features/map/popups/ContextLayersRow'
import useMapInstance from 'features/map/map-context.hooks'
import DatasetNotFound from '../shared/DatasetNotFound'
import Color from '../common/Color'
import LayerSwitch from '../common/LayerSwitch'
import Remove from '../common/Remove'
import Title from '../common/Title'
import Filters from '../activity/ActivityFilters'
import InfoModal from '../common/InfoModal'
import ExpandedContainer from '../shared/ExpandedContainer'
import DatasetSchemaField from '../shared/DatasetSchemaField'
import { getDatasetLabel, getSchemaFiltersInDataview } from '../../datasets/datasets.utils'
import { showSchemaFilter } from '../activity/ActivitySchemaFilter'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
  onToggle?: () => void
}

const DATAVIEWS_WARNING = ['context-layer-eez', 'context-layer-mpa', 'basemap-labels']
const LIST_ELEMENT_HEIGHT = 30
const LIST_ELLIPSIS_HEIGHT = 14
const LIST_MARGIN_HEIGHT = 10
const LIST_TITLE_HEIGHT = 22

function LayerPanel({ dataview, onToggle }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const [filterOpen, setFiltersOpen] = useState(false)
  const [featuresOnScreen, setFeaturesOnScreen] = useState({ total: 0, closest: [] })
  const [colorOpen, setColorOpen] = useState(false)
  const gfwUser = useSelector(isGFWUser)
  const userId = useSelector(selectUserId)
  const [modalDataWarningOpen, setModalDataWarningOpen] = useState(false)
  const onDataWarningModalClose = useCallback(() => {
    setModalDataWarningOpen(false)
  }, [setModalDataWarningOpen])
  const guestUser = useSelector(isGuestUser)
  const viewport = useSelector(selectViewport)
  const onAddNewClick = useAddDataset({ datasetCategory: DatasetCategory.Context })
  const layerActive = dataview?.config?.visible ?? true
  const dataset = dataview.datasets?.find(
    (d) => d.type === DatasetTypes.Context || d.type === DatasetTypes.UserContext
  )

  const { cleanFeatureState, updateFeatureState } = useFeatureState(useMapInstance())
  const dataviewFeaturesParams = useMemo(() => {
    return {
      queryMethod: 'render' as const,
      queryCacheKey: [viewport.latitude, viewport.longitude, viewport.zoom]
        .map((v) => v.toFixed(3))
        .join('-'),
    }
  }, [viewport])

  const layerFeatures = useMapDataviewFeatures(
    layerActive ? dataview : [],
    dataviewFeaturesParams
  )?.[0]
  const uniqKey = dataset?.configuration?.idProperty
    ? `properties.${dataset?.configuration?.idProperty}`
    : 'id'

  useEffect(() => {
    if (layerActive && layerFeatures?.features) {
      const uniqLayerFeatures = uniqBy(layerFeatures?.features, uniqKey)
      const filteredFeatures = filterFeaturesByDistance(uniqLayerFeatures, {
        viewport,
        uniqKey,
      })
      setFeaturesOnScreen({
        total: uniqLayerFeatures.length,
        closest: parseContextFeatures(filteredFeatures, dataset),
      })
    }
  }, [dataset, layerActive, layerFeatures?.features, uniqKey, viewport])

  const listHeight = Math.min(featuresOnScreen?.total, CONTEXT_FEATURES_LIMIT) * LIST_ELEMENT_HEIGHT
  const ellispsisHeight =
    featuresOnScreen?.total > CONTEXT_FEATURES_LIMIT ? LIST_ELLIPSIS_HEIGHT : 0
  const closestAreasHeight = featuresOnScreen?.total
    ? listHeight + ellispsisHeight + LIST_TITLE_HEIGHT + LIST_MARGIN_HEIGHT
    : 0

  const {
    items,
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    style,
    isSorting,
    activeIndex,
  } = useLayerPanelDataviewSort(dataview.id)

  const changeColor = (color: ColorBarOption) => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        color: color.value,
        colorRamp: color.id,
      },
    })
    setColorOpen(false)
  }
  const onToggleColorOpen = () => {
    setColorOpen(!colorOpen)
  }

  const onToggleFilterOpen = () => {
    setFiltersOpen(!filterOpen)
  }

  const closeExpandedContainer = () => {
    setFiltersOpen(false)
    setColorOpen(false)
  }

  const isUserLayer = !guestUser && dataset?.ownerId === userId

  useAutoRefreshImportingDataset(dataset, 5000)

  const basemapLabelsDataviewInstance = useSelector(selectBasemapLabelsDataviewInstance)
  if (!dataset && dataview.id !== basemapLabelsDataviewInstance.id) {
    const dataviewHasPrivateDataset = dataview.datasetsConfig?.some((d) =>
      d.datasetId.includes(PRIVATE_SUFIX)
    )
    return guestUser && dataviewHasPrivateDataset ? (
      <DatasetLoginRequired dataview={dataview} />
    ) : (
      <DatasetNotFound dataview={dataview} />
    )
  }

  const title = dataset
    ? getDatasetLabel(dataset)
    : t(`dataview.${dataview?.id}.title` as any, dataview?.name || dataview?.id)

  const TitleComponent = (
    <Title
      title={title}
      className={styles.name}
      classNameActive={styles.active}
      dataview={dataview}
      onToggle={onToggle}
    />
  )

  const isBasemapLabelsDataview = dataview.config?.type === GeneratorType.BasemapLabels
  const schemaFilters = getSchemaFiltersInDataview(dataview)
  const hasSchemaFilters = schemaFilters.some(showSchemaFilter)
  const hasSchemaFilterSelection = schemaFilters.some(
    (schema) => schema.optionsSelected?.length > 0
  )

  const handleHoverArea = (feature) => {
    const { source, id } = feature
    if (source && id) {
      const featureState = {
        source,
        sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER,
        id,
      }
      updateFeatureState([featureState], 'highlight')
    }
  }

  return (
    <div
      className={cx(styles.LayerPanel, {
        [styles.expandedContainerOpen]: filterOpen || colorOpen,
        'print-hidden': !layerActive,
      })}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className={styles.header}>
        <LayerSwitch
          disabled={dataset?.status === DatasetStatus.Error}
          active={layerActive}
          className={styles.switch}
          dataview={dataview}
          onToggle={onToggle}
        />
        {ONLY_GFW_STAFF_DATAVIEW_SLUGS.includes(dataview.dataviewId as number) && (
          <GFWOnly type="only-icon" style={{ transform: 'none' }} className={styles.gfwIcon} />
        )}
        {title && title.length > 30 ? (
          <Tooltip content={title}>{TitleComponent}</Tooltip>
        ) : (
          TitleComponent
        )}
        <div className={cx('print-hidden', styles.actions, { [styles.active]: layerActive })}>
          {layerActive && !isBasemapLabelsDataview && (
            <Color
              dataview={dataview}
              open={colorOpen}
              onColorClick={changeColor}
              onToggleClick={onToggleColorOpen}
              onClickOutside={closeExpandedContainer}
            />
          )}
          {layerActive && hasSchemaFilters && (
            <ExpandedContainer
              visible={filterOpen}
              onClickOutside={closeExpandedContainer}
              component={<Filters dataview={dataview} />}
            >
              <div className={styles.filterButtonWrapper}>
                <IconButton
                  icon={filterOpen ? 'filter-on' : 'filter-off'}
                  size="small"
                  onClick={onToggleFilterOpen}
                  tooltip={
                    filterOpen
                      ? t('layer.filterClose', 'Close filters')
                      : t('layer.filterOpen', 'Open filters')
                  }
                  tooltipPlacement="top"
                />
              </div>
            </ExpandedContainer>
          )}
          {!isBasemapLabelsDataview && <InfoModal dataview={dataview} />}
          {(isUserLayer || gfwUser) && <Remove dataview={dataview} />}
          {items.length > 1 && (
            <IconButton
              size="small"
              ref={setActivatorNodeRef}
              {...listeners}
              icon="drag"
              className={styles.dragger}
            />
          )}
        </div>
      </div>
      {layerActive && (DATAVIEWS_WARNING.includes(dataview?.id) || hasSchemaFilterSelection) && (
        <div
          className={cx(styles.properties, styles.dataWarning, styles.drag, {
            [styles.dragging]: isSorting && activeIndex > -1,
          })}
        >
          {DATAVIEWS_WARNING.includes(dataview?.id) && (
            <Fragment>
              <div>
                {t(
                  `dataview.${dataview?.id}.dataWarning` as any,
                  'This platform uses a reference layer from an external source.'
                )}
              </div>
              <div className={cx('print-hidden', styles.dataWarningLinks)}>
                <button onClick={onAddNewClick}>
                  {t('dataset.uploadYourOwn', 'Upload your own')}
                </button>{' '}
                |{' '}
                <button onClick={() => setModalDataWarningOpen(!modalDataWarningOpen)}>
                  {t('common.learnMore', 'Learn more')}
                </button>
                <Modal
                  appSelector={ROOT_DOM_ELEMENT}
                  title={title}
                  isOpen={modalDataWarningOpen}
                  onClose={onDataWarningModalClose}
                  contentClassName={styles.modalContent}
                >
                  {parse(
                    t(
                      `dataview.${dataview?.id}.dataWarningDetail` as any,
                      'This platform uses reference layers (shapefiles) from an external source. The designations employed and the presentation of the material on this platform do not imply the expression of any opinion whatsoever on the part of Global Fishing Watch concerning the legal status of any country, territory, city or area or of its authorities, or concerning the delimitation of its frontiers or boundaries. Should you consider these reference layers not applicable for your purposes, this platform allows custom reference layers to be uploaded. Draw or upload your own reference layer using the "+" icon in the left sidebar. Learn more on our <a href="https://globalfishingwatch.org/tutorials/">tutorials</a> and <a href="https://globalfishingwatch.org/help-faqs/">FAQs</a>.'
                    )
                  )}
                </Modal>
              </div>
            </Fragment>
          )}
          {hasSchemaFilterSelection && (
            <div className={styles.filters}>
              <div className={styles.filters}>
                {schemaFilters.map(({ id, label }) => (
                  <DatasetSchemaField key={id} dataview={dataview} field={id} label={label} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {layerActive && (
        <div
          className={cx(styles.closestAreas, { [styles.properties]: featuresOnScreen?.total > 0 })}
          style={{ height: closestAreasHeight }}
        >
          {featuresOnScreen?.total > 0 && (
            <Fragment>
              <label>
                {t('layer.areasOnScreen', 'Areas on screen')} ({featuresOnScreen?.total})
              </label>
              <ul>
                {featuresOnScreen.closest.map((feature) => {
                  const id = feature?.properties?.[uniqKey] || feature?.properties.id || feature?.id
                  let title =
                    feature.properties.value || feature.properties.name || feature.properties.id
                  if (dataset.configuration?.valueProperties?.length) {
                    title = dataset.configuration.valueProperties
                      .flatMap((prop) => feature.properties[prop] || [])
                      .join(', ')
                  }
                  return (
                    <li
                      key={`${id}-${title}`}
                      className={styles.area}
                      onMouseEnter={() => handleHoverArea(feature)}
                      onMouseLeave={() => cleanFeatureState('highlight')}
                    >
                      <span
                        title={title.length > 40 ? title : undefined}
                        className={styles.areaTitle}
                      >
                        {title}
                      </span>
                      <ReportPopupLink feature={feature}></ReportPopupLink>
                    </li>
                  )
                })}
                {featuresOnScreen?.total > CONTEXT_FEATURES_LIMIT && (
                  <li className={cx(styles.area, styles.ellipsis)}>...</li>
                )}
              </ul>
            </Fragment>
          )}
        </div>
      )}
    </div>
  )
}

export default LayerPanel
