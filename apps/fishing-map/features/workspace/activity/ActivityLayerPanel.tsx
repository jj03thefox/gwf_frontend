import React, { Fragment, useMemo, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { event as uaEvent } from 'react-ga'
import { DEFAULT_STATS_FIELDS, useGetStatsByDataviewQuery } from 'queries/stats-api'
import { IconButton, Tooltip } from '@globalfishingwatch/ui-components'
import {
  getDatasetConfigByDatasetType,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectBivariateDataviews, selectReadOnly } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import ExpandedContainer from 'features/workspace/shared/ExpandedContainer'
import { getActivityFilters, getActivitySources, getEventLabel } from 'utils/analytics'
import { getDatasetTitleByDataview, SupportedDatasetSchema } from 'features/datasets/datasets.utils'
import Hint from 'features/help/hints/Hint'
import { setHintDismissed } from 'features/help/hints/hints.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import I18nNumber from 'features/i18n/i18nNumber'
import { isGuestUser } from 'features/user/user.slice'
import { selectUrlTimeRange } from 'routes/routes.selectors'
import ActivityAuxiliaryLayerPanel from 'features/workspace/activity/ActivityAuxiliaryLayer'
import { SAR_DATAVIEW_ID } from 'data/workspaces'
import DatasetNotFound from 'features/workspace/shared/DatasetNotFound'
import DatasetFilterSource from '../shared/DatasetSourceField'
import DatasetFlagField from '../shared/DatasetFlagsField'
import DatasetSchemaField from '../shared/DatasetSchemaField'
import LayerSwitch from '../common/LayerSwitch'
import Remove from '../common/Remove'
import Title from '../common/Title'
import InfoModal from '../common/InfoModal'
import Filters from './ActivityFilters'
import { isFishingDataview, isPresenceDataview } from './activity.utils'
import activityStyles from './ActivitySection.module.css'

type LayerPanelProps = {
  isOpen: boolean
  showBorder: boolean
  dataview: UrlDataviewInstance
  onToggle?: () => void
}

function ActivityLayerPanel({
  dataview,
  showBorder,
  isOpen,
  onToggle,
}: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [filterOpen, setFiltersOpen] = useState(isOpen === undefined ? false : isOpen)

  const { deleteDataviewInstance } = useDataviewInstancesConnect()
  const { dispatchQueryParams } = useLocationConnect()
  const urlTimeRange = useSelector(selectUrlTimeRange)
  const bivariateDataviews = useSelector(selectBivariateDataviews)
  const guestUser = useSelector(isGuestUser)
  const readOnly = useSelector(selectReadOnly)
  const layerActive = dataview?.config?.visible ?? true
  const datasetStatsFields = dataview.datasets.flatMap((d) =>
    Object.entries(d.schema).flatMap(([id, schema]) => (schema.stats ? id : []))
  )

  const fields = datasetStatsFields?.length > 0 ? datasetStatsFields : DEFAULT_STATS_FIELDS
  const { data: stats, isFetching } = useGetStatsByDataviewQuery(
    {
      dataview,
      timerange: urlTimeRange,
      fields,
    },
    {
      skip: guestUser || !urlTimeRange || !layerActive,
    }
  )

  const disableBivariate = () => {
    dispatchQueryParams({ bivariateDataviews: undefined })
  }

  const onSplitLayers = () => {
    disableBivariate()

    uaEvent({
      category: 'Activity data',
      action: 'Click on bivariate option',
      label: getEventLabel([
        'split',
        dataview.name ?? dataview.id ?? bivariateDataviews[0],
        getActivitySources(dataview),
        ...getActivityFilters(dataview.config?.filters),
        bivariateDataviews[1],
      ]),
    })
  }

  const onLayerSwitchToggle = () => {
    if (onToggle) {
      onToggle()
    }
    disableBivariate()
  }

  const onRemoveLayerClick = () => {
    if (bivariateDataviews && bivariateDataviews.includes(dataview.id)) {
      disableBivariate()
    }
    deleteDataviewInstance(dataview.id)
  }

  const onToggleFilterOpen = () => {
    setFiltersOpen(!filterOpen)
    dispatch(setHintDismissed('filterActivityLayers'))
  }

  const closeExpandedContainer = () => {
    setFiltersOpen(false)
  }

  const datasetTitle = getDatasetTitleByDataview(dataview)
  const hasDatasetAvailable =
    getDatasetConfigByDatasetType(dataview, DatasetTypes.Fourwings) !== undefined

  const fishingDataview = isFishingDataview(dataview)
  const presenceDataview = isPresenceDataview(dataview)
  const TitleComponent = (
    <Title
      title={datasetTitle}
      className={styles.name}
      classNameActive={styles.active}
      dataview={dataview}
      onToggle={onToggle}
    />
  )

  const datasetFields: { field: SupportedDatasetSchema; label: string }[] = useMemo(
    () => [
      { field: 'radiance', label: t('layer.radiance', 'Radiance') },
      { field: 'geartype', label: t('layer.gearType_other', 'Gear types') },
      { field: 'fleet', label: t('layer.fleet_other', 'Fleets') },
      { field: 'shiptype', label: t('vessel.shiptype', 'Ship type') },
      { field: 'origin', label: t('vessel.origin', 'Origin') },
      { field: 'matched', label: t('vessel.matched', 'Matched') },
      { field: 'source', label: t('vessel.source', 'Source') },
      { field: 'target_species', label: t('vessel.target_species', 'Target species') },
      { field: 'license_category', label: t('vessel.license_category', 'License category') },
      { field: 'vessel_type', label: t('vessel.vesselType_other', 'Vessel types') },
    ],
    [t]
  )

  const statsValue = stats && (stats.vessel_id || stats.id)
  const showStats = statsValue > 0

  return (
    <div
      className={cx(styles.LayerPanel, activityStyles.layerPanel, {
        [styles.expandedContainerOpen]: filterOpen,
        [styles.noBorder]: !showBorder || bivariateDataviews?.[0] === dataview.id,
        'print-hidden': !layerActive,
      })}
    >
      {hasDatasetAvailable ? (
        <Fragment>
          <div className={styles.header}>
            <LayerSwitch
              onToggle={onLayerSwitchToggle}
              active={layerActive}
              className={styles.switch}
              dataview={dataview}
            />
            {datasetTitle.length > 24 ? (
              <Tooltip content={datasetTitle}>{TitleComponent}</Tooltip>
            ) : (
              TitleComponent
            )}
            <div className={cx('print-hidden', styles.actions, { [styles.active]: layerActive })}>
              {layerActive && (fishingDataview || presenceDataview) && (
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
                    {dataview.id === 'fishing-ais' && (
                      <Hint id="filterActivityLayers" className={styles.helpHint} />
                    )}
                  </div>
                </ExpandedContainer>
              )}
              <InfoModal
                dataview={dataview}
                // Workaround to always show the auxiliar dataset too
                showAllDatasets={dataview.dataviewId === SAR_DATAVIEW_ID}
              />
              {!readOnly && <Remove onClick={onRemoveLayerClick} />}
            </div>
          </div>
          {layerActive && (
            <div className={styles.properties}>
              {stats && (
                <div
                  className={cx(activityStyles.stats, {
                    [activityStyles.statsLoading]: isFetching,
                  })}
                >
                  {showStats ? (
                    <Tooltip
                      // placement="bottom"
                      content={
                        stats.type === 'vessels'
                          ? t(
                              'layer.statsHelp',
                              'The number of vessels and flag states is calculated for your current filters and time range globally. Some double counting may occur.'
                            )
                          : t(
                              'layer.statsHelpDetection',
                              'The number of detections is calculated for your current filters and time range globally. Some double counting may occur.'
                            )
                      }
                    >
                      <div className={activityStyles.help}>
                        {statsValue > 0 && (
                          <span>
                            <I18nNumber number={statsValue} />{' '}
                            {stats.type === 'vessels'
                              ? t('common.vessel', {
                                  count: statsValue,
                                  defaultValue: 'vessels',
                                }).toLocaleLowerCase()
                              : t('common.detection', {
                                  count: statsValue,
                                  defaultValue: 'detections',
                                }).toLocaleLowerCase()}
                          </span>
                        )}
                        {stats.type === 'vessels' &&
                          stats.flag > 0 &&
                          !dataview.config?.filters?.flag && (
                            <Fragment>
                              <span> {t('common.from', 'from')} </span>
                              <span>
                                <I18nNumber number={stats.flag} />{' '}
                                {t('layer.flagState', {
                                  count: stats.flag,
                                  defaultValue: 'flag states',
                                }).toLocaleLowerCase()}
                              </span>
                            </Fragment>
                          )}
                      </div>
                    </Tooltip>
                  ) : stats.type === 'vessels' ? (
                    t('workspace.noVesselInFilters', 'No vessels match your filters')
                  ) : (
                    t('workspace.noDetectionInFilters', 'No detections match your filters')
                  )}
                </div>
              )}
              <div className={styles.filters}>
                <div className={styles.filters}>
                  <DatasetFilterSource dataview={dataview} />
                  <DatasetFlagField dataview={dataview} />
                  {datasetFields.map(({ field, label }) => (
                    <DatasetSchemaField
                      key={field}
                      dataview={dataview}
                      field={field}
                      label={label}
                    />
                  ))}
                </div>
              </div>
              <div className={activityStyles.legendContainer}>
                <div className={activityStyles.legend} id={`legend_${dataview.id}`}></div>
                {bivariateDataviews?.[0] === dataview.id && (
                  <IconButton
                    size="small"
                    type="border"
                    icon="split"
                    tooltip={t('layer.toggleCombinationMode.split', 'Split layers')}
                    tooltipPlacement="left"
                    className={cx(activityStyles.bivariateSplit, 'print-hidden')}
                    onClick={onSplitLayers}
                  />
                )}
              </div>
            </div>
          )}
          {layerActive && <ActivityAuxiliaryLayerPanel dataview={dataview} />}
        </Fragment>
      ) : (
        <DatasetNotFound dataview={dataview} />
      )}
    </div>
  )
}

export default ActivityLayerPanel
