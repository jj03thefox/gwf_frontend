import React, { Fragment } from 'react'
import { event as uaEvent } from 'react-ga'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Spinner, IconButton, Tooltip } from '@globalfishingwatch/ui-components'
import { DatasetTypes, DataviewInstance } from '@globalfishingwatch/api-types'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField, getVesselLabel } from 'utils/info'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import {
  getPresenceVesselDataviewInstance,
  getVesselDataviewInstance,
  getVesselInWorkspace,
} from 'features/dataviews/dataviews.utils'
import { getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import I18nNumber from 'features/i18n/i18nNumber'
import {
  SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION,
  TooltipEventFeature,
  useClickedEventConnect,
} from 'features/map/map.hooks'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { ExtendedFeatureVessel } from 'features/map/map.slice'
import { getEventLabel } from 'utils/analytics'
import { AsyncReducerStatus } from 'utils/async-slice'
import { isGFWUser } from 'features/user/user.slice'
import { PRESENCE_DATASET_ID, PRESENCE_TRACKS_DATASET_ID } from 'features/datasets/datasets.slice'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import { useMapContext } from '../map-context.hooks'
import popupStyles from './Popup.module.css'
import styles from './FishingLayers.module.css'

type FishingTooltipRowProps = {
  feature: TooltipEventFeature
  showFeaturesDetails: boolean
}
function FishingTooltipRow({ feature, showFeaturesDetails }: FishingTooltipRowProps) {
  const { t } = useTranslation()
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const { fishingInteractionStatus } = useClickedEventConnect()
  const gfwUser = useSelector(isGFWUser)
  const vessels = useSelector(selectActiveTrackDataviews)
  const { eventManager } = useMapContext()

  const onVesselClick = (
    ev: React.MouseEvent<Element, MouseEvent>,
    vessel: ExtendedFeatureVessel
  ) => {
    eventManager.once('click', (e: any) => e.stopPropagation(), ev.target)

    const vesselInWorkspace = getVesselInWorkspace(vessels, vessel.id)
    if (vesselInWorkspace) {
      deleteDataviewInstance(vesselInWorkspace.id)
      return
    }

    let vesselDataviewInstance: DataviewInstance | undefined
    if (
      gfwUser &&
      vessel.dataset?.id.includes(PRESENCE_DATASET_ID) &&
      vessel.trackDataset?.id.includes(PRESENCE_TRACKS_DATASET_ID)
    ) {
      vesselDataviewInstance = getPresenceVesselDataviewInstance(vessel, {
        trackDatasetId: vessel.trackDataset?.id,
        infoDatasetId: vessel.infoDataset?.id,
      })
    } else {
      const vesselEventsDatasets = getRelatedDatasetsByType(vessel.dataset, DatasetTypes.Events)
      const eventsDatasetsId =
        vesselEventsDatasets && vesselEventsDatasets?.length
          ? vesselEventsDatasets.map((d) => d.id)
          : []

      vesselDataviewInstance = getVesselDataviewInstance(vessel, {
        trackDatasetId: vessel.trackDataset?.id,
        infoDatasetId: vessel.infoDataset?.id,
        ...(eventsDatasetsId.length > 0 && { eventsDatasetsId }),
      })
    }

    upsertDataviewInstance(vesselDataviewInstance)

    uaEvent({
      category: 'Tracks',
      action: 'Click in vessel from grid cell panel',
      label: getEventLabel([vessel.dataset.id, vessel.id]),
    })
  }

  return (
    <div className={popupStyles.popupSection}>
      <span className={popupStyles.popupSectionColor} style={{ backgroundColor: feature.color }} />
      <div className={popupStyles.popupSectionContent}>
        {showFeaturesDetails && (
          <h3 className={popupStyles.popupSectionTitle}>
            {feature.title}
            {feature.temporalgrid && feature.temporalgrid.interval === '10days' && (
              <span>
                {' '}
                {t('common.dateRange', {
                  start: formatI18nDate(feature.temporalgrid.visibleStartDate),
                  end: formatI18nDate(feature.temporalgrid.visibleEndDate),
                  defaultValue: 'between {{start}} and {{end}}',
                })}
              </span>
            )}
          </h3>
        )}
        <div className={popupStyles.row}>
          <span className={popupStyles.rowText}>
            <I18nNumber number={feature.value} />{' '}
            {t([`common.${feature.temporalgrid?.unit}` as any, 'common.hour'], 'hours', {
              count: parseInt(feature.value), // neded to select the plural automatically
            })}
          </span>
        </div>
        {fishingInteractionStatus === AsyncReducerStatus.Loading && (
          <div className={popupStyles.loading}>
            <Spinner size="small" />
          </div>
        )}

        {feature.vesselsInfo && (
          <Fragment>
            <table className={styles.vesselsTable}>
              <thead>
                <tr>
                  <th colSpan={2}>{t('common.vessel_other', 'Vessels')}</th>
                  <th>{t('common.flag_short', 'iso3')}</th>
                  <th>{t('common.gearType_short', 'gear')}</th>
                  <th>{t('common.source_short', 'source')}</th>
                  <th className={styles.vesselsTableHeaderRight}>
                    {feature.temporalgrid?.unit === 'hours' && t('common.hour_other', 'hours')}
                    {feature.temporalgrid?.unit === 'days' && t('common.days_other', 'days')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {feature.vesselsInfo.vessels.map((vessel, i) => {
                  const vesselName = formatInfoField(vessel.shipname, 'name')
                  const vesselGearType = `${t(
                    `vessel.gearTypes.${vessel.geartype}` as any,
                    EMPTY_FIELD_PLACEHOLDER
                  )}`

                  const interactionAllowed =
                    SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION.includes(
                      feature.temporalgrid?.sublayerInteractionType || ''
                    )
                  const hasDatasets =
                    vessel.infoDataset !== undefined || vessel.trackDataset !== undefined

                  const vesselInWorkspace = getVesselInWorkspace(vessels, vessel.id)

                  const pinTrackDisabled = !interactionAllowed || !hasDatasets
                  return (
                    <tr key={i}>
                      <td>
                        {!pinTrackDisabled && (
                          <IconButton
                            icon={vesselInWorkspace ? 'pin-filled' : 'pin'}
                            style={{
                              color: vesselInWorkspace ? vesselInWorkspace.config.color : '',
                            }}
                            tooltip={
                              vesselInWorkspace
                                ? t(
                                    'search.vesselAlreadyInWorkspace',
                                    'This vessel is already in your workspace'
                                  )
                                : t('search.seeVessel', 'See vessel')
                            }
                            onClick={(e) => onVesselClick(e, vessel)}
                            size="small"
                            className={styles.vesselsPinButton}
                          />
                        )}
                      </td>
                      <td className={styles.vesselsTableColLarge}>{vesselName}</td>
                      <td className={styles.vesselsTableColSmall}>
                        <Tooltip content={t(`flags:${vessel.flag}`)}>
                          <span>{vessel.flag}</span>
                        </Tooltip>
                      </td>
                      <td className={styles.vesselsTableColLarge}>{vesselGearType}</td>
                      {vessel.dataset && vessel.dataset.name && (
                        <td className={styles.vesselsTableColMedium}>{vessel.dataset.name}</td>
                      )}
                      <td className={cx(styles.vesselsTableColSmall, styles.vesselsTableHour)}>
                        <I18nNumber number={vessel.hours} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {feature.vesselsInfo.overflow && (
              <div className={styles.vesselsMore}>
                + {feature.vesselsInfo.numVessels - feature.vesselsInfo.vessels.length}{' '}
                {t('common.more', 'more')}
              </div>
            )}
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default FishingTooltipRow
