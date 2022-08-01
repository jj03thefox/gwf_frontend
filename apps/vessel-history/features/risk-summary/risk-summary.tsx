import { Fragment, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Spinner } from '@globalfishingwatch/ui-components'
import { useUser } from 'features/user/user.hooks'
import RiskSection from 'features/risk-section/risk-section'
import RiskIndicator from 'features/risk-indicator/risk-indicator'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import ActivityModalContent from 'features/profile/components/activity/ActivityModalContent'
import useMapEvents from 'features/map/map-events.hooks'
import { EventTypeVoyage, Voyage } from 'types/voyage'
import useViewport from 'features/map/map-viewport.hooks'
import { DEFAULT_VESSEL_MAP_ZOOM } from 'data/config'
import TerminologyEncounterEvents from 'features/terminology/terminology-encounter-events'
import TerminologyFishingEvents from 'features/terminology/terminology-fishing-events'
import TerminologyIuu from 'features/terminology/terminology-iuu'
import TerminologyLoiteringEvents from 'features/terminology/terminology-loitering-events'
import useRiskIndicator from 'features/risk-indicator/risk-indicator.hook'
import TerminologyPortVisitEvents from 'features/terminology/terminology-port-visit-events'
import TerminologyRiskIdentity from 'features/terminology/terminology-risk-identity'
import RiskIdentityFlagsOnMouIndicator from 'features/risk-identity-flags-on-mou-indicator/risk-identity-flags-on-mou-indicator'
import RiskIdentityIndicator from 'features/risk-identity-indicator/risk-identity-indicator'
import { VesselFieldLabel } from 'types/vessel'
import styles from './risk-summary.module.css'

export interface RiskSummaryProps {
  onMoveToMap?: () => void
}

export function RiskSummary(props: RiskSummaryProps) {
  const { t } = useTranslation()
  const { authorizedInsurer } = useUser()
  const {
    encountersInForeignEEZ,
    encountersInMPA,
    encountersInRFMOWithoutAuthorization,
    encountersRFMOsAreasWithoutAuthorization,
    eventsLoading,
    fishingInMPA,
    fishingInRFMOWithoutAuthorization,
    fishingRFMOsAreasWithoutAuthorization,
    indicatorsLoading,
    iuuBlacklisted,
    loiteringInMPA,
    portVisitsToNonPSMAPortState,
    vesselFlagsOnMOU,
    flagsHistory,
    namesHistory,
    ownersHistory,
    uniqueFlags,
    uniqueNames,
    uniqueOwners,
    vessel,
  } = useRiskIndicator()
  const { highlightEvent } = useMapEvents()
  const { viewport, setMapCoordinates } = useViewport()

  const [isModalOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<RenderedEvent>()
  const openModal = useCallback((event: RenderedEvent) => {
    setSelectedEvent(event)
    setIsOpen(true)
  }, [])
  const closeModal = useCallback(() => setIsOpen(false), [])

  const onEventMapClick = useCallback(
    (event: RenderedEvent | Voyage) => {
      if (event.type !== EventTypeVoyage.Voyage) {
        highlightEvent(event)

        setMapCoordinates({
          latitude: event.position.lat,
          longitude: event.position.lon,
          zoom: viewport.zoom ?? DEFAULT_VESSEL_MAP_ZOOM,
          bearing: 0,
          pitch: 0,
        })
      }

      props.onMoveToMap && props.onMoveToMap()
    },
    [highlightEvent, props, setMapCoordinates, viewport.zoom]
  )
  const hasEncountersInForeignEEZs = encountersInForeignEEZ.length > 0
  const hasEncountersInMPAs = encountersInMPA.length > 0
  const hasEncountersInRFMOWithoutAuthorization = encountersInRFMOWithoutAuthorization.length > 0
  const encountersRFMOsWithoutAuth = useMemo(
    () => encountersRFMOsAreasWithoutAuthorization.join(', '),
    [encountersRFMOsAreasWithoutAuthorization]
  )

  const hasFishingInMPAs = fishingInMPA.length > 0
  const hasFishingInRFMOWithoutAuthorization = fishingInRFMOWithoutAuthorization.length > 0
  const fishingRFMOsWithoutAuth = useMemo(
    () => fishingRFMOsAreasWithoutAuthorization.join(', '),
    [fishingRFMOsAreasWithoutAuthorization]
  )
  const hasLoiteringInMPAs = loiteringInMPA.length > 0
  const hasPortVisitsToNonPSMAPortState = portVisitsToNonPSMAPortState.length > 0

  const hasVesselFlagsOnMOU = vesselFlagsOnMOU.length > 0
  const hasChangedFlags = uniqueFlags.length > 1
  const hasChangedNames = uniqueNames.length > 1
  const hasChangedOwners = uniqueOwners.length > 1

  const vesselFlagsPerMOU = useMemo(
    () => Array.from(new Set(vesselFlagsOnMOU.map((item) => item.name))),
    [vesselFlagsOnMOU]
  )

  const hasIUUIndicators = iuuBlacklisted

  if (!authorizedInsurer) return <Fragment />
  if (eventsLoading || indicatorsLoading) return <Spinner className={styles.spinnerFull} />
  const hasEncountersIndicators =
    hasEncountersInMPAs || hasEncountersInForeignEEZs || hasEncountersInRFMOWithoutAuthorization
  const hasFishingIndicators = hasFishingInMPAs || hasFishingInRFMOWithoutAuthorization
  return (
    <div className={styles['container']}>
      {hasIUUIndicators && (
        <RiskSection severity="high" title={t('event.iuu', 'iuu')} titleInfo={<TerminologyIuu />}>
          <RiskIndicator
            title={
              t(
                'risk.pastAppearanceInARfmoIUUList',
                '{{count}} past appearance in a RFMO IUU list',
                {
                  count: iuuBlacklisted ? 1 : 0,
                }
              ) as string
            }
            subtitle={' '}
          ></RiskIndicator>
        </RiskSection>
      )}
      {hasFishingIndicators && (
        <RiskSection
          severity="medium"
          title={t('event.fishing', 'fishing')}
          titleInfo={<TerminologyFishingEvents />}
        >
          {hasFishingInRFMOWithoutAuthorization && (
            <RiskIndicator
              title={
                t(
                  'risk.fishingEventInRFMOWithoutAuthorization',
                  '{{count}} fishing event outside known authorised area',
                  {
                    count: fishingInRFMOWithoutAuthorization.length,
                  }
                ) as string
              }
              // The list of regions will be visible once the dataset (proto)
              // that includes events authorizations is used to get the resources
              subtitle={!!fishingRFMOsWithoutAuth && `(${fishingRFMOsWithoutAuth})`}
              events={fishingInRFMOWithoutAuthorization}
              onEventInfoClick={openModal}
              onEventMapClick={onEventMapClick}
            ></RiskIndicator>
          )}
          {hasFishingInMPAs && (
            <RiskIndicator
              title={
                t('risk.fishingEventInMPA', 'fishing event in a MPA', {
                  count: fishingInMPA.length,
                }) as string
              }
              events={fishingInMPA}
              onEventInfoClick={openModal}
              onEventMapClick={onEventMapClick}
            ></RiskIndicator>
          )}
        </RiskSection>
      )}
      {hasEncountersIndicators && (
        <RiskSection
          severity="medium"
          title={t('event.encounter', 'encounter', { count: 2 })}
          titleInfo={<TerminologyEncounterEvents />}
        >
          {hasEncountersInRFMOWithoutAuthorization && (
            <RiskIndicator
              title={
                t(
                  'risk.encounterEventInRFMOWithoutAuthorization',
                  '{{count}} encounter outside known authorised area',
                  {
                    count: encountersInRFMOWithoutAuthorization.length,
                  }
                ) as string
              }
              // The list of regions will be visible once the dataset (proto)
              // that includes events authorizations is used to get the resources
              subtitle={!!encountersRFMOsWithoutAuth && `(${encountersRFMOsWithoutAuth})`}
              events={encountersInRFMOWithoutAuthorization}
              onEventInfoClick={openModal}
              onEventMapClick={onEventMapClick}
            ></RiskIndicator>
          )}
          {hasEncountersInMPAs && (
            <RiskIndicator
              title={
                t('risk.encounterEventInMPA', 'encounters in a MPA', {
                  count: encountersInMPA.length,
                }) as string
              }
              events={encountersInMPA}
              onEventInfoClick={openModal}
              onEventMapClick={onEventMapClick}
            ></RiskIndicator>
          )}
          {hasEncountersInForeignEEZs && (
            <RiskIndicator
              title={
                t('risk.encounterEventInForeignEEZ', 'encounters in a foreign EEZ', {
                  count: encountersInForeignEEZ.length,
                }) as string
              }
              events={encountersInForeignEEZ}
              onEventInfoClick={openModal}
              onEventMapClick={onEventMapClick}
            ></RiskIndicator>
          )}
        </RiskSection>
      )}
      {hasLoiteringInMPAs && (
        <RiskSection
          severity="medium"
          title={t('event.loitering', 'loitering')}
          titleInfo={<TerminologyLoiteringEvents />}
        >
          <RiskIndicator
            title={
              t('risk.loiteringEventInMPA', 'loitering event in a MPA', {
                count: loiteringInMPA.length,
              }) as string
            }
            events={loiteringInMPA}
            onEventInfoClick={openModal}
            onEventMapClick={onEventMapClick}
          ></RiskIndicator>
        </RiskSection>
      )}
      {hasPortVisitsToNonPSMAPortState && (
        <RiskSection
          severity="medium"
          title={t('event.portVisitEvents', 'Port Visits')}
          titleInfo={<TerminologyPortVisitEvents />}
        >
          <RiskIndicator
            title={
              t(
                'risk.portVisitsToNonPSMAPortState',
                '{{count}} visits to a port in a country that has not ratified the PSMA state',
                {
                  count: portVisitsToNonPSMAPortState.length,
                }
              ) as string
            }
            events={portVisitsToNonPSMAPortState}
            onEventInfoClick={openModal}
            onEventMapClick={onEventMapClick}
          ></RiskIndicator>
        </RiskSection>
      )}
      {(hasVesselFlagsOnMOU || hasChangedOwners || hasChangedFlags || hasChangedNames) && (
        <RiskSection
          severity="medium"
          title={t('risk.identity', 'Identity')}
          titleInfo={<TerminologyRiskIdentity />}
        >
          {vesselFlagsPerMOU.map((mou, index) => (
            <RiskIdentityFlagsOnMouIndicator
              key={`${mou}-${index}`}
              name={mou}
              flags={vesselFlagsOnMOU
                .filter((item) => item.name === mou)
                .map((item) => item.flags)
                .flat()}
              vesselName={vessel.shipname}
              flagsHistory={flagsHistory}
            ></RiskIdentityFlagsOnMouIndicator>
          ))}
          {hasChangedOwners && (
            <RiskIdentityIndicator
              field={VesselFieldLabel.owner}
              history={ownersHistory}
              title={
                t('risk.identityChangedOwners', '{{count}} owner change', {
                  count: uniqueOwners.length - 1,
                }) as string
              }
              subtitle={`(${uniqueOwners.join(', ')})`}
              vesselName={vessel.shipname}
            />
          )}
          {hasChangedFlags && (
            <RiskIdentityIndicator
              field={VesselFieldLabel.flag}
              history={flagsHistory}
              title={
                t('risk.identityChangedFlags', '{{count}} flag change', {
                  count: uniqueFlags.length - 1,
                }) as string
              }
              subtitle={`(${uniqueFlags.join(', ')})`}
              vesselName={vessel.shipname}
            />
          )}
          {hasChangedNames && (
            <RiskIdentityIndicator
              field={VesselFieldLabel.name}
              history={namesHistory}
              title={
                t('risk.identityChangedNames', '{{count}} name change', {
                  count: uniqueNames.length - 1,
                }) as string
              }
              subtitle={`(${uniqueNames.join(', ')})`}
              vesselName={vessel.shipname}
            />
          )}
        </RiskSection>
      )}
      {(!hasFishingIndicators ||
        !hasEncountersIndicators ||
        !hasLoiteringInMPAs ||
        !hasPortVisitsToNonPSMAPortState ||
        !hasVesselFlagsOnMOU ||
        !hasIUUIndicators) && (
        <RiskSection severity="none" title={t('risk.noRiskDetected', 'No risk detected') as string}>
          {!hasIUUIndicators && (
            <RiskSection className={styles.naSubSection} title={t('event.iuu', 'iuu')}>
              {!hasIUUIndicators && (
                <RiskIndicator
                  title={
                    iuuBlacklisted === false
                      ? (t(
                          'risk.noPastAppearancesInARFMOIUUList',
                          'The vessel has no past appearances in a RFMO IUU list'
                        ) as string)
                      : (t(
                          'risk.undeterminedPastAppearancesInARFMOIUUList',
                          'Unable to determine past appearances in a RFMO IUU list'
                        ) as string)
                  }
                ></RiskIndicator>
              )}
            </RiskSection>
          )}
          {(!hasFishingInMPAs || !hasFishingInRFMOWithoutAuthorization) && (
            <RiskSection className={styles.naSubSection} title={t('event.fishing', 'fishing')}>
              {!hasFishingInRFMOWithoutAuthorization && (
                <RiskIndicator
                  title={
                    t(
                      'risk.noFishingEventInRFMOWithoutAuthorization',
                      'No fishing event detected outside known authorised areas'
                    ) as string
                  }
                  events={fishingInRFMOWithoutAuthorization}
                  onEventInfoClick={openModal}
                  onEventMapClick={onEventMapClick}
                ></RiskIndicator>
              )}
              {!hasFishingInMPAs && (
                <RiskIndicator
                  title={
                    t('risk.noFishingEventInMPA', 'No fishing event detected in an MPA') as string
                  }
                  events={fishingInMPA}
                  onEventInfoClick={openModal}
                  onEventMapClick={onEventMapClick}
                ></RiskIndicator>
              )}
            </RiskSection>
          )}
          {(!hasEncountersInMPAs ||
            !hasEncountersInForeignEEZs ||
            !hasEncountersInRFMOWithoutAuthorization) && (
            <RiskSection
              className={styles.naSubSection}
              title={t('event.encounter', 'encounter', { count: 2 })}
            >
              {!hasEncountersInRFMOWithoutAuthorization && (
                <RiskIndicator
                  title={
                    t(
                      'risk.noEncounterEventInRFMOWithoutAuthorization',
                      'No encounters detected outside known authorised areas'
                    ) as string
                  }
                  events={encountersInRFMOWithoutAuthorization}
                  onEventInfoClick={openModal}
                  onEventMapClick={onEventMapClick}
                ></RiskIndicator>
              )}
              {!hasEncountersInMPAs && (
                <RiskIndicator
                  title={
                    t('risk.noEncounterEventInMPA', 'No encounters detected in an MPA') as string
                  }
                  events={encountersInMPA}
                  onEventInfoClick={openModal}
                  onEventMapClick={onEventMapClick}
                ></RiskIndicator>
              )}
              {!hasEncountersInForeignEEZs && (
                <RiskIndicator
                  title={
                    t(
                      'risk.noEncounterEventInForeignEEZ',
                      'No encounters detected in foreign EEZ'
                    ) as string
                  }
                  events={encountersInForeignEEZ}
                  onEventInfoClick={openModal}
                  onEventMapClick={onEventMapClick}
                ></RiskIndicator>
              )}
            </RiskSection>
          )}
          {!hasLoiteringInMPAs && (
            <RiskSection className={styles.naSubSection} title={t('event.loitering', 'loitering')}>
              <RiskIndicator
                title={
                  t('risk.noLoiteringEventInMPA', 'No loitering event detected in an MPA') as string
                }
                events={loiteringInMPA}
                onEventInfoClick={openModal}
                onEventMapClick={onEventMapClick}
              ></RiskIndicator>
            </RiskSection>
          )}
          {!hasPortVisitsToNonPSMAPortState && (
            <RiskSection
              className={styles.naSubSection}
              title={t('event.portVisitEvents', 'Port Visits')}
            >
              <RiskIndicator
                title={
                  t(
                    'risk.noPortVisitsToNonPSMAPortState',
                    'No visit to a port in a country that has not ratified the PSMA state detected'
                  ) as string
                }
                events={portVisitsToNonPSMAPortState}
                onEventInfoClick={openModal}
                onEventMapClick={onEventMapClick}
              ></RiskIndicator>
            </RiskSection>
          )}
          {(!hasVesselFlagsOnMOU || !hasChangedOwners || !hasChangedFlags || !hasChangedNames) && (
            <RiskSection className={styles.naSubSection} title={t('risk.identity', 'Identity')}>
              {!hasVesselFlagsOnMOU && (
                <RiskIndicator
                  title={
                    t(
                      'risk.noVesselFlagsOnMOU',
                      "The vessel's flag(s) are not listed on either the Paris or Tokyo MOU black or grey list"
                    ) as string
                  }
                ></RiskIndicator>
              )}
              {!hasChangedOwners && (
                <RiskIndicator
                  title={t('risk.noOwnerChanges', 'The vessel did not changed owners') as string}
                ></RiskIndicator>
              )}
              {!hasChangedFlags && (
                <RiskIndicator
                  title={t('risk.noFlagChanges', 'The vessel did not changed flags') as string}
                ></RiskIndicator>
              )}
              {!hasChangedNames && (
                <RiskIndicator
                  title={t('risk.noNameChanges', 'The vessel did not changed names') as string}
                ></RiskIndicator>
              )}
            </RiskSection>
          )}
        </RiskSection>
      )}
      <Modal
        appSelector="__next"
        title={selectedEvent?.description ?? ''}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        {selectedEvent && <ActivityModalContent event={selectedEvent}></ActivityModalContent>}
      </Modal>
    </div>
  )
}

export default RiskSummary
