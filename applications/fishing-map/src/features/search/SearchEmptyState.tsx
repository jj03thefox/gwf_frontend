import React from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import vesselImage from 'assets/images/vessel@2x.png'
import styles from './SearchEmptyState.module.css'

type SearchEmptyProps = {
  className?: string
}

function SearchEmptyState({ className = '' }: SearchEmptyProps) {
  const { t } = useTranslation()
  return (
    <div className={cx(styles.emptyState, className)}>
      <div>
        <img src={vesselImage} alt="vessel" className={styles.vesselImage} />
        <p>
          {t(
            'vessel.search.description',
            'Search by vessel name or identification code (IMO, MMSI, VMS ID, etc…). You can narrow your search pressing the filter icon in the top bar'
          )}
        </p>
        {/* TODO: get keyworkds search by */}
        {/* <p>
          <code>flag:china,japan,spain</code>
        </p>
        <p>
          <code>active-after:2017/03/01</code>
        </p>
        <p>
          <code>active-before:2018/01/01</code>
        </p>
        <p>
          <code>source:AIS</code>
        </p> */}
      </div>
    </div>
  )
}

export default SearchEmptyState
