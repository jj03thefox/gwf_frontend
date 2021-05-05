import { Vessel } from '@globalfishingwatch/api-types/dist'
import { ExtendedFeatureVessel } from 'features/map/map.slice'
import { t } from '../features/i18n/i18n'

export const EMPTY_FIELD_PLACEHOLDER = '---'

export const formatInfoField = (fieldValue: string, type: string) => {
  if (type === 'name')
    return fieldValue.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
  if (type === 'fleet') {
    const fleetClean = fieldValue.replaceAll('_', ' ')
    return fleetClean.charAt(0).toUpperCase() + fleetClean.slice(1)
  }
  return fieldValue
}

export const formatNumber = (num: string | number) => {
  const number = typeof num === 'string' ? parseFloat(num) : num
  return number.toLocaleString(undefined, {
    maximumFractionDigits: number < 10 ? 2 : 0,
  })
}

export const getVesselLabel = (vessel: ExtendedFeatureVessel | Vessel, withGearType = false) => {
  if (vessel.shipname && vessel.geartype && withGearType)
    return `${formatInfoField(vessel.shipname, 'name')} (${t(
      `vessel.gearTypes.${vessel.geartype}` as any,
      EMPTY_FIELD_PLACEHOLDER
    )})`
  if (vessel.shipname) return formatInfoField(vessel.shipname, 'name')
  if (vessel.registeredGearType) {
    return `${t('vessel.unkwownVesselByGeartype', {
      gearType: vessel.registeredGearType,
    })}`
  }
  return `${t('common.unknown', 'Unknown')} ${t('common.vessel', 'Vessel')}`
}
