import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { saveAs } from 'file-saver'
import { IconButton } from '@globalfishingwatch/ui-components'
import { VesselRegistryOwner } from '@globalfishingwatch/api-types'
import I18nDate from 'features/i18n/i18nDate'
import { IDENTITY_FIELD_GROUPS, REGISTRY_FIELD_GROUPS } from 'features/vessel/vessel.config'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { getCurrentIdentityVessel, parseVesselToCSV } from 'features/vessel/vessel.utils'
import { selectVesselIdentityIndex } from 'features/vessel/vessel.config.selectors'
import VesselIdentitySelector from 'features/vessel/identity/VesselIdentitySelector'
import VesselIdentityField from 'features/vessel/identity/VesselIdentityField'
import { VesselIdentitySourceEnum } from 'features/search/search.config'
import styles from './VesselIdentity.module.css'

const VesselIdentity = () => {
  const { t } = useTranslation()
  const identityIndex = useSelector(selectVesselIdentityIndex)
  const vesselData = useSelector(selectVesselInfoData)

  const vesselIdentity = getCurrentIdentityVessel(vesselData, {
    identityIndex,
  })

  const onDownloadClick = () => {
    if (vesselIdentity) {
      const data = parseVesselToCSV(vesselIdentity)
      const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, `${vesselIdentity?.shipname}-${vesselIdentity?.flag}.csv`)
    }
  }

  const identitySource = vesselData?.identities[identityIndex]
    ?.identitySource as VesselIdentitySourceEnum
  const title = t(`vessel.identity.${identitySource}`, `${identitySource} identity`)

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h3>
          <label>
            {title} (<I18nDate date={vesselIdentity.transmissionDateFrom} /> -{' '}
            <I18nDate date={vesselIdentity.transmissionDateTo} />)
            <DataTerminology size="tiny" type="default" title={title}>
              {t('vessel.terminology.registryInfo', 'registry info terminology')}
            </DataTerminology>
          </label>
        </h3>
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
          {IDENTITY_FIELD_GROUPS.map((fieldGroup, index) => (
            <div key={index} className={styles.fieldGroup}>
              {/* TODO: make fields more dynamic to account for VMS */}
              {fieldGroup.map((field) => {
                return (
                  <div key={field.key}>
                    <label>
                      {t(`vessel.${field.label}` as any, field.label)}
                      {field.terminologyKey && (
                        <DataTerminology
                          size="tiny"
                          type="default"
                          title={t(`vessel.${field.label}` as any, field.label)}
                        >
                          {t(field.terminologyKey as any, field.terminologyKey)}
                        </DataTerminology>
                      )}
                    </label>
                    <VesselIdentityField
                      value={formatInfoField(vesselIdentity[field.key], field.label)}
                    />
                  </div>
                )
              })}
            </div>
          ))}
          {REGISTRY_FIELD_GROUPS.map(({ key, label }, index) => {
            const filteredRegistryInfo = vesselIdentity[key]
            if (!filteredRegistryInfo) return null
            return (
              <div className={styles.fieldGroup} key={index}>
                <div className={styles.threeCells}>
                  <label>{t(`vessel.${label}` as any, label)}</label>
                  {filteredRegistryInfo?.length > 0 ? (
                    <ul>
                      {filteredRegistryInfo.map((registry, index) => {
                        const value =
                          key === 'registryOwners'
                            ? `${(registry as VesselRegistryOwner).name} (${formatInfoField(
                                (registry as VesselRegistryOwner).flag,
                                'flag'
                              )})`
                            : registry.sourceCode.join(',')
                        const fieldType = key === 'registryOwners' ? 'owner' : 'authorization'
                        return (
                          <li key={`${key}-${index}`}>
                            <VesselIdentityField value={formatInfoField(value, fieldType)} /> {'  '}
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
              </div>
            )
          })}
        </div>
      )}
      <VesselIdentitySelector />
    </div>
  )
}

export default VesselIdentity
