import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { stringify } from 'qs'
import { useSelector } from 'react-redux'
import { Button, Icon, IconButton } from '@globalfishingwatch/ui-components'
import { DatasetTypes, DataviewCategory } from '@globalfishingwatch/api-types'
import { AsyncReducerStatus } from 'utils/async-slice'
import I18nDate from 'features/i18n/i18nDate'
import {
  ENCOUNTER_EVENTS_SOURCES,
  LOITERING_EVENTS_SOURCE_ID,
  PORT_VISITS_EVENTS_SOURCE_ID,
} from 'features/dataviews/dataviews.utils'
import { formatInfoField } from 'utils/info'
import { CARRIER_PORTAL_URL, LAYER_LIBRARY_ID_SEPARATOR } from 'data/config'
import { useCarrierLatestConnect } from 'features/datasets/datasets.hook'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import VesselLink from 'features/vessel/VesselLink'
import VesselPin from 'features/vessel/VesselPin'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { VESSEL_GROUP_EVENTS_DATAVIEW_IDS } from 'features/reports/vessel-groups/vessel-group-report.dataviews'
import { getEventDescriptionComponent } from 'utils/events'
import PortsReportLink from 'features/reports/ports/PortsReportLink'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import { useMapViewState } from '../../map-viewport.hooks'
import type {
  ExtendedEventVessel,
  ExtendedFeatureByVesselEvent,
  ExtendedFeatureSingleEvent,
  SliceExtendedClusterPickingObject,
} from '../../map.slice'
import styles from '../Popup.module.css'
import VesselsTable from './VesselsTable'

const parseEncounterEvent = (
  event: ExtendedFeatureSingleEvent | undefined
): ExtendedFeatureSingleEvent | undefined => {
  if (!event) return event
  return {
    ...event,
    vessel: event.vessel,
    ...(event.encounter && {
      encounter: {
        ...event.encounter,
        vessel: event.encounter?.vessel,
      },
    }),
  }
}

type EncountersLayerProps = {
  feature: SliceExtendedClusterPickingObject<ExtendedFeatureSingleEvent>
  showFeaturesDetails: boolean
  error?: string
}

function EncounterTooltipRow({ feature, showFeaturesDetails, error }: EncountersLayerProps) {
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const viewState = useMapViewState()
  const { carrierLatest, carrierLatestStatus, dispatchFetchLatestCarrier } =
    useCarrierLatestConnect()

  useEffect(() => {
    if (!carrierLatest) {
      dispatchFetchLatestCarrier()
    }
  }, [carrierLatest, dispatchFetchLatestCarrier])

  const event = parseEncounterEvent(feature.event)
  const linkParams = {
    ...viewState,
    dataset: carrierLatest?.id,
    ...(event && {
      vessel: event.vessel.id,
      timestamp: new Date(event.start).getTime(),
    }),
    start,
    end,
  }
  const isEventInDatasetRange =
    event !== undefined &&
    carrierLatest?.endDate !== undefined &&
    carrierLatest?.startDate !== undefined &&
    event.start >= carrierLatest.startDate &&
    event.end <= carrierLatest.endDate

  const urlLink = `${CARRIER_PORTAL_URL}/?${stringify(linkParams)}`
  let linkTooltip = ''
  if (carrierLatestStatus === AsyncReducerStatus.Error) {
    linkTooltip = t('errors.latestCarrierNotFound', 'Latest carrier dataset not found')
  }
  if (carrierLatestStatus === AsyncReducerStatus.Finished && !isEventInDatasetRange) {
    linkTooltip = t(
      'event.notInCVP',
      'This event happened outside the timerange of the Carrier Vessel Portal data'
    )
  }
  const title = getDatasetLabel({ id: feature.datasetId! })
  return (
    <div className={styles.popupSection}>
      <Icon icon="encounters" className={styles.layerIcon} style={{ color: feature.color }} />
      <div className={styles.popupSectionContent}>
        {<h3 className={styles.popupSectionTitle}>{title}</h3>}
        {error && <p className={styles.error}>{error}</p>}
        {showFeaturesDetails && (
          <div className={styles.row}>
            {event ? (
              <div className={styles.rowContainer}>
                <span className={styles.rowText}>
                  <I18nDate date={event.start as string} />
                </span>
                <div className={styles.flex}>
                  {event.vessel && (
                    <div className={styles.rowColum}>
                      <p className={styles.rowTitle}>
                        {t(`vessel.vesselTypes.${event.vessel.type}`, event.vessel.type)}
                      </p>
                      <div className={styles.centered}>
                        <span className={styles.rowText}>
                          <VesselLink vesselId={event.vessel.id} datasetId={event.vessel.dataset}>
                            {formatInfoField(event.vessel?.name, 'shipname')}
                          </VesselLink>
                        </span>
                        {(event.vessel as ExtendedEventVessel).dataset && (
                          <VesselPin
                            vesselToResolve={{ ...event.vessel, datasetId: event.vessel.dataset }}
                          />
                        )}
                      </div>
                    </div>
                  )}
                  {event.encounter?.vessel && (
                    <div className={styles.row}>
                      <div className={styles.rowColum}>
                        <span className={styles.rowTitle}>
                          {t(
                            `vessel.vesselTypes.${event.encounter.vessel.type}`,
                            event.encounter.vessel.type
                          )}
                        </span>
                        <div className={styles.centered}>
                          <span className={styles.rowText}>
                            <VesselLink
                              vesselId={event.encounter.vessel?.id}
                              datasetId={event.encounter.vessel?.dataset}
                            >
                              {formatInfoField(event.encounter.vessel?.name, 'shipname')}
                            </VesselLink>
                          </span>
                          {(event.encounter?.vessel as ExtendedEventVessel).dataset && (
                            <VesselPin
                              vesselToResolve={{
                                ...event.encounter.vessel,
                                datasetId: event.encounter.vessel.dataset,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.row}>
                  <Button
                    href={urlLink}
                    target="_blank"
                    size="small"
                    className={styles.btnLarge}
                    disabled={
                      carrierLatestStatus === AsyncReducerStatus.Loading || !isEventInDatasetRange
                    }
                    tooltip={linkTooltip}
                    loading={carrierLatestStatus === AsyncReducerStatus.Loading}
                  >
                    {t('event.seeInCVP', 'See in Carrier Vessel Portal')}
                  </Button>
                </div>
              </div>
            ) : (
              t('event.noData', 'No data available')
            )}
          </div>
        )}
      </div>
    </div>
  )
}

type PortVisitLayerProps = {
  feature: SliceExtendedClusterPickingObject<ExtendedFeatureByVesselEvent>
  showFeaturesDetails: boolean
  error?: string
}
function PortVisitEventTooltipRow({ feature, showFeaturesDetails, error }: PortVisitLayerProps) {
  const { datasetId, event, color } = feature
  const title = getDatasetLabel({ id: datasetId! })
  const isGFWUser = useSelector(selectIsGFWUser)
  return (
    <div className={styles.popupSection}>
      <Icon icon="clusters" className={styles.layerIcon} style={{ color }} />
      <div className={styles.popupSectionContent}>
        {<h3 className={styles.popupSectionTitle}>{title}</h3>}
        {isGFWUser && event?.port && (
          <PortsReportLink port={event.port}>
            <div className={styles.textContainer}>
              {event?.port?.name || event?.port?.id}
              {event?.port?.country && ` (${formatInfoField(event.port.country, 'flag')})`}
              <IconButton size="small" icon="analysis" />
            </div>
          </PortsReportLink>
        )}
        {error && <p className={styles.error}>{error}</p>}
        {showFeaturesDetails && (
          <VesselsTable
            feature={
              {
                vessels: event?.vessels,
                category: DataviewCategory.Events,
              } as any
            }
            vesselProperty="events"
          />
        )}
      </div>
    </div>
  )
}

function ClusterEventTooltipRow({ feature, showFeaturesDetails }: EncountersLayerProps) {
  const { t } = useTranslation()
  const { datasetId, event, color } = feature
  const title = getDatasetLabel({ id: datasetId! })
  const infoDataset = event?.dataset.relatedDatasets?.find((d) => d.type === DatasetTypes.Vessels)
  return (
    <div className={styles.popupSection}>
      <Icon icon="clusters" className={styles.layerIcon} style={{ color }} />
      <div className={styles.popupSectionContent}>
        {<h3 className={styles.popupSectionTitle}>{title}</h3>}
        {showFeaturesDetails && (
          <div className={styles.row}>
            {event?.vessel ? (
              <div className={styles.rowText}>
                <VesselPin
                  vesselToResolve={{ ...event.vessel, datasetId: infoDataset?.id as string }}
                  size="small"
                  className={styles.inlineBtn}
                />
                <VesselLink
                  vesselId={event.vessel.id}
                  datasetId={infoDataset?.id}
                  className={styles.marginRight}
                >
                  {formatInfoField(event.vessel.name, 'shipname')}
                </VesselLink>
                ({formatInfoField(event.vessel.flag, 'flag')}){' '}
                <span className={styles.secondary} style={{ display: 'inline' }}>
                  {getEventDescriptionComponent(event)?.description}
                </span>
              </div>
            ) : (
              t('event.noData', 'No data available')
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function GenericClusterTooltipRow({ feature, showFeaturesDetails, error }: EncountersLayerProps) {
  return (
    <div className={styles.popupSection}>
      <Icon icon="clusters" style={{ color: feature.color }} />
      <div className={styles.popupSectionContent}>
        {<h3 className={styles.popupSectionTitle}>{feature.title}</h3>}
        {error && <p className={styles.error}>{error}</p>}
        {showFeaturesDetails && feature.properties && (
          <div className={styles.row}>
            <ul className={styles.list}>
              {Object.entries(feature.properties).map(([key, value]) => {
                if (key === 'count' || key === 'expansionZoom') {
                  return null
                }
                return (
                  <li key={key}>
                    <span className={styles.strong}>{key}</span>: {JSON.stringify(value)}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

type TileContextLayersProps = {
  features: SliceExtendedClusterPickingObject[]
  showFeaturesDetails: boolean
  error?: string
}

const GFW_CLUSTER_LAYERS = [
  ...ENCOUNTER_EVENTS_SOURCES,
  PORT_VISITS_EVENTS_SOURCE_ID,
  LOITERING_EVENTS_SOURCE_ID,
  ...VESSEL_GROUP_EVENTS_DATAVIEW_IDS,
]

function TileClusterTooltipRow({ features, showFeaturesDetails, error }: TileContextLayersProps) {
  return (
    <Fragment>
      {features.map((feature, index) => {
        const key = `${feature.title}-${index}`
        const eventFeature =
          feature as SliceExtendedClusterPickingObject<ExtendedFeatureSingleEvent>
        if (
          GFW_CLUSTER_LAYERS.some(
            (source) => feature.layerId.split(LAYER_LIBRARY_ID_SEPARATOR)[0] === source
          )
        ) {
          if (feature.layerId.includes('port')) {
            return (
              <PortVisitEventTooltipRow
                key={key}
                error={error}
                feature={feature as SliceExtendedClusterPickingObject<ExtendedFeatureByVesselEvent>}
                showFeaturesDetails={showFeaturesDetails}
              />
            )
          }
          if (feature.layerId.includes('encounter')) {
            return (
              <EncounterTooltipRow
                key={key}
                error={error}
                feature={eventFeature}
                showFeaturesDetails={showFeaturesDetails}
              />
            )
          }
          return (
            <ClusterEventTooltipRow
              key={key}
              error={error}
              feature={eventFeature}
              showFeaturesDetails={showFeaturesDetails}
            />
          )
        }
        return (
          <GenericClusterTooltipRow
            key={key}
            error={error}
            feature={eventFeature}
            showFeaturesDetails={showFeaturesDetails}
          />
        )
      })}
    </Fragment>
  )
}

export default TileClusterTooltipRow
