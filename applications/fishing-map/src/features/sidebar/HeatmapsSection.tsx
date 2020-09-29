import React from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import LayerPanel from '../layer-panel/LayerPanel'
import styles from './VesselsSection.module.css'

function VesselsSection(): React.ReactElement {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>FISHING</h2>
        <IconButton icon="plus" type="border" tooltip="Add layer" tooltipPlacement="top" />
      </div>
      <LayerPanel />
      <LayerPanel />
    </div>
  )
}

export default VesselsSection
