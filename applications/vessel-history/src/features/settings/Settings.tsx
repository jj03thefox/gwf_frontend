import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { history } from 'redux-first-router'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { fetchRegionsThunk } from 'features/regions/regions.slice'
import DataAndTerminology from 'features/data-and-terminology/DataAndTerminology'
import { selectSettings, SettingEventSectionName } from './settings.slice'
import FishingEvents from './components/FishingEvents'
import LoiteringEvents from './components/LoiteringEvents'
import EncounterEvents from './components/EncounterEvents'
import PortVisits from './components/PortVisits'
import ActivityEventDataAndTerminology from './components/ActivityEventDataAndTerminology'
import styles from './Settings.module.css'

interface SettingsOption {
  title: string
}

interface SettingsOptions {
  [key: string]: SettingsOption
}

const Settings: React.FC = (): React.ReactElement => {
  const settings = useSelector(selectSettings)
  const { t } = useTranslation()
  const options: SettingEventSectionName[] = [
    'fishingEvents',
    'encounters',
    'loiteringEvents',
    'portVisits',
  ]
  const optionsData: SettingsOptions = {
    fishingEvents: {
      title: t('settings.fishingEvents.title', 'Fishing Events'),
    },
    encounters: {
      title: t('settings.encounters.title', 'Encounters'),
    },
    loiteringEvents: {
      title: t('settings.loiteringEvents.title', 'Loitering Events'),
    },
    portVisits: {
      title: t('settings.portVisits.title', 'Port Visits'),
    },
  }
  const [selectedOption, setSelectedOption] = useState<SettingEventSectionName>()

  const dispatch = useDispatch()
  const onBackClick = useCallback(() => {
    if (selectedOption) {
      setSelectedOption(undefined)
    } else {
      history().goBack()
    }
  }, [selectedOption])

  useEffect(() => {
    dispatch(fetchRegionsThunk())
  }, [dispatch])

  return (
    <div className={styles.settingsContainer}>
      <header className={styles.settingsHeader}>
        <IconButton
          type="border"
          size="default"
          icon="arrow-left"
          onClick={onBackClick}
          className={styles.backButton}
        />
        <h1>
          {t('settings.title', 'Settings')}{' '}
          {selectedOption && <span> - {optionsData[selectedOption].title}</span>}
        </h1>
        {selectedOption && (
          <DataAndTerminology
            size="medium"
            type="solid"
            className={styles.infoIcon}
            title={
              t('common.dataAndTerminology', 'Data and Terminology') +
              ' - ' +
              optionsData[selectedOption].title
            }
          >
            <ActivityEventDataAndTerminology section={selectedOption} />
          </DataAndTerminology>
        )}
      </header>
      {!selectedOption && (
        <ul>
          {options.map((option: string) => (
            <li key={option} onClick={() => setSelectedOption(option as SettingEventSectionName)}>
              {optionsData[option].title}
              <IconButton type="default" size="default" icon="arrow-right" />
            </li>
          ))}
        </ul>
      )}
      {selectedOption === 'fishingEvents' && (
        <FishingEvents settings={settings.fishingEvents} section="fishingEvents"></FishingEvents>
      )}
      {selectedOption === 'encounters' && (
        <EncounterEvents settings={settings.encounters} section="encounters"></EncounterEvents>
      )}
      {selectedOption === 'loiteringEvents' && (
        <LoiteringEvents
          settings={settings.loiteringEvents}
          section="loiteringEvents"
        ></LoiteringEvents>
      )}
      {selectedOption === 'portVisits' && (
        <PortVisits settings={settings.portVisits} section="portVisits"></PortVisits>
      )}
    </div>
  )
}

export default Settings
