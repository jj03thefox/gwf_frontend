import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ValueItem } from 'types'
import styles from './Info.module.css'
import InfoFieldHistory from './InfoFieldHistory'

export enum VesselFieldLabel {
  name = 'name',
  flag = 'flag',
  shipname = 'shipname',
  firstTransmissionDate = 'firstTransmissionDate',
  lastTransmissionDate = 'lastTransmissionDate',
  imo = 'imo',
  mmsi = 'mmsi',
  callsign = 'callsign',
  fleet = 'fleet',
  origin = 'origin',
  type = 'type',
  gearType = 'gearType',
  length = 'length',
  depth = 'depth',
  grossTonnage = 'grossTonnage',
  owner = 'owner',
  operator = 'operator',
  builtYear = 'builtYear',
  authorizations = 'authorizations',
  registeredGearType = 'registeredGearType',
}

enum VesselFieldLabelPlural {
  name = 'name_plural',
  flag = 'flag_plural',
  shipname = 'shipname_plural',
  firstTransmissionDate = 'firstTransmissionDate_plural',
  lastTransmissionDate = 'lastTransmissionDate_plural',
  imo = 'imo_plural',
  mmsi = 'mmsi_plural',
  callsign = 'callsign_plural',
  fleet = 'fleet_plural',
  origin = 'origin_plural',
  type = 'type_plural',
  gearType = 'gearType_plural',
  length = 'length_plural',
  depth = 'depth_plural',
  grossTonnage = 'grossTonnage_plural',
  owner = 'owner_plural',
  operator = 'operator_plural',
  builtYear = 'builtYear_plural',
  authorizations = 'authorization_plural',
  registeredGearType = 'registeredGearType_plural',
}
interface ListItemProps {
  label: VesselFieldLabel
  value: string
  valuesHistory?: ValueItem[]
  vesselName: string
}

const InfoField: React.FC<ListItemProps> = ({
  value = '',
  label,
  valuesHistory = [],
  vesselName,
}): React.ReactElement => {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const openModal = useCallback(() => setModalOpen(true), [])
  const closeModal = useCallback(() => setModalOpen(false), [])
  const defaultEmptyValue = '-'

  const current: ValueItem = {
    value,
    firstSeen: valuesHistory.slice().shift()?.firstSeen ?? valuesHistory.slice().shift()?.endDate,
  }
  const labelPlural: VesselFieldLabelPlural = useMemo(() => {
    const plural = VesselFieldLabelPlural[label as keyof typeof VesselFieldLabelPlural]
    return t(`vessel.${plural}` as any, `${label}s`)
  }, [t, label])

  const defaultValue = useMemo(() => {
    return `+${valuesHistory.length} previous ${labelPlural.toLocaleUpperCase()}`
  }, [valuesHistory, labelPlural])

  return (
    <div className={styles.identifierField}>
      <label>{t(`vessel.${label}` as any, label)}</label>
      <div>
        <div onClick={openModal}>{value.length > 0 ? value : defaultEmptyValue}</div>
        {valuesHistory.length > 0 && (
          <button className={styles.moreValues} onClick={openModal}>
            {t('vessel.plusPreviousValuesByField', defaultValue, {
              quantity: valuesHistory.length,
              fieldLabel: labelPlural.toLocaleUpperCase(),
            })}
          </button>
        )}
        <InfoFieldHistory
          current={current}
          label={label}
          history={valuesHistory}
          isOpen={modalOpen}
          onClose={closeModal}
          vesselName={vesselName}
        ></InfoFieldHistory>
      </div>
    </div>
  )
}

export default InfoField
