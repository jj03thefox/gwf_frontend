import { useCallback } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { SortableContext } from '@dnd-kit/sortable'
import { useTranslation } from 'react-i18next'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { IconButton } from '@globalfishingwatch/ui-components'
import { DatasetCategory, DatasetTypes, DataviewCategory } from '@globalfishingwatch/api-types'
import { selectEnvironmentalDataviews } from 'features/dataviews/dataviews.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import { selectUserDatasetsByCategory } from 'features/user/user.selectors'
import { getEventLabel } from 'utils/analytics'
import { selectReadOnly } from 'features/app/app.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectLocationCategory } from 'routes/routes.selectors'
import { WorkspaceCategory } from 'data/workspaces'
import { useAppDispatch } from 'features/app/app.hooks'
import { setModalOpen } from 'features/modals/modals.slice'
import LayerPanelContainer from '../shared/LayerPanelContainer'
import EnvironmentalLayerPanel from './EnvironmentalLayerPanel'

function EnvironmentalLayerSection(): React.ReactElement | null {
  const { t } = useTranslation()
  const readOnly = useSelector(selectReadOnly)
  const dataviews = useSelector(selectEnvironmentalDataviews)
  const userDatasets = useSelector(selectUserDatasetsByCategory(DatasetCategory.Environment))
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)
  const locationCategory = useSelector(selectLocationCategory)

  const dispatch = useAppDispatch()

  const onAddClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.EnvironmentalData,
      action: `Open panel to add a environmental dataset`,
      value: userDatasets.length,
    })
    dispatch(setModalOpen({ id: 'layerLibrary', open: DataviewCategory.Environment }))
  }, [dispatch, userDatasets.length])

  const onToggleLayer = useCallback(
    (dataview: UrlDataviewInstance) => () => {
      const isVisible = dataview?.config?.visible ?? false
      const dataset = dataview.datasets?.shift()
      const layerTitle = dataset?.name ?? dataset?.id ?? 'Unknown layer'
      const action = isVisible ? 'disable' : 'enable'
      trackEvent({
        category: TrackCategory.EnvironmentalData,
        action: `Toggle environmental layer`,
        label: getEventLabel([action, layerTitle]),
      })
    },
    []
  )

  if (readOnly && !hasVisibleDataviews) {
    return null
  }

  return (
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={styles.header}>
        <h2 className={cx('print-hidden', styles.sectionTitle)}>
          {t('common.environment', 'Environment')}
        </h2>
        {!readOnly && (
          <IconButton
            icon="plus"
            type="border"
            size="medium"
            tooltip={t('dataset.addEnvironmental', 'Add environmental dataset')}
            tooltipPlacement="top"
            className="print-hidden"
            onClick={onAddClick}
          />
        )}
      </div>
      <SortableContext items={dataviews}>
        {dataviews.length > 0
          ? dataviews?.map((dataview) => (
              <LayerPanelContainer key={dataview.id} dataview={dataview}>
                <EnvironmentalLayerPanel dataview={dataview} onToggle={onToggleLayer(dataview)} />
              </LayerPanelContainer>
            ))
          : null}
      </SortableContext>
      {locationCategory === WorkspaceCategory.MarineManager && (
        <div className={styles.surveyLink}>
          <a
            href={
              t(
                'feedback.marineManagerDatasetsSurveyLink',
                'https://www.surveymonkey.com/r/marinemanagerdata'
              ) as string
            }
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            {t(
              'feedback.marineManagerDatasetsSurvey',
              'What other datasets would you like to see?'
            )}
          </a>
        </div>
      )}
    </div>
  )
}

export default EnvironmentalLayerSection
