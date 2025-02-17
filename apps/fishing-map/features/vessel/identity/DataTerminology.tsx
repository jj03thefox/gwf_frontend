import { Fragment, useCallback, useState } from 'react'
import htmlParse from 'html-react-parser'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import type { IconButtonSize, IconButtonType } from '@globalfishingwatch/ui-components'
import { IconButton, Modal } from '@globalfishingwatch/ui-components'
import type { I18nNamespaces } from 'features/i18n/i18n.types'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectVesselSection } from '../vessel.config.selectors'
import styles from './DataTerminology.module.css'

interface ModalProps {
  containerClassName?: string
  className?: string
  title?: string
  size?: IconButtonSize
  type?: IconButtonType
  terminologyKey: I18nNamespaces['dataTerminology']
}

const DataTerminology: React.FC<ModalProps> = ({
  terminologyKey,
  className,
  containerClassName,
  title,
  size = 'default',
  type = 'border',
}): React.ReactElement => {
  const { t } = useTranslation(['translations', 'data-terminology'])
  const [showModal, setShowModal] = useState(false)
  const closeModal = useCallback(() => setShowModal(false), [setShowModal])
  const vesselSection = useSelector(selectVesselSection)

  const onClick = useCallback(() => {
    setShowModal(true)
    trackEvent({
      category: TrackCategory.VesselProfile,
      action: `open_vessel_info_${vesselSection}_tab`,
      label: terminologyKey,
    })
  }, [terminologyKey, vesselSection])

  return (
    <Fragment>
      <IconButton
        icon="info"
        size={size}
        type={type}
        className={cx(styles.infoButton, className)}
        onClick={onClick}
      />
      <Modal
        appSelector="__next"
        isOpen={showModal}
        onClose={closeModal}
        title={title ?? t('common.dataTerminology', 'Data and Terminology')}
        className={cx(styles.container, containerClassName)}
        contentClassName={styles.content}
      >
        {htmlParse(t(`data-terminology:${terminologyKey}`, terminologyKey))}
      </Modal>
    </Fragment>
  )
}

export default DataTerminology
