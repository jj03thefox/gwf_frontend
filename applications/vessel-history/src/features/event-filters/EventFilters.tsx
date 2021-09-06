import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { InputDate, Modal, Switch } from '@globalfishingwatch/ui-components'
import { DEFAULT_WORKSPACE } from 'data/config'
import { useApplyFiltersConnect } from './filters.hooks'
import { selectEnd, selectFilter, selectStart } from './filters.slice'
import styles from './EventFilters.module.css'

interface ModalProps {
  isModalOpen: boolean
  onCloseModal: (close: boolean) => void
}

const EventFilters: React.FC<ModalProps> = (props): React.ReactElement => {
  const { t } = useTranslation()
  const { setFilter, setDate } = useApplyFiltersConnect()
  const isModalOpen = props.isModalOpen
  const closeModal = useCallback(() => props.onCloseModal(false), [props])
  const isPortVisitActive = useSelector(selectFilter('portVisits'))
  const isFishingEventsActive = useSelector(selectFilter('fishingEvents'))
  const isEncountersActive = useSelector(selectFilter('encounters'))
  const isLoiteringEventsActive = useSelector(selectFilter('loiteringEvents'))
  const start = useSelector(selectStart).slice(0, 10) as string
  const end = useSelector(selectEnd).slice(0, 10) as string

  return (
    <Modal
      title={t(`filters.title` as any, 'Filter events')}
      isOpen={isModalOpen}
      onClose={closeModal}
    >
      <div className={styles.filterSelector}>
        <Switch
          className={styles.filterSwitch}
          onClick={() => setFilter('portVisits', !isPortVisitActive)}
          active={isPortVisitActive}
        ></Switch>
        {t(`settings.portVisits.title` as any, 'Port Visits')}
      </div>
      <div className={styles.filterSelector}>
        <Switch
          className={styles.filterSwitch}
          onClick={() => setFilter('fishingEvents', !isFishingEventsActive)}
          active={isFishingEventsActive}
        ></Switch>
        {t(`settings.fishingEvents.title` as any, 'Fishing Events')}
      </div>
      <div className={styles.filterSelector}>
        <Switch
          className={styles.filterSwitch}
          onClick={() => setFilter('encounters', !isEncountersActive)}
          active={isEncountersActive}
        ></Switch>
        {t(`settings.encounters.title` as any, 'Encounters')}
      </div>
      <div className={styles.filterSelector}>
        <Switch
          className={styles.filterSwitch}
          onClick={() => setFilter('loiteringEvents', !isLoiteringEventsActive)}
          active={isLoiteringEventsActive}
        ></Switch>
        {t(`settings.loiteringEvents.title` as any, 'Loitering Events')}
      </div>
      <br />
      <InputDate
        value={start}
        onChange={(e) => {
          if (e.target.value !== start) {
            setDate('start', e.target.value)
          }
        }}
        onRemove={() => {
          setDate('start', DEFAULT_WORKSPACE.start)
        }}
        label={t(`filters.start` as any, 'Start')}
        max={DEFAULT_WORKSPACE.end}
      />
      <br />
      <InputDate
        value={end}
        onChange={(e) => {
          if (e.target.value !== end) {
            setDate('end', e.target.value)
          }
        }}
        onRemove={() => {
          setDate('end', DEFAULT_WORKSPACE.end)
        }}
        label={t(`filters.start` as any, 'End')}
        max={DEFAULT_WORKSPACE.end}
      />
    </Modal>
  )
}

export default EventFilters
