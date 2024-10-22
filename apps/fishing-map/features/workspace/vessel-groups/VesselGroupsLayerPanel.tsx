import { Fragment, useEffect, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { IconButton, ColorBarOption, Tooltip } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import { FourwingsLayer } from '@globalfishingwatch/deck-layers'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useLayerPanelDataviewSort } from 'features/workspace/shared/layer-panel-sort.hook'
import { formatInfoField } from 'utils/info'
import VesselGroupReportLink from 'features/reports/vessel-groups/VesselGroupReportLink'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  setVesselGroupModalVessels,
  setVesselGroupEditId,
  setVesselGroupsModalOpen,
  setVesselGroupConfirmationMode,
} from 'features/vessel-groups/vessel-groups-modal.slice'
import { selectIsGFWUser, selectUserData } from 'features/user/selectors/user.selectors'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import {
  useReportAreaCenter,
  useVesselGroupBounds,
} from 'features/reports/areas/area-reports.hooks'
import { useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import {
  getVesselGroupVesselsCount,
  isOutdatedVesselGroup,
} from 'features/vessel-groups/vessel-groups.utils'
import { selectVesselGroupsStatus } from 'features/vessel-groups/vessel-groups.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import Color from '../common/Color'
import LayerSwitch from '../common/LayerSwitch'
import Remove from '../common/Remove'
import Title from '../common/Title'
import VesselGroupNotFound from './VesselGroupNotFound'

export type VesselGroupLayerPanelProps = {
  dataview: UrlDataviewInstance
  vesselGroupLoading?: boolean
}

function VesselGroupLayerPanel({
  dataview,
  vesselGroupLoading,
}: VesselGroupLayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const isGFWUser = useSelector(selectIsGFWUser)
  const userData = useSelector(selectUserData)
  const readOnly = useSelector(selectReadOnly)
  const { vesselGroup } = dataview
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const activityLayer = useGetDeckLayer<FourwingsLayer>(dataview?.id)
  const layerLoaded = activityLayer?.loaded && !vesselGroupLoading
  const layerError = activityLayer?.instance?.getError?.()
  const { items, attributes, listeners, setNodeRef, setActivatorNodeRef, style } =
    useLayerPanelDataviewSort(dataview.id)
  const [colorOpen, setColorOpen] = useState(false)
  const layerActive = dataview?.config?.visible ?? true

  const [fitBoundsClicked, setfitBoundsClicked] = useState(false)
  const { loaded, bbox } = useVesselGroupBounds(fitBoundsClicked ? dataview?.id : undefined)
  const coordinates = useReportAreaCenter(bbox!)
  const setMapCoordinates = useSetMapCoordinates()
  const vesselGroupStatus = useSelector(selectVesselGroupsStatus)
  const isOutdated = isOutdatedVesselGroup(vesselGroup!)
  const isOwnedByUser = vesselGroup?.ownerId === userData?.id

  useEffect(() => {
    if (coordinates && loaded) {
      setMapCoordinates(coordinates)
      setfitBoundsClicked(false)
    }
  }, [loaded, coordinates, setMapCoordinates])

  const changeInstanceColor = (color: ColorBarOption) => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        color: color.value,
        colorRamp: color.id,
      },
    })
    setColorOpen(false)
  }

  const onEditClick = () => {
    if (vesselGroup && (vesselGroup?.id || !vesselGroup?.vessels?.length)) {
      dispatch(setVesselGroupEditId(vesselGroup.id))
      dispatch(setVesselGroupModalVessels(vesselGroup.vessels))
      dispatch(setVesselGroupsModalOpen(true))
      if (isOutdated) {
        dispatch(setVesselGroupConfirmationMode('update'))
      }
    }
  }

  const onToggleColorOpen = () => {
    setColorOpen(!colorOpen)
  }

  const closeExpandedContainer = () => {
    setColorOpen(false)
  }

  if (!vesselGroup) {
    return <VesselGroupNotFound dataview={dataview} />
  }

  return (
    <div
      className={cx(
        styles.LayerPanel,
        { [styles.expandedContainerOpen]: colorOpen },
        { 'print-hidden': !layerActive }
      )}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className={styles.header}>
        <LayerSwitch active={layerActive} className={styles.switch} dataview={dataview} />
        <Title
          title={
            layerActive ? (
              isOutdated ? (
                <Tooltip
                  content={t(
                    'vesselGroupReport.linkDisabled',
                    'You need to update the vessel group first to see the report'
                  )}
                >
                  <span>
                    {formatInfoField(vesselGroup?.name, 'shipname')}{' '}
                    <span className={styles.secondary}>
                      ({getVesselGroupVesselsCount(vesselGroup)})
                    </span>
                  </span>
                </Tooltip>
              ) : (
                <VesselGroupReportLink vesselGroupId={vesselGroup?.id!}>
                  <Tooltip
                    content={t(
                      'vesselGroupReport.clickToSee',
                      'Click to analyse vessel group and see report'
                    )}
                  >
                    <span>
                      {vesselGroupLoading ? (
                        t('vesselGroup.loadingInfo', 'Loading vessel group info')
                      ) : (
                        <Fragment>
                          {vesselGroup?.name}{' '}
                          {vesselGroup?.vessels?.length && (
                            <span className={styles.secondary}>
                              ({getVesselGroupVesselsCount(vesselGroup)})
                            </span>
                          )}
                        </Fragment>
                      )}
                    </span>
                  </Tooltip>
                </VesselGroupReportLink>
              )
            ) : (
              <span>
                {vesselGroup?.name}{' '}
                {vesselGroup?.vessels?.length && (
                  <span className={styles.secondary}>
                    {' '}
                    ({getVesselGroupVesselsCount(vesselGroup)})
                  </span>
                )}
              </span>
            )
          }
          className={cx(styles.name, { [styles.disabled]: isOutdated })}
          classNameActive={styles.active}
          dataview={dataview}
          toggleVisibility={false}
        />
        <div
          className={cx('print-hidden', styles.actions, styles.hideUntilHovered, {
            [styles.active]: layerActive,
          })}
        >
          <Fragment>
            {layerActive && (
              <Fragment>
                {!isOutdated && (
                  <VesselGroupReportLink vesselGroupId={vesselGroup?.id!}>
                    <IconButton
                      tooltip={t(
                        'vesselGroupReport.clickToSee',
                        'Click to see the vessel group report'
                      )}
                      icon="analysis"
                      size="small"
                    />
                  </VesselGroupReportLink>
                )}
                {isOwnedByUser && !isOutdated && (
                  <IconButton
                    size="small"
                    icon={'edit'}
                    type={'default'}
                    tooltip={t('vesselGroup.edit', 'Edit list of vessels')}
                    loading={vesselGroupStatus === AsyncReducerStatus.LoadingUpdate}
                    onClick={onEditClick}
                  />
                )}
                <IconButton
                  icon="target"
                  size="small"
                  tooltip={t('layer.vessel_group_fit_bounds', 'Center map on vessel group')}
                  onClick={() => setfitBoundsClicked(true)}
                  tooltipPlacement="top"
                  loading={fitBoundsClicked}
                />
                <Color
                  dataview={dataview}
                  open={colorOpen}
                  onColorClick={changeInstanceColor}
                  onToggleClick={onToggleColorOpen}
                  onClickOutside={closeExpandedContainer}
                  colorType="fill"
                />
              </Fragment>
            )}
            {!readOnly && <Remove dataview={dataview} loading={layerActive && !layerLoaded} />}
            {!readOnly && layerActive && layerError && (
              <IconButton
                icon={'warning'}
                type={'warning'}
                tooltip={
                  isGFWUser
                    ? `${t(
                        'errors.layerLoading',
                        'There was an error loading the layer'
                      )} (${layerError})`
                    : t('errors.layerLoading', 'There was an error loading the layer')
                }
                size="small"
              />
            )}
          </Fragment>
        </div>
        {isOwnedByUser && isOutdated && (
          <IconButton
            size="small"
            icon={'warning'}
            type={'warning'}
            tooltip={t(
              'vesselGroup.clickToUpdate',
              'Click to migrate your vessel group to latest available data'
            )}
            loading={vesselGroupStatus === AsyncReducerStatus.LoadingUpdate}
            onClick={onEditClick}
          />
        )}
        <IconButton
          icon={layerActive ? (layerError ? 'warning' : 'more') : undefined}
          type={layerError ? 'warning' : 'default'}
          loading={layerActive && !layerLoaded}
          className={cx('print-hidden', styles.shownUntilHovered)}
          size="small"
        />
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
  )
}

export default VesselGroupLayerPanel
