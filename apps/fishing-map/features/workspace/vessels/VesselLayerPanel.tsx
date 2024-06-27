import { Fragment, ReactNode, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { groupBy } from 'lodash'
import {
  DatasetTypes,
  ResourceStatus,
  DataviewDatasetConfigParam,
  Resource,
  IdentityVessel,
  VesselIdentitySourceEnum,
} from '@globalfishingwatch/api-types'
import { IconButton, ColorBarOption } from '@globalfishingwatch/ui-components'
import {
  resolveDataviewDatasetResource,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import { VesselLayer } from '@globalfishingwatch/deck-layers'
import { formatInfoField, getVesselLabel, getVesselOtherNamesLabel } from 'utils/info'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectResourceByUrl } from 'features/resources/resources.slice'
import { VESSEL_DATAVIEW_INSTANCE_PREFIX } from 'features/dataviews/dataviews.utils'
import {
  getSchemaFiltersInDataview,
  isGFWOnlyDataset,
  isPrivateDataset,
} from 'features/datasets/datasets.utils'
import { useLayerPanelDataviewSort } from 'features/workspace/shared/layer-panel-sort.hook'
import GFWOnly from 'features/user/GFWOnly'
import VesselDownload from 'features/workspace/vessels/VesselDownload'
import VesselLink from 'features/vessel/VesselLink'
import { getOtherVesselNames } from 'features/vessel/vessel.utils'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { t } from 'features/i18n/i18n'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import ExpandedContainer from 'features/workspace/shared/ExpandedContainer'
import DatasetSchemaField from 'features/workspace/shared/DatasetSchemaField'
import Filters from '../common/LayerFilters'
import Color from '../common/Color'
import LayerSwitch from '../common/LayerSwitch'
import Remove from '../common/Remove'
import Title from '../common/Title'
import FitBounds from '../common/FitBounds'

export type VesselLayerPanelProps = {
  dataview: UrlDataviewInstance
}

export const getVesselIdentityTooltipSummary = (
  vessel: IdentityVessel,
  { showVesselId } = {} as { showVesselId: boolean }
) => {
  if (!vessel || !vessel.selfReportedInfo?.length) {
    return ['']
  }
  const identitiesByNormalizedShipname = groupBy(vessel?.selfReportedInfo, 'nShipname')
  const identities = Object.entries(identitiesByNormalizedShipname).flatMap(
    ([_, selfReportedInfo], index) => {
      const firstTransmissionDateFrom = selfReportedInfo.reduce((acc, curr) => {
        if (!acc) {
          return curr.transmissionDateFrom
        }
        return acc < curr.transmissionDateFrom ? acc : curr.transmissionDateFrom
      }, '')
      const lastTransmissionDateTo = selfReportedInfo.reduce((acc, curr) => {
        if (!acc) {
          return curr.transmissionDateTo
        }
        return acc > curr.transmissionDateTo ? acc : curr.transmissionDateTo
      }, '')

      const selfReported = selfReportedInfo[0]
      const name = formatInfoField(selfReported.shipname, 'name')
      const flag = formatInfoField(selfReported.flag, 'flag')
      let info = `${name} - (${flag}) (${formatI18nDate(
        firstTransmissionDateFrom
      )} - ${formatI18nDate(lastTransmissionDateTo)})`
      return showVesselId ? (
        <Fragment key={index}>
          {info}
          <br />
          {selfReportedInfo.map((s, index) => (
            <Fragment key={s.id}>
              <GFWOnly type="only-icon" /> {s.id}
              {index < selfReportedInfo.length - 1 && <br />}
            </Fragment>
          ))}
          <br />
        </Fragment>
      ) : (
        <Fragment key={index}>
          {info}
          <br />
        </Fragment>
      )
    }
  )
  return [...identities, t('vessel.clickToSeeMore', 'Click to see more information')]
}

function VesselLayerPanel({ dataview }: VesselLayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const [filterOpen, setFiltersOpen] = useState(false)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { url: infoUrl, dataset } = resolveDataviewDatasetResource(dataview, DatasetTypes.Vessels)
  const vesselLayer = useGetDeckLayer<VesselLayer>(dataview.id)
  // const vesselInstance = useMapVesselLayer(dataview.id)
  const gfwUser = useSelector(selectIsGFWUser)
  const trackDatasetId = dataview.datasets?.find((rld) => rld.type === DatasetTypes.Tracks)?.id

  const infoResource: Resource<IdentityVessel> = useSelector(
    selectResourceByUrl<IdentityVessel>(infoUrl)
  )
  const { items, attributes, listeners, setNodeRef, setActivatorNodeRef, style } =
    useLayerPanelDataviewSort(dataview.id)

  const [colorOpen, setColorOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  const layerActive = dataview?.config?.visible ?? true

  const changeTrackColor = (color: ColorBarOption) => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        color: color.value,
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

  // const onToggleInfoOpen = () => {
  //   setInfoOpen(!infoOpen)
  // }

  const closeExpandedContainer = () => {
    setColorOpen(false)
    setFiltersOpen(false)
    setInfoOpen(false)
  }

  const trackLoaded = vesselLayer?.instance.getVesselTracksLayersLoaded()
  const trackLayerVisible = vesselLayer?.instance.props.visible
  const infoLoading = infoResource?.status === ResourceStatus.Loading
  const loading = trackLayerVisible && (infoLoading || !trackLoaded)

  const infoError = infoResource?.status === ResourceStatus.Error
  const trackError: any = vesselLayer?.instance.getErrorMessage()

  const vesselData = infoResource?.data
  const vesselLabel = vesselData ? getVesselLabel(vesselData) : ''
  const otherVesselsLabel = vesselData
    ? getVesselOtherNamesLabel(getOtherVesselNames(vesselData as IdentityVessel))
    : ''
  const identitiesSummary = vesselData
    ? getVesselIdentityTooltipSummary(vesselData, { showVesselId: gfwUser || false })
    : ''

  const { filtersAllowed } = getSchemaFiltersInDataview(dataview, {
    fieldsToInclude: ['speed', 'elevation'],
  })

  const hasSchemaFilterSelection = filtersAllowed.some(
    (schema) => schema.optionsSelected?.length > 0
  )

  const vesselId =
    (infoResource?.datasetConfig?.params?.find(
      (p: DataviewDatasetConfigParam) => p.id === 'vesselId'
    )?.value as string) ||
    dataview.id.replace(VESSEL_DATAVIEW_INSTANCE_PREFIX, '') ||
    ''

  const getVesselTitle = (): ReactNode => {
    if (infoLoading) return t('vessel.loadingInfo', 'Loading vessel info')
    if (infoError) return t('common.unknownVessel', 'Unknown vessel')
    if (dataview?.datasetsConfig?.some((d) => isGFWOnlyDataset({ id: d.datasetId })))
      return (
        <Fragment>
          <GFWOnly type="only-icon" />
          {vesselLabel}
          {otherVesselsLabel && <span className={styles.secondary}>{otherVesselsLabel}</span>}
        </Fragment>
      )

    const isPrivateVessel = dataview?.datasetsConfig
      ?.filter((d) => d.datasetId)
      .some((d) => isPrivateDataset({ id: d.datasetId }))
    return (
      <Fragment>
        {isPrivateVessel && '🔒'}
        {vesselLabel}
        {otherVesselsLabel && <span className={styles.secondary}>{otherVesselsLabel}</span>}
      </Fragment>
    )
  }

  const TitleComponentContent = () => (
    <Fragment>
      <span className={cx({ [styles.faded]: infoLoading || infoError })}>
        <VesselLink
          className={styles.link}
          vesselId={vesselId}
          datasetId={dataset?.id}
          tooltip={identitiesSummary}
          query={{
            vesselIdentitySource: VesselIdentitySourceEnum.SelfReported,
            vesselSelfReportedId: vesselId,
          }}
          testId="vessel-layer-vessel-name"
        >
          {getVesselTitle()}
        </VesselLink>
      </span>
      {(infoError || trackError) && (
        <IconButton
          size="small"
          icon="warning"
          type="warning"
          disabled
          className={styles.errorIcon}
        />
      )}
    </Fragment>
  )

  const TrackIconComponent = !trackLoaded ? (
    <IconButton
      loading
      className={styles.loadingIcon}
      size="small"
      tooltip={t('vessel.loading', 'Loading vessel track')}
    />
  ) : (
    <FitBounds
      hasError={trackError}
      vesselLayer={vesselLayer?.instance}
      infoResource={infoResource}
    />
  )

  return (
    <div
      className={cx(
        styles.LayerPanel,
        {
          [styles.expandedContainerOpen]: colorOpen || infoOpen || filterOpen,
        },
        { 'print-hidden': !layerActive }
      )}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className={styles.header}>
        <LayerSwitch active={layerActive} className={styles.switch} dataview={dataview} />
        <Title
          title={<TitleComponentContent />}
          className={styles.name}
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
            {trackDatasetId && (
              <VesselDownload
                dataview={dataview}
                vesselIds={[vesselId]}
                vesselTitle={vesselLabel || t('common.unknownVessel', 'Unknown vessel')}
                datasetId={trackDatasetId}
              />
            )}
            <Color
              dataview={dataview}
              open={colorOpen}
              onColorClick={changeTrackColor}
              onToggleClick={onToggleColorOpen}
              onClickOutside={closeExpandedContainer}
            />
            {layerActive && !infoLoading && TrackIconComponent}
            {layerActive && (
              <ExpandedContainer
                visible={filterOpen}
                onClickOutside={closeExpandedContainer}
                // TODO:deck show speed and elevation filters based on dataview fields config
                component={<Filters dataview={dataview} onConfirmCallback={onToggleFilterOpen} />}
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
            <Remove dataview={dataview} />
          </Fragment>
          {infoLoading && (
            <IconButton
              loading
              className={styles.loadingIcon}
              size="small"
              tooltip={t('vessel.loadingInfo', 'Loading vessel info')}
            />
          )}
          {infoError && (
            <IconButton
              size="small"
              icon="warning"
              type="warning"
              disabled
              tooltip={`${t(
                'errors.vesselLoading',
                'There was an error loading the vessel details'
              )} (${vesselId})`}
              tooltipPlacement="top"
            />
          )}
        </div>
        <IconButton
          icon={'more'}
          loading={loading}
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
      {hasSchemaFilterSelection && (
        <div className={styles.properties}>
          <div className={styles.filters}>
            <div className={styles.filters}>
              {filtersAllowed.map(({ id, label }) => (
                <DatasetSchemaField key={id} dataview={dataview} field={id} label={label} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VesselLayerPanel
