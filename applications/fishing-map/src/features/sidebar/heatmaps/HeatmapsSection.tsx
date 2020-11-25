import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { Generators } from '@globalfishingwatch/layer-composer'
import { selectTemporalgridDataviews } from 'features/workspace/workspace.selectors'
import styles from 'features/sidebar/Sections.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useLocationConnect } from 'routes/routes.hook'
import { selectBivariate } from 'features/app/app.selectors'
import { getHeatmapDataviewInstance } from 'features/dataviews/dataviews.utils'
import LayerPanel from './HeatmapLayerPanel'

function HeatmapsSection(): React.ReactElement {
  const { t } = useTranslation()
  const dataviews = useSelector(selectTemporalgridDataviews)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { dispatchQueryParams } = useLocationConnect()
  const bivariate = useSelector(selectBivariate)

  const onAddClick = useCallback(() => {
    const usedRamps = dataviews?.flatMap((dataview) => dataview.config?.colorRamp || [])
    const dataviewInstance = getHeatmapDataviewInstance(usedRamps)
    upsertDataviewInstance(dataviewInstance)
  }, [dataviews, upsertDataviewInstance])

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
    ? t('layer.toggleCombinationMode.compare', 'Show fishing layers in comparison mode')
    : t('layer.toggleCombinationMode.bivariate', 'Show fishing layers in bivariate mode')
  if (dataviews?.length !== 2) {
    bivariateTooltip = t(
      'layer.toggleCombinationMode.disabled',
      'Bivariate mode is only availabe with two activity layers'
    )
  }
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{t('common.activity', 'Activity')}</h2>
        <div className={styles.sectionButtons}>
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
            tooltip={t('layer.add', 'Add layer')}
            tooltipPlacement="top"
            onClick={onAddClick}
          />
        </div>
      </div>
      {dataviews?.map((dataview) => (
        <LayerPanel key={dataview.id} dataview={dataview} />
      ))}
    </div>
  )
}

export default HeatmapsSection
