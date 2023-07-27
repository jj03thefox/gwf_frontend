import { get } from 'lodash'
import { IdentityVessel, Vessel } from '@globalfishingwatch/api-types'
import { ExtendedFeatureVessel } from 'features/map/map.slice'
import { VesselRenderField } from 'features/vessel/vessel.config'
import { t } from '../features/i18n/i18n'

export const EMPTY_FIELD_PLACEHOLDER = '---'

export const upperFirst = (text: string) =>
  text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()

export const formatInfoField = (fieldValue: string, type: string, translationFn = t) => {
  if (fieldValue) {
    if (type === 'flag' || type === 'ownerFlag') {
      return translationFn(`flags:${fieldValue}` as any, fieldValue)
    }
    if (type === 'shiptype' || type === 'vesselType') {
      return translationFn(
        `vessel.vesselTypes.${fieldValue.toLocaleLowerCase()}` as any,
        fieldValue
      )
    }
    if (type === 'geartype') {
      return translationFn(`vessel.gearTypes.${fieldValue.toLocaleLowerCase()}` as any, fieldValue)
    }
    if (!fieldValue && (type === 'name' || type === 'shipname')) {
      return translationFn('common.unknownVessel', 'Unknown Vessel')
    }
    if (type === 'name' || type === 'shipname') {
      return fieldValue.replace(/\b(?![LXIVCDM]+\b)([A-Z,Ñ]+)\b/g, upperFirst)
    }
    if (type === 'fleet') {
      const fleetClean = fieldValue.replaceAll('_', ' ')
      return fleetClean.charAt(0).toUpperCase() + fleetClean.slice(1)
    }
    return fieldValue
  }
  return EMPTY_FIELD_PLACEHOLDER
}

export const formatAdvancedInfoField = (
  vessel: Vessel,
  field: VesselRenderField,
  translationFn = t
) => {
  const key = field.key.includes('.') ? field.key.split('.')[1] : field.key
  return formatInfoField(get(vessel, field.key), key, translationFn)
}

export const formatNumber = (num: string | number, maximumFractionDigits?: number) => {
  const number = typeof num === 'string' ? parseFloat(num) : num
  return number.toLocaleString(undefined, {
    maximumFractionDigits: maximumFractionDigits || (number < 10 ? 2 : 0),
  })
}

export const getVesselLabel = (
  vessel: ExtendedFeatureVessel | IdentityVessel,
  withGearType = false
) => {
  if (!vessel) return t('common.unknownVessel', 'Unknown vessel')
  const vesselInfo = vessel.registryInfo?.length
    ? vessel.registryInfo?.[0]
    : vessel.selfReportedInfo?.[0]
  if (vesselInfo.shipname && vesselInfo.geartype && vesselInfo.flag && withGearType) {
    return `${formatInfoField(vesselInfo.shipname, 'name')}
    (${t(`flags:${vesselInfo.flag}`)}, ${t(
      `vessel.gearTypes.${vesselInfo.geartype}` as any,
      EMPTY_FIELD_PLACEHOLDER
    )})`
  }
  if (vesselInfo.shipname) return formatInfoField(vesselInfo.shipname, 'name')
  if (vesselInfo.registeredGearType) {
    return `${t('vessel.unkwownVesselByGeartype', {
      gearType: vesselInfo.registeredGearType,
    })}`
  }
  return t('common.unknownVessel', 'Unknown vessel')
}

// 'any' is used here as timestamp is not declared in Vessel anyways
export const getDetectionsTimestamps = (vessel: any) => {
  return vessel?.timestamp?.split(',').sort()
}
