import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '@globalfishingwatch/ui-components'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import Remove from '../common/Remove'

function VesselGroupNotFound({ dataview }: { dataview: UrlDataviewInstance }) {
  const { t } = useTranslation()
  return (
    <div className={cx(styles.LayerPanel, 'print-hidden')}>
      <div className={styles.header}>
        <Tooltip content={t('vesselGroup.notFound', 'Vessel group not found')}>
          <h3 className={cx(styles.name, styles.error)}>
            {dataview.config?.filters?.['vessel-groups']?.[0] ||
              t('vesselGroup.notFound', 'Vessel group not found')}
          </h3>
        </Tooltip>
        <div className={styles.actions}>
          <Remove dataview={dataview} />
        </div>
      </div>
    </div>
  )
}

export default VesselGroupNotFound
