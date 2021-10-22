import React, { Fragment, useEffect, useMemo, useState } from 'react'
import cx from 'classnames'
import { event as uaEvent } from 'react-ga'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ImageGallery from 'react-image-gallery'
import { DateTime, Interval } from 'luxon'
import { Button, IconButton } from '@globalfishingwatch/ui-components'
import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { VesselWithHistory } from 'types'
import I18nDate from 'features/i18n/i18nDate'
import { selectCurrentOfflineVessel } from 'features/vessels/offline-vessels.selectors'
import { useOfflineVesselsAPI } from 'features/vessels/offline-vessels.hook'
import { OfflineVessel, VesselFieldLabel } from 'types/vessel'
import {
  selectDataset,
  selectTmtId,
  selectUrlAkaVesselQuery,
  selectVesselId,
  selectVesselProfileId,
} from 'routes/routes.selectors'
import { selectEventsForTracks } from 'features/vessels/activity/vessels-activity.selectors'
import InfoField from './InfoField'
import styles from './Info.module.css'
import 'react-image-gallery/styles/css/image-gallery.css'
import Highlights from './Highlights'
import AuthorizationsField from './AuthorizationsField'

interface InfoProps {
  vessel: VesselWithHistory | null
  lastPosition: any
  lastPortVisit: any
  onMoveToMap: () => void
}

const Info: React.FC<InfoProps> = (props): React.ReactElement => {
  const vessel = props.vessel
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const vesselId = useSelector(selectVesselId)
  const eventsForTracks = useSelector(selectEventsForTracks)
  const activities = useMemo(() => eventsForTracks.map((e) => e.data).flat(), [eventsForTracks])
  const vesselTmtId = useSelector(selectTmtId)
  const vesselDataset = useSelector(selectDataset)
  const vesselProfileId = useSelector(selectVesselProfileId)
  const akaVesselProfileIds = useSelector(selectUrlAkaVesselQuery)
  const offlineVessel = useSelector(selectCurrentOfflineVessel)
  const { dispatchCreateOfflineVessel, dispatchDeleteOfflineVessel, dispatchFetchOfflineVessel } =
    useOfflineVesselsAPI()
  const isMergedVesselsView = useMemo(
    () => akaVesselProfileIds && akaVesselProfileIds.length > 0,
    [akaVesselProfileIds]
  )

  useEffect(() => {
    dispatchFetchOfflineVessel(vesselProfileId)
  }, [vesselProfileId, dispatchFetchOfflineVessel])

  const onDeleteClick = async (data: OfflineVessel) => {
    const now = DateTime.now()
    const savedOn = DateTime.fromISO(data.savedOn)
    const i = Interval.fromDateTimes(savedOn, now)
    uaEvent({
      category: 'Offline Access',
      action: 'Remove saved vessel for offline view',
      label: JSON.stringify({ page: 'vessel detail' }),
      value: Math.floor(i.length('days')),
    })
    setLoading(true)
    await dispatchDeleteOfflineVessel(data)
    setLoading(false)
  }

  const onSaveClick = async (data: VesselWithHistory) => {
    setLoading(true)
    uaEvent({
      category: 'Offline Access',
      action: 'Save vessel for offline view',
      label: JSON.stringify({
        gfw: vesselId,
        tmt: vesselTmtId,
      }),
    })
    await dispatchCreateOfflineVessel({
      vessel: {
        ...data,
        profileId: data.id,
        id: vesselId,
        dataset: vesselDataset,
        vesselMatchId: vesselTmtId,
        source: '',
        activities: activities,
        savedOn: DateTime.utc().toISO(),
      },
    })
    setLoading(false)
  }

  const imageList = useMemo(
    () => (vessel?.imageList ?? []).map((url) => ({ original: url })),
    [vessel]
  )

  const [imageLoading, setImageLoading] = useState(true)
  return (
    <Fragment>
      <div className={styles.infoContainer}>
        {vessel && (
          <div className={styles.imageAndFields}>
            {imageList.length > 0 && (
              <ImageGallery
                items={imageList}
                onImageLoad={() => setImageLoading(false)}
                showThumbnails={false}
                showBullets={true}
                slideDuration={5000}
                showPlayButton={imageList.length > 1}
                additionalClass={cx(styles.imageGallery, { [styles.loading]: imageLoading })}
              />
            )}
            <div className={styles.identifiers}>
              <InfoField
                vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                label={VesselFieldLabel.name}
                value={vessel.shipname}
                valuesHistory={vessel.history.shipname.byDate}
              ></InfoField>
              <InfoField
                vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                label={VesselFieldLabel.type}
                value={vessel.vesselType}
                valuesHistory={vessel.history.vesselType.byDate}
                helpText={
                  <Trans i18nKey="vessel.vesselTypeDescription">
                    For vessel type sourced from Global Fishing Watch additional research and
                    analysis is conducted in addition to using the original AIS data to identify the
                    most likely value. Vessel types from GFW include fishing vessels, carrier
                    vessels, and support vessels. The vessel classification for fishing vessel is
                    estimated using known registry information in combination with a convolutional
                    neural network used to estimate vessel class. The vessel classifcation for
                    carrier vessels is estimated using a cumulation of known registry information,
                    manual review, and vessel class. All support vessels in the Vessel Viewer are
                    considered Purse Seine Support Vessels based on internal review.
                  </Trans>
                }
              ></InfoField>
              <InfoField
                vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                label={VesselFieldLabel.flag}
                value={vessel.flag}
                valuesHistory={vessel.history.flag.byDate}
              ></InfoField>
              <InfoField
                vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                label={VesselFieldLabel.mmsi}
                value={vessel.mmsi}
                valuesHistory={vessel.history.mmsi.byDate}
              ></InfoField>
              <InfoField
                vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                label={VesselFieldLabel.imo}
                value={vessel.imo}
                hideTMTDate={true}
                valuesHistory={vessel.history.imo.byDate}
              ></InfoField>
              <InfoField
                vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                label={VesselFieldLabel.callsign}
                value={vessel.callsign}
                valuesHistory={vessel.history.callsign.byDate}
              ></InfoField>
              <InfoField
                vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                label={VesselFieldLabel.geartype}
                value={vessel.geartype}
                valuesHistory={vessel.history.geartype.byDate}
                helpText={
                  <Trans i18nKey="vessel.geartypeDescription">
                    Likely gear type of vessel as defined by Global Fishing Watch. The vessel
                    classification for fishing vessel is estimated using known registry information
                    in combination with a convolutional neural network used to estimate vessel
                    class, see more information here:
                    <a
                      href="https://globalfishingwatch.org/datasets-and-code-vessel-identity/"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      https://globalfishingwatch.org/datasets-and-code-vessel-identity/
                    </a>{' '}
                    . The vessel classifcation for carrier vessels is estimated using a cumulation
                    of known registry information. All support vessels in the Vessel Viewer are
                    considered Purse Seine Support Vessels based on internal review.
                  </Trans>
                }
              ></InfoField>
              <InfoField
                vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                label={VesselFieldLabel.length}
                value={vessel.length}
                hideTMTDate={true}
                valuesHistory={vessel.history.length.byDate}
              ></InfoField>
              <InfoField
                vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                label={VesselFieldLabel.grossTonnage}
                value={vessel.grossTonnage}
                hideTMTDate={true}
                valuesHistory={vessel.history.grossTonnage.byDate}
              ></InfoField>
              <InfoField
                vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                label={VesselFieldLabel.depth}
                value={vessel.depth}
                hideTMTDate={true}
                valuesHistory={vessel.history.depth.byDate}
              ></InfoField>
              <AuthorizationsField
                vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                label={VesselFieldLabel.authorizations}
                authorizations={vessel?.authorizations}
              ></AuthorizationsField>
              <InfoField
                vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                label={VesselFieldLabel.builtYear}
                hideTMTDate={true}
                value={vessel.builtYear}
              ></InfoField>
              <InfoField
                vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                label={VesselFieldLabel.owner}
                value={vessel.owner}
                valuesHistory={vessel.history.owner.byDate}
              ></InfoField>
              <InfoField
                vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                label={VesselFieldLabel.operator}
                value={vessel.operator}
                valuesHistory={vessel.history.operator.byDate}
              ></InfoField>

              {!isMergedVesselsView && (
                <div className={styles.identifierField}>
                  <label>{t(`vessel.aisTransmission_plural`, 'AIS Transmissions')}</label>
                  <div>
                    {vessel.firstTransmissionDate || vessel.lastTransmissionDate ? (
                      <Fragment>
                        {t('common.from', 'from')}{' '}
                        {vessel.firstTransmissionDate ? (
                          <I18nDate date={vessel.firstTransmissionDate} />
                        ) : (
                          DEFAULT_EMPTY_VALUE
                        )}{' '}
                        {t('common.to', 'to')}{' '}
                        {vessel.lastTransmissionDate ? (
                          <I18nDate date={vessel.lastTransmissionDate} />
                        ) : (
                          DEFAULT_EMPTY_VALUE
                        )}
                      </Fragment>
                    ) : (
                      DEFAULT_EMPTY_VALUE
                    )}
                  </div>
                </div>
              )}
              <InfoField
                vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                label={VesselFieldLabel.iuuStatus}
                value={
                  vessel.iuuStatus !== undefined
                    ? t(
                        `vessel.iuuStatusOptions.${vessel.iuuStatus}` as any,
                        vessel.iuuStatus.toString()
                      )
                    : DEFAULT_EMPTY_VALUE
                }
                valuesHistory={[]}
                helpText={
                  <Trans i18nKey="vessel.iuuStatusDescription">
                    [TDB] IUU status description to be defined
                  </Trans>
                }
              ></InfoField>
            </div>
          </div>
        )}
        <div className={styles.actions}>
          {vessel && offlineVessel && (
            <Fragment>
              <div className={styles.readyForOffline}>
                {t('vessel.readyForOfflineView', 'READY FOR OFFLINE VIEW')}
              </div>
              <IconButton
                size="default"
                icon="delete"
                type="warning"
                className={cx(styles.defaultIcon, styles.remove)}
                loading={loading}
                tooltip={t('vessel.remove', 'Remove')}
                tooltipPlacement={'top'}
                onClick={() => onDeleteClick(offlineVessel)}
              />
            </Fragment>
          )}
          {vessel && !isMergedVesselsView && !offlineVessel && (
            <Button
              className={styles.saveButton}
              type="secondary"
              disabled={loading}
              onClick={() => onSaveClick(vessel)}
            >
              {t('vessel.saveForOfflineView', 'SAVE VESSEL FOR OFFLINE VIEW')}
            </Button>
          )}
          {isMergedVesselsView && (
            <Button className={styles.saveButton} type="secondary" disabled={true}>
              {t(
                'vessel.offlineStillNotAllowedOnMergedVessels',
                'OFFLINE VIEW NOT ALLOWED ON MERGED VESSELS'
              )}
            </Button>
          )}
        </div>
        <Highlights onMoveToMap={props.onMoveToMap}></Highlights>
      </div>
    </Fragment>
  )
}

export default Info
