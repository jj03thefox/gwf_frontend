import React, { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { stringify } from 'qs'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import Button from '@globalfishingwatch/ui-components/dist/button'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { DatasetTypes, EventVessel } from '@globalfishingwatch/api-types/dist'
import { TooltipEventFeature, useClickedEventConnect } from 'features/map/map.hooks'
import { AsyncReducerStatus } from 'utils/async-slice'
import I18nDate from 'features/i18n/i18nDate'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { formatInfoField } from 'utils/info'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getRelatedDatasetByType } from 'features/datasets/datasets.selectors'
import { CARRIER_PORTAL_URL } from 'data/config'
import { useCarrierLatestConnect } from 'features/datasets/datasets.hook'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import useViewport from '../map-viewport.hooks'
import styles from './Popup.module.css'

type UserContextLayersProps = {
  features: TooltipEventFeature[]
}

function TileClusterTooltipRow({ features }: UserContextLayersProps) {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { apiEventStatus } = useClickedEventConnect()
  const { start, end } = useTimerangeConnect()
  const { viewport } = useViewport()
  const { carrierLatest, carrierLatestStatus, dispatchFetchLatestCarrier } =
    useCarrierLatestConnect()

  useEffect(() => {
    if (!carrierLatest) {
      dispatchFetchLatestCarrier()
    }
  }, [carrierLatest, dispatchFetchLatestCarrier])

  const onPinClick = (vessel: EventVessel, feature: TooltipEventFeature) => {
    const dataset = feature.event?.dataset
    const trackDatasetId = getRelatedDatasetByType(dataset, DatasetTypes.Tracks)?.id
    const infoDatasetId = getRelatedDatasetByType(dataset, DatasetTypes.Vessels)?.id

    if (trackDatasetId && infoDatasetId) {
      const vesselDataviewInstance = getVesselDataviewInstance(
        { id: vessel.id },
        {
          trackDatasetId: trackDatasetId as string,
          infoDatasetId: infoDatasetId,
        }
      )
      upsertDataviewInstance(vesselDataviewInstance)
    }
  }

  return (
    <Fragment>
      {features.map((feature, index) => {
        const linkParams = {
          ...viewport,
          dataset: carrierLatest?.id,
          vessel: feature.event?.vessel?.id,
          ...(feature.event && { timestamp: new Date(feature.event.start).getTime() }),
          start,
          end,
        }
        const isEventInDatasetRange =
          feature.event !== undefined &&
          carrierLatest?.endDate !== undefined &&
          carrierLatest?.startDate !== undefined &&
          feature.event.start >= carrierLatest.startDate &&
          feature.event.end <= carrierLatest.endDate

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
        return (
          <div key={`${feature.title}-${index}`} className={styles.popupSection}>
            <span className={styles.popupSectionColor} style={{ backgroundColor: feature.color }} />
            <div className={styles.popupSectionContent}>
              {<h3 className={styles.popupSectionTitle}>{feature.title}</h3>}
              <div className={styles.row}>
                {apiEventStatus === AsyncReducerStatus.Loading ? (
                  <div className={styles.loading}>
                    <Spinner size="small" />
                  </div>
                ) : feature.event ? (
                  <div className={styles.rowContainer}>
                    <span className={styles.rowText}>
                      <I18nDate date={feature.event?.start as string} />
                    </span>
                    {feature.event?.vessel && (
                      <div className={styles.rowColum}>
                        <p className={styles.rowTitle}>{t('vessel.carrier', 'Carrier')}</p>
                        <div className={styles.centered}>
                          <span className={styles.rowText}>
                            {formatInfoField(feature.event?.vessel?.name, 'name')}
                          </span>
                          <IconButton
                            icon="pin"
                            size="small"
                            onClick={() =>
                              onPinClick(feature.event?.vessel as EventVessel, feature)
                            }
                          />
                        </div>
                      </div>
                    )}
                    {feature.event.encounter?.vessel && (
                      <div className={styles.row}>
                        <div className={styles.column}>
                          <span className={styles.rowTitle}>
                            {t('vessel.donor', 'Donor vessel')}
                          </span>
                          <div className={styles.centered}>
                            <span className={styles.rowText}>
                              {formatInfoField(feature.event.encounter?.vessel?.name, 'name')}
                            </span>
                            <IconButton
                              icon="pin"
                              size="small"
                              onClick={() =>
                                onPinClick(feature.event?.encounter?.vessel as EventVessel, feature)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className={styles.row}>
                      <Button
                        href={urlLink}
                        target="_blank"
                        size="small"
                        className={styles.btnLarge}
                        disabled={
                          carrierLatestStatus === AsyncReducerStatus.Loading ||
                          !isEventInDatasetRange
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
            </div>
          </div>
        )
      })}
    </Fragment>
  )
}

export default TileClusterTooltipRow
