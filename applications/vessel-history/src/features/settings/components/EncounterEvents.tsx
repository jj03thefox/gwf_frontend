import React from 'react'
import { 
  ENCOUNTERS_MAX_DISTANCE, 
  ENCOUNTERS_MAX_DURATION, 
  ENCOUNTERS_MIN_DISTANCE, 
  ENCOUNTERS_MIN_DURATION 
} from 'data/constants'
import { SettingsEvents } from '../settings.slice'
import ActivityEvents from './ActivityEvents'
import '@globalfishingwatch/ui-components/dist/base.css'
import styles from './SettingsComponents.module.css'

interface SettingsProps {
  settings: SettingsEvents
  section: string
}

const EncounterEvents: React.FC<SettingsProps> = (props): React.ReactElement => {
  const { settings, section } = props


  return (
    <div className={styles.settingsFieldsContainer}>
      <ActivityEvents 
      section={section} 
      settings={settings}
      minDuration={ENCOUNTERS_MIN_DURATION}
      maxDuration={ENCOUNTERS_MAX_DURATION}
      minDistance={ENCOUNTERS_MIN_DISTANCE}
      maxDistance={ENCOUNTERS_MAX_DISTANCE}
      ></ActivityEvents>
     
    </div>
  )
}

export default EncounterEvents
