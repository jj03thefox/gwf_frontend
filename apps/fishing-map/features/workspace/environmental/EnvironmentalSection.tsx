import { useCallback, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { SortableContext } from '@dnd-kit/sortable'
import { useTranslation } from 'react-i18next'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { IconButton } from '@globalfishingwatch/ui-components'
import { DatasetCategory, DatasetTypes } from '@globalfishingwatch/api-types'
import { selectEnvironmentalDataviews } from 'features/dataviews/dataviews.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import NewDatasetTooltip from 'features/datasets/NewDatasetTooltip'
import { selectUserDatasetsByCategory } from 'features/user/user.selectors'
import TooltipContainer from 'features/workspace/shared/TooltipContainer'
import { getEventLabel } from 'utils/analytics'
import { selectReadOnly } from 'features/app/app.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectLocationCategory } from 'routes/routes.selectors'
import { WorkspaceCategory } from 'data/workspaces'
import LayerPanelContainer from '../shared/LayerPanelContainer'
import EnvironmentalLayerPanel from './EnvironmentalLayerPanel'
import UserTrackLayerPanel from './UserTrackLayerPanel'

function EnvironmentalLayerSection(): React.ReactElement | null {
  const { t } = useTranslation()
  const [newDatasetOpen, setNewDatasetOpen] = useState(false)
  const readOnly = useSelector(selectReadOnly)
  const dataviews = useSelector(selectEnvironmentalDataviews)
  const userDatasets = useSelector(selectUserDatasetsByCategory(DatasetCategory.Environment))
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)
  const locationCategory = useSelector(selectLocationCategory)

  const onAddClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.EnvironmentalData,
      action: `Open panel to upload new environmental dataset`,
      value: userDatasets.length,
    })
    setNewDatasetOpen(true)
  }, [userDatasets])

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
          <TooltipContainer
            visible={newDatasetOpen}
            onClickOutside={() => {
              setNewDatasetOpen(false)
            }}
            component={
              <NewDatasetTooltip
                datasetCategory={DatasetCategory.Environment}
                onSelect={() => setNewDatasetOpen(false)}
              />
            }
          >
            <IconButton
              icon="plus"
              type="border"
              size="medium"
              tooltip={t('dataset.addEnvironmental', 'Add environmental dataset')}
              tooltipPlacement="top"
              className="print-hidden"
              onClick={onAddClick}
            />
          </TooltipContainer>
        )}
      </div>
      <SortableContext items={dataviews}>
        {dataviews.length > 0
          ? dataviews?.map((dataview) =>
              dataview.datasets && dataview.datasets[0]?.type === DatasetTypes.UserTracks ? (
                <LayerPanelContainer key={dataview.id} dataview={dataview}>
                  <UserTrackLayerPanel dataview={dataview} onToggle={onToggleLayer(dataview)} />
                </LayerPanelContainer>
              ) : (
                <LayerPanelContainer key={dataview.id} dataview={dataview}>
                  <EnvironmentalLayerPanel dataview={dataview} onToggle={onToggleLayer(dataview)} />
                </LayerPanelContainer>
              )
            )
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
