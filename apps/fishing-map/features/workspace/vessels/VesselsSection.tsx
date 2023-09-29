import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { SortableContext } from '@dnd-kit/sortable'
import cx from 'classnames'
import { useTranslation, Trans } from 'react-i18next'
import { IconButton, Switch } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import { selectVesselsDataviews } from 'features/dataviews/dataviews.slice'
import styles from 'features/workspace/shared/Sections.module.css'
import { selectHasTracksWithNoData } from 'features/timebar/timebar.selectors'
import { isBasicSearchAllowed } from 'features/search/search.selectors'
import { isGuestUser } from 'features/user/user.slice'
import LocalStorageLoginLink from 'routes/LoginLink'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import VesselEventsLegend from './VesselEventsLegend'
import VesselLayerPanel from './VesselLayerPanel'

function VesselsSection(): React.ReactElement {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const dataviews = useSelector(selectVesselsDataviews)
  const guestUser = useSelector(isGuestUser)
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const hasVesselsWithNoTrack = useSelector(selectHasTracksWithNoData)
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)
  const searchAllowed = useSelector(isBasicSearchAllowed)
  const someVesselsVisible = dataviews.some((d) => d.config?.visible)

  const onToggleAllVessels = useCallback(() => {
    upsertDataviewInstance(
      dataviews.map(({ id }) => ({
        id: id,
        config: {
          visible: !someVesselsVisible,
        },
      }))
    )
  }, [someVesselsVisible, dataviews, upsertDataviewInstance])

  const onDeleteAllClick = useCallback(() => {
    deleteDataviewInstance(dataviews.map((d) => d.id))
  }, [dataviews, deleteDataviewInstance])

  const onSearchClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.SearchVessel,
      action: 'Click search icon to open search panel',
    })
    dispatchQueryParams({ query: '' })
  }, [dispatchQueryParams])

  return (
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={styles.header}>
        {dataviews.length > 1 && (
          <Switch
            active={someVesselsVisible}
            onClick={onToggleAllVessels}
            tooltip={t('layer.toggleAllVisibility', 'Toggle all layers visibility')}
            tooltipPlacement="top"
          />
        )}
        <h2 className={cx('print-hidden', styles.sectionTitle)}>
          {t('common.vessel_other', 'Vessels')}
        </h2>
        {dataviews.length > 0 && (
          <IconButton
            icon="delete"
            size="medium"
            tooltip={t('layer.removeAllLayers', 'Remove all layers')}
            tooltipPlacement="top"
            className="print-hidden"
            onClick={onDeleteAllClick}
          />
        )}
        <IconButton
          icon="search"
          type="border"
          size="medium"
          testId="search-vessels-open"
          disabled={!searchAllowed}
          tooltip={
            searchAllowed
              ? t('search.vessels', 'Search vessels')
              : t('search.notAllowed', 'Search not allowed')
          }
          tooltipPlacement="top"
          className="print-hidden"
          onClick={onSearchClick}
        />
      </div>
      <SortableContext items={dataviews}>
        {dataviews.length > 0 ? (
          dataviews?.map((dataview) => <VesselLayerPanel key={dataview.id} dataview={dataview} />)
        ) : (
          <div className={styles.emptyState}>
            {t(
              'workspace.emptyStateVessels',
              'The vessels selected in the search or by clicking on activity grid cells will appear here.'
            )}
          </div>
        )}
      </SortableContext>
      {hasVesselsWithNoTrack && guestUser && (
        <p className={styles.disclaimer}>
          <Trans i18nKey="vessel.trackLogin">
            One of your selected sources requires you to
            <LocalStorageLoginLink className={styles.link}>login</LocalStorageLoginLink> to see
            vessel tracks and events
          </Trans>
        </p>
      )}
      <VesselEventsLegend dataviews={dataviews} />
    </div>
  )
}

export default VesselsSection
