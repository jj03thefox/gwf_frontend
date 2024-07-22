import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
  Button,
  FillColorBarOptions,
  Icon,
  LineColorBarOptions,
  Tooltip,
} from '@globalfishingwatch/ui-components'
import { DataviewType } from '@globalfishingwatch/api-types'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useAppDispatch } from 'features/app/app.hooks'
import { setModalOpen } from 'features/modals/modals.slice'
import { getDatasetSourceIcon, getDatasetTypeIcon } from 'features/datasets/datasets.utils'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import { getHighlightedText } from 'features/layer-library/layer-library.utils'
import { LibraryLayer } from 'data/layer-library'
import { selectActiveDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.instances.selectors'
import styles from './LayerLibraryItem.module.css'

type LayerLibraryItemProps = { layer: LibraryLayer; highlightedText?: string }

const FILL_DATAVIEWS = [DataviewType.Heatmap, DataviewType.HeatmapAnimated]

const LayerLibraryItem = (props: LayerLibraryItemProps) => {
  const { layer, highlightedText = '' } = props
  const {
    id,
    dataviewId,
    config,
    previewImageUrl,
    dataview,
    name,
    description,
    moreInfoLink,
    datasetsConfig,
  } = layer
  const dataviews = useSelector(selectActiveDataviewInstancesResolved)
  const datasetId = dataview.datasetsConfig?.[0].datasetId || ''
  const dataset = useSelector(selectDatasetById(datasetId))
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const datasetTypeIcon = getDatasetTypeIcon(dataset)
  const datasetSourceIcon = getDatasetSourceIcon(dataset)

  const onAddToWorkspaceClick = async () => {
    const palette = FILL_DATAVIEWS.includes(dataview.config?.type)
      ? FillColorBarOptions
      : LineColorBarOptions
    const usedColors = dataviews.flatMap((dataview) => dataview.config?.color || [])
    const firstUnusedcolor = palette.find((c) => !usedColors.includes(c.value))
    upsertDataviewInstance({
      id: `${id}-${Date.now()}`,
      dataviewId,
      datasetsConfig,
      config: {
        ...config,
        color: firstUnusedcolor?.value || dataview.config?.color,
        colorRamp: firstUnusedcolor?.id || dataview.config?.colorRamp,
      },
    })
    dispatch(setModalOpen({ id: 'layerLibrary', open: false }))
  }

  return (
    <li className={styles.layer} key={id}>
      <div className={styles.container}>
        <div className={styles.image} style={{ backgroundImage: `url(${previewImageUrl})` }} />
        <div className={styles.content}>
          <h2 className={styles.title}>
            {getHighlightedText(name as string, highlightedText, styles)}
          </h2>
          <p className={styles.description}>
            {getHighlightedText(description as string, highlightedText, styles)}
          </p>
          <div className={styles.actions}>
            {datasetTypeIcon && <Icon icon={datasetTypeIcon} />}
            {datasetSourceIcon ? (
              moreInfoLink ? (
                <Tooltip content={t('common.seeMore', 'See more')}>
                  <a href={moreInfoLink} target="_blank" rel="noreferrer" style={{ lineHeight: 1 }}>
                    <Icon icon={datasetSourceIcon} type="original-colors" />
                  </a>
                </Tooltip>
              ) : (
                <Icon icon={datasetSourceIcon} type="original-colors" />
              )
            ) : null}
            <Button className={styles.cta} onClick={onAddToWorkspaceClick}>
              {t('workspace.addLayer', 'Add to workspace')}
            </Button>
          </div>
        </div>
      </div>
    </li>
  )
}

export default LayerLibraryItem
