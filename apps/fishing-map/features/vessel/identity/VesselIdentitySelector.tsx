import { useSelector } from 'react-redux'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import {
  selectVesselIdentityIndex,
  selectVesselIdentitySource,
} from 'features/vessel/vessel.config.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { getVesselIdentities, getVesselIdentity } from 'features/vessel/vessel.utils'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import styles from './VesselIdentitySelector.module.css'

function isRegistryInTimerange(registry, start, end) {
  return (
    // overlaps from the left
    (registry.transmissionDateFrom >= start && registry.transmissionDateTo <= start) ||
    // overlaps from the right
    (registry.transmissionDateTo <= end && registry.transmissionDateFrom >= start) ||
    // entirely inside
    (registry.transmissionDateFrom >= start && registry.transmissionDateTo <= end) ||
    // entirely overlaps
    (registry.transmissionDateFrom <= start && registry.transmissionDateTo >= end)
  )
}

const VesselIdentitySelector = () => {
  const { t } = useTranslation()
  const vessel = useSelector(selectVesselInfoData)
  const identitySource = useSelector(selectVesselIdentitySource)
  const identityIndex = useSelector(selectVesselIdentityIndex)
  const { dispatchQueryParams } = useLocationConnect()
  const { start, end } = useTimerangeConnect()

  const setRegistryIndex = (index: number) => {
    dispatchQueryParams({ vesselIdentityIndex: index })
  }

  const identities = getVesselIdentities(vessel, { identitySource })
  const currentIdentity = getVesselIdentity(vessel, { identitySource, identityIndex })

  if (!identities?.length || identities?.length <= 1) return null

  const isIdentityInTimerange = isRegistryInTimerange(currentIdentity, start, end)
  return (
    <div>
      {!isIdentityInTimerange && (
        <p className={styles.error}>
          {t(
            'vessel.identityDatesOutOfRange',
            'The dates of this identity don’t overlap with your current time range'
          )}
        </p>
      )}
      <ul className={cx(styles.selector, 'print-hidden')}>
        {identities.map((registry, index) => {
          const start = formatI18nDate(registry.transmissionDateFrom)
          const end = formatI18nDate(registry.transmissionDateTo)
          return (
            <li
              key={index}
              className={cx(styles.icon, {
                [styles.selected]: index === identityIndex,
              })}
              onClick={() => setRegistryIndex(index)}
            >
              <span className={styles.dates}>
                {start} - {end}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default VesselIdentitySelector
