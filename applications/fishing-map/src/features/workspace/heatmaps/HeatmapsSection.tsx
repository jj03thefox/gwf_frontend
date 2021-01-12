import React, { useCallback } from 'react'
import cx from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { Generators } from '@globalfishingwatch/layer-composer'
import { selectTemporalgridDataviews } from 'features/workspace/workspace.selectors'
import styles from 'features/workspace/Sections.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useLocationConnect } from 'routes/routes.hook'
import { selectBivariate } from 'features/app/app.selectors'
import { getHeatmapDataviewInstance } from 'features/dataviews/dataviews.utils'
import {
  selectHeatmapSublayersAddedIndex,
  setHeatmapSublayersAddedIndex,
} from 'features/app/app.slice'
import LayerPanel from './HeatmapLayerPanel'

function HeatmapsSection(): React.ReactElement {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const dataviews = useSelector(selectTemporalgridDataviews)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { dispatchQueryParams } = useLocationConnect()
  const bivariate = useSelector(selectBivariate)
  const heatmapSublayersAddedIndex = useSelector(selectHeatmapSublayersAddedIndex)

  const onAddClick = useCallback(() => {
    const usedRamps = dataviews?.flatMap((dataview) => dataview.config?.colorRamp || [])
    const dataviewInstance = getHeatmapDataviewInstance(usedRamps)
    dispatch(setHeatmapSublayersAddedIndex(dataviews ? dataviews.length : 0))
    upsertDataviewInstance(dataviewInstance)
  }, [dispatch, dataviews, upsertDataviewInstance])

  const onToggleCombinationMode = useCallback(() => {
    const newBivariateValue = !bivariate
    dispatchQueryParams({ bivariate: newBivariateValue })
    // automatically set 2 first animated heatmaps to visible
    if (newBivariateValue) {
      let heatmapAnimatedIndex = 0
      dataviews?.forEach((dataview) => {
        if (dataview.config?.type === Generators.Type.HeatmapAnimated) {
          const visible = heatmapAnimatedIndex < 2
          upsertDataviewInstance({
            id: dataview.id,
            config: {
              visible,
            },
          })
          heatmapAnimatedIndex++
        }
      })
    }
  }, [bivariate, dataviews, dispatchQueryParams, upsertDataviewInstance])

  let bivariateTooltip = bivariate
    ? t('layer.toggleCombinationMode.split', 'Split layers')
    : t('layer.toggleCombinationMode.combine', 'Combine layers')
  if (dataviews?.length !== 2) {
    bivariateTooltip = t(
      'layer.toggleCombinationMode.disabled',
      'Combine mode is only available with two activity layers'
    )
  }

  const addTooltip = bivariate
    ? t('layer.addDisabled', 'Adding layers is disabled when layers are combined')
    : t('layer.add', 'Add layer')
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{t('common.activity', 'Activity')}</h2>
        <div className={cx('print-hidden', styles.sectionButtons)}>
          <IconButton
            icon={bivariate ? 'split' : 'compare'}
            type="border"
            size="medium"
            disabled={dataviews?.length !== 2 ?? true}
            tooltip={bivariateTooltip}
            tooltipPlacement="top"
            onClick={onToggleCombinationMode}
          />
          <IconButton
            icon="plus"
            type="border"
            size="medium"
            disabled={bivariate}
            tooltip={addTooltip}
            tooltipPlacement="top"
            onClick={onAddClick}
          />
        </div>
      </div>
      {dataviews?.map((dataview, index) => (
        <LayerPanel
          key={dataview.id}
          dataview={dataview}
          isAdded={index === heatmapSublayersAddedIndex}
        />
      ))}
    </div>
  )
}

export default HeatmapsSection
