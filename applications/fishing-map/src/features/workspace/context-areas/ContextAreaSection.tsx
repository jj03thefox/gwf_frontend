import React, { Fragment, useCallback, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { event as uaEvent } from 'react-ga'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { DatasetCategory, DatasetTypes } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { selectContextAreasDataviews } from 'features/dataviews/dataviews.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import NewDatasetTooltip from 'features/datasets/NewDatasetTooltip'
import { selectUserDatasetsByCategory } from 'features/user/user.selectors'
import TooltipContainer from 'features/workspace/shared/TooltipContainer'
import { getEventLabel } from 'utils/analytics'
import { selectReadOnly } from 'features/app/app.selectors'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import LayerPanelContainer from '../shared/LayerPanelContainer'
import LayerPanel from './ContextAreaLayerPanel'

function ContextAreaSection(): React.ReactElement {
  const { t } = useTranslation()
  const [newDatasetOpen, setNewDatasetOpen] = useState(false)
  const { dispatchSetDrawMode } = useMapDrawConnect()

  const readOnly = useSelector(selectReadOnly)
  const dataviews = useSelector(selectContextAreasDataviews)
  const userDatasets = useSelector(selectUserDatasetsByCategory(DatasetCategory.Context))
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)

  const onDrawClick = useCallback(() => {
    dispatchSetDrawMode('draw')
  }, [dispatchSetDrawMode])

  const onAddClick = useCallback(() => {
    uaEvent({
      category: 'Reference layer',
      action: `Open panel to upload new reference layer`,
      value: userDatasets.length,
    })
    setNewDatasetOpen(true)
  }, [userDatasets.length])

  const onToggleLayer = useCallback(
    (dataview: UrlDataviewInstance) => () => {
      const isVisible = dataview?.config?.visible ?? false
      const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Context)
      const layerTitle = dataset?.name ?? dataset?.id ?? 'Unknown layer'
      const action = isVisible ? 'disable' : 'enable'
      uaEvent({
        category: 'Reference layer',
        action: `Toggle reference layer`,
        label: getEventLabel([action, layerTitle]),
      })
    },
    []
  )
  return (
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{t('common.context_area_other', 'Context areas')}</h2>
        {!readOnly && (
          <Fragment>
            <IconButton
              icon="draw"
              type="border"
              size="medium"
              tooltip={t('layer.drawPolygon', 'Draw a layer')}
              tooltipPlacement="top"
              className="print-hidden"
              onClick={onDrawClick}
            />
            <TooltipContainer
              visible={newDatasetOpen}
              onClickOutside={() => {
                setNewDatasetOpen(false)
              }}
              component={
                <NewDatasetTooltip
                  datasetCategory={DatasetCategory.Context}
                  onSelect={() => setNewDatasetOpen(false)}
                />
              }
            >
              <IconButton
                icon="plus"
                type="border"
                size="medium"
                tooltip={t('dataset.addContext', 'Add context dataset')}
                tooltipPlacement="top"
                className="print-hidden"
                onClick={onAddClick}
              />
            </TooltipContainer>
          </Fragment>
        )}
      </div>
      {dataviews?.map((dataview) => (
        <LayerPanelContainer key={dataview.id} dataview={dataview}>
          <LayerPanel dataview={dataview} onToggle={onToggleLayer(dataview)} />
        </LayerPanelContainer>
      ))}
    </div>
  )
}

export default ContextAreaSection
