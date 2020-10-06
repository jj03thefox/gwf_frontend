import React, { useState } from 'react'
import cx from 'classnames'
import useClickedOutside from 'hooks/useClickedOutside'
import { useSelector } from 'react-redux'
import { Switch, IconButton, TagList, Tooltip } from '@globalfishingwatch/ui-components'
import { Dataview } from '@globalfishingwatch/dataviews-client'
import { useLocationConnect } from 'routes/routes.hook'
import { selectDataviews, selectFishingFilters } from 'routes/routes.selectors'
import styles from './LayerPanel.module.css'
import Filters from './Filters'

type LayerPanelProps = {
  dataview: Dataview
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const [filterOpen, setFiltersOpen] = useState(false)
  const { dispatchQueryParams } = useLocationConnect()
  const urlDataviews = useSelector(selectDataviews)
  const fishingFilters = useSelector(selectFishingFilters)

  // TODO reuse an unify the same logic than map.selector
  const urlDataview = (urlDataviews || []).find(
    (urlDataview) => urlDataview.id === dataview.id || urlDataview.id === dataview.uid
  )
  const layerActive =
    urlDataview?.config?.visible !== undefined ? urlDataview?.config?.visible : true
  const onToggleLayerActive = () => {
    dispatchQueryParams({
      dataviews: [{ id: dataview.uid || dataview.id, config: { visible: !layerActive } }],
    })
  }

  const onToggleFilterOpen = () => {
    setFiltersOpen(!filterOpen)
  }

  const closeExpandedContainer = () => {
    setFiltersOpen(false)
  }
  const expandedContainerRef = useClickedOutside(closeExpandedContainer)
  const TitleComponent = (
    <h3 className={cx(styles.name, { [styles.active]: layerActive })} onClick={onToggleLayerActive}>
      {dataview.name}
    </h3>
  )

  return (
    <div className={cx(styles.LayerPanel, { [styles.expandedContainerOpen]: filterOpen })}>
      <div className={styles.header}>
        <Switch
          active={layerActive}
          onClick={onToggleLayerActive}
          tooltip="Toggle layer visibility"
          tooltipPlacement="top"
          color={dataview.config.color}
        />
        {dataview.name.length > 30 ? (
          <Tooltip content={dataview.name}>{TitleComponent}</Tooltip>
        ) : (
          TitleComponent
        )}
        <div className={cx(styles.actions, { [styles.active]: layerActive })}>
          {layerActive && (
            <IconButton
              icon={filterOpen ? 'filter-on' : 'filter-off'}
              size="small"
              onClick={onToggleFilterOpen}
              className={cx(styles.actionButton, styles.expandable, {
                [styles.expanded]: filterOpen,
              })}
              tooltip="Filter"
              tooltipPlacement="top"
            />
          )}
          <IconButton
            icon="info"
            size="small"
            className={styles.actionButton}
            tooltip={dataview.description}
            tooltipPlacement="top"
          />
          <IconButton
            icon="delete"
            size="small"
            className={styles.actionButton}
            tooltip="Delete"
            tooltipPlacement="top"
          />
        </div>
      </div>
      {layerActive && fishingFilters.length > 0 && (
        <div className={styles.properties}>
          <label>Filters</label>
          <TagList tags={fishingFilters} color={dataview.config.color} className={styles.tagList} />
        </div>
      )}
      <div className={styles.expandedContainer} ref={expandedContainerRef}>
        {filterOpen && <Filters dataview={dataview} />}
      </div>
    </div>
  )
}

export default LayerPanel
