import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { saveAs } from 'file-saver'
import { Fragment, useEffect, useMemo } from 'react'
import { uniq } from 'lodash'
import { IconButton, Tab, Tabs, TabsProps, Tooltip } from '@globalfishingwatch/ui-components'
import {
  SourceCode,
  VesselRegistryOwner,
  VesselRegistryProperty,
  VesselType,
} from '@globalfishingwatch/api-types'
import I18nDate, { formatI18nDate } from 'features/i18n/i18nDate'
import {
  CUSTOM_VMS_IDENTITY_FIELD_GROUPS,
  IDENTITY_FIELD_GROUPS,
  REGISTRY_FIELD_GROUPS,
} from 'features/vessel/vessel.config'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import {
  filterRegistryInfoByDateAndSSVID,
  getCurrentIdentityVessel,
  parseVesselToCSV,
} from 'features/vessel/vessel.utils'
import {
  selectVesselIdentityIndex,
  selectVesselIdentitySource,
} from 'features/vessel/vessel.config.selectors'
import VesselIdentitySelector from 'features/vessel/identity/VesselIdentitySelector'
import VesselIdentityField from 'features/vessel/identity/VesselIdentityField'
import { VesselIdentitySourceEnum } from 'features/search/search.config'
import { useLocationConnect } from 'routes/routes.hook'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectIsVesselLocation } from 'routes/routes.selectors'
import { useRegionTranslationsById } from 'features/regions/regions.hooks'
import styles from './VesselIdentity.module.css'

const VesselIdentity = () => {
  const { t } = useTranslation()
  const vesselData = useSelector(selectVesselInfoData)
  const identityIndex = useSelector(selectVesselIdentityIndex)
  const identitySource = useSelector(selectVesselIdentitySource)
  const isStandaloneVesselLocation = useSelector(selectIsVesselLocation)
  const { getRegionTranslationsById } = useRegionTranslationsById()
  const { dispatchQueryParams } = useLocationConnect()
  const { setTimerange } = useTimerangeConnect()

  const vesselIdentity = getCurrentIdentityVessel(vesselData, {
    identityIndex,
    identitySource,
  })

  const onTabClick: TabsProps<VesselIdentitySourceEnum>['onTabClick'] = (tab) => {
    dispatchQueryParams({ vesselIdentityIndex: 0, vesselIdentitySource: tab.id })
  }

  const onTimeRangeClick = () => {
    setTimerange({
      start: vesselIdentity.transmissionDateFrom,
      end: vesselIdentity.transmissionDateTo,
    })
  }

  const onDownloadClick = () => {
    if (vesselIdentity) {
      const timerange = {
        start: vesselIdentity.transmissionDateFrom,
        end: vesselIdentity.transmissionDateTo,
      }
      const filteredVesselIdentity = {
        ...vesselIdentity,
        nShipname: formatInfoField(vesselIdentity.shipname, 'shipname'),
        flag: t(`flags:${vesselIdentity.flag}`, vesselIdentity.flag),
        shiptype: t(
          `vessel.vesselTypes.${vesselIdentity.shiptype?.toLowerCase()}`,
          vesselIdentity.shiptype
        ) as VesselType,
        geartype: vesselIdentity.geartype?.map((gear) =>
          t(`vessel.gearTypes.${gear.toLowerCase()}`, gear.toLowerCase())
        ),
        registryAuthorizations:
          vesselIdentity.registryAuthorizations &&
          filterRegistryInfoByDateAndSSVID(
            vesselIdentity.registryAuthorizations,
            timerange,
            vesselIdentity.ssvid
          ),
        registryOwners:
          vesselIdentity.registryOwners &&
          (filterRegistryInfoByDateAndSSVID(
            vesselIdentity.registryOwners,
            timerange,
            vesselIdentity.ssvid
          ) as VesselRegistryOwner[]),
      }
      const data = parseVesselToCSV(filteredVesselIdentity)
      const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, `${vesselIdentity?.shipname}-${vesselIdentity?.flag}.csv`)
    }
  }

  const registryDisabled = !vesselData.identities.some(
    (i) => i.identitySource === VesselIdentitySourceEnum.Registry
  )
  const selfReportedIdentities = vesselData.identities.filter(
    (i) => i.identitySource === VesselIdentitySourceEnum.SelfReported
  )

  useEffect(() => {
    if (identitySource === VesselIdentitySourceEnum.Registry && registryDisabled) {
      dispatchQueryParams({
        vesselIdentitySource: VesselIdentitySourceEnum.SelfReported,
        vesselIdentityIndex: 0,
      })
    }
  }, [dispatchQueryParams, identitySource, registryDisabled])

  const identityTabs: Tab<VesselIdentitySourceEnum>[] = useMemo(
    () => [
      {
        id: VesselIdentitySourceEnum.Registry,
        title: t('vessel.infoSources.registry', 'Registry'),
        disabled: registryDisabled,
      },
      {
        id: VesselIdentitySourceEnum.SelfReported,
        title: uniq(selfReportedIdentities.flatMap((i) => i.sourceCode)).join(','),
        disabled: selfReportedIdentities.length === 0,
      },
    ],
    [registryDisabled, selfReportedIdentities, t]
  )

  const identityFields = useMemo(() => {
    const source = vesselIdentity.sourceCode?.[0] as SourceCode
    const customIdentityFields = CUSTOM_VMS_IDENTITY_FIELD_GROUPS[source]
    return customIdentityFields?.length
      ? [...IDENTITY_FIELD_GROUPS[identitySource], ...customIdentityFields]
      : IDENTITY_FIELD_GROUPS[identitySource]
  }, [identitySource, vesselIdentity?.sourceCode])

  return (
    <Fragment>
      <Tabs tabs={identityTabs} activeTab={identitySource} onTabClick={onTabClick} />
      <div className={styles.container}>
        <div className={cx(styles.fieldGroup)}>
          {identitySource === VesselIdentitySourceEnum.Registry && (
            <div>
              <label>{t('vessel.registrySources', 'Registry Sources')}</label>
              <Tooltip content={vesselIdentity?.sourceCode.join(', ')}>
                <VesselIdentityField
                  className={styles.help}
                  value={`${vesselIdentity?.sourceCode.slice(0, 3).join(', ')}${
                    vesselIdentity?.sourceCode.length > 3 ? '...' : ''
                  }`}
                />
              </Tooltip>
            </div>
          )}
          <div>
            <div>
              <label>{t(`common.date_other`, 'Dates')}</label>
              <div className={styles.timerange}>
                <VesselIdentityField
                  value={`${formatI18nDate(vesselIdentity.transmissionDateFrom)} - ${formatI18nDate(
                    vesselIdentity.transmissionDateTo
                  )}`}
                />
                {isStandaloneVesselLocation && (
                  <IconButton
                    size="small"
                    icon="fit-to-timerange"
                    tooltip={t('timebar.fitOnThisDates', 'Fit time range to these dates')}
                    className="print-hidden"
                    onClick={onTimeRangeClick}
                  />
                )}
              </div>
            </div>
          </div>
          <div className={styles.actionsContainer}>
            <IconButton
              type="border"
              icon="download"
              size="medium"
              className="print-hidden"
              onClick={onDownloadClick}
              tooltip={t('download.dataDownload', 'Download Data')}
              tooltipPlacement="top"
            />
            {/* <Button
            className={styles.actionButton}
            disabled
            type="border-secondary"
            size="small"
            tooltip={t('common.comingSoon', 'Coming Soon!')}
            tooltipPlacement="top"
          >
            {t('vessel.identityCalendar', 'See as calendar')} <Icon icon="history" />
          </Button> */}
          </div>
        </div>
        {vesselIdentity && (
          <div className={styles.fields}>
            {identityFields?.map((fieldGroup, index) => (
              <div key={index} className={cx(styles.fieldGroupContainer, styles.fieldGroup)}>
                {/* TODO: make fields more dynamic to account for VMS */}
                {fieldGroup.map((field) => {
                  const label = field.label || field.key
                  return (
                    <div key={field.key}>
                      <div className={styles.labelContainer}>
                        <label>{t(`vessel.${label}` as any, label)}</label>
                        {field.terminologyKey && (
                          <DataTerminology
                            size="tiny"
                            type="default"
                            title={t(`vessel.${label}`, label) as string}
                          >
                            {t(field.terminologyKey as any, field.terminologyKey)}
                          </DataTerminology>
                        )}
                      </div>
                      <VesselIdentityField
                        value={formatInfoField(vesselIdentity[field.key], label)}
                      />
                    </div>
                  )
                })}
              </div>
            ))}
            {identitySource === VesselIdentitySourceEnum.Registry &&
              REGISTRY_FIELD_GROUPS.map(({ key, label, terminologyKey }, index) => {
                const allRegistryInfo = vesselIdentity[key]
                if (!allRegistryInfo) return null
                const timerange = {
                  start: vesselIdentity.transmissionDateFrom,
                  end: vesselIdentity.transmissionDateTo,
                }
                const filteredRegistryInfo = filterRegistryInfoByDateAndSSVID(
                  vesselIdentity[key] as VesselRegistryProperty[],
                  timerange,
                  vesselIdentity.ssvid
                )
                if (!filteredRegistryInfo) return null
                return (
                  <div className={styles.fieldGroupContainer} key={key}>
                    <div className={styles.labelContainer}>
                      <label className={styles.twoCells}>
                        {t(`vessel.${label}` as any, label)}
                      </label>
                      {terminologyKey && (
                        <DataTerminology
                          size="tiny"
                          type="default"
                          title={t(`vessel.${label}` as any, label)}
                        >
                          {t(terminologyKey as any, terminologyKey)}
                        </DataTerminology>
                      )}
                    </div>
                    {allRegistryInfo?.length > 0 ? (
                      <ul className={cx(styles.fieldGroup, styles.twoColumns)}>
                        {allRegistryInfo.map((registry, index) => {
                          const registryOverlapsTimeRange = filteredRegistryInfo.includes(registry)
                          const fieldType = key === 'registryOwners' ? 'owner' : 'authorization'
                          let Component = <VesselIdentityField value="" />
                          if (registryOverlapsTimeRange) {
                            if (fieldType === 'owner') {
                              const value = `${formatInfoField(
                                (registry as VesselRegistryOwner).name,
                                'owner'
                              )} (${formatInfoField(
                                (registry as VesselRegistryOwner).flag,
                                'flag'
                              )})`
                              Component = <VesselIdentityField value={value} />
                            } else {
                              const sourceTranslations = registry.sourceCode
                                .map(getRegionTranslationsById)
                                .join(',')
                              Component = (
                                <Tooltip content={sourceTranslations}>
                                  <VesselIdentityField
                                    className={styles.help}
                                    value={formatInfoField(
                                      registry.sourceCode.join(','),
                                      fieldType
                                    )}
                                  />
                                </Tooltip>
                              )
                            }
                          }
                          return (
                            <li
                              key={`${registry.recordId}-${index}`}
                              className={cx({
                                [styles.twoCells]: key === 'registryOwners',
                                [styles.hidden]: !registryOverlapsTimeRange,
                              })}
                            >
                              {Component}{' '}
                              <span className={styles.secondary}>
                                <I18nDate date={registry.dateFrom} /> -{' '}
                                <I18nDate date={registry.dateTo} />
                              </span>
                            </li>
                          )
                        })}
                      </ul>
                    ) : (
                      EMPTY_FIELD_PLACEHOLDER
                    )}
                  </div>
                )
              })}
          </div>
        )}
        <VesselIdentitySelector />
      </div>
    </Fragment>
  )
}

export default VesselIdentity
