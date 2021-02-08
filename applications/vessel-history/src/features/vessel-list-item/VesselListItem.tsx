import React from 'react'
import Logo from '@globalfishingwatch/ui-components/src/logo'
import { IconButton } from '@globalfishingwatch/ui-components'
import { Vessel } from 'types'
import { getFlagById } from 'utils/flags'
import styles from './VesselListItem.module.css'

interface ListItemProps {
  saved?: boolean
  vessel: Vessel
}

const VesselListItem: React.FC<ListItemProps> = (props): React.ReactElement => {
  const vessel = props.vessel
  if (!vessel) {
    return <div></div>
  }

  const flagLabel = getFlagById(vessel.flag)?.label
  return (
    <div className={styles.vesselItem}>
      {props.saved && (
        <IconButton
          type="default"
          size="default"
          icon="delete"
          className={styles.deleteSaved}
        ></IconButton>
      )}
      <h3>{vessel?.shipname}</h3>
      <div className={styles.identifiers}>
        <div>
          <label>FLAG</label>
          {flagLabel}
        </div>
        {vessel.mmsi && (
          <div>
            <label>MMSI</label>
            {vessel.mmsi}
          </div>
        )}
        {vessel.imo && vessel.imo !== '0' && (
          <div>
            <label>IMO</label>
            {vessel.imo}
          </div>
        )}
        {vessel.callsign && (
          <div>
            <label>CALLSIGN</label>
            {vessel.callsign}
          </div>
        )}
        <div>
          <label>TRANSMISSIONS</label>
          from {vessel.firstTransmissionDate} to {vessel.lastTransmissionDate}
        </div>
        {props.saved && (
          <div>
            <label>SAVED ON</label>
            2020/08/01
          </div>
        )}
      </div>
    </div>
  )
}

export default VesselListItem
