import { Fragment, useCallback } from 'react'
import cx from 'classnames'
import { SortableContext } from '@dnd-kit/sortable'
import { useSelector } from 'react-redux'
import { Trans, useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { DatasetTypes, DataviewCategory } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import styles from 'features/workspace/shared/Sections.module.css'
import { getEventLabel } from 'utils/analytics'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import LocalStorageLoginLink from 'routes/LoginLink'
import { useAddDataset } from 'features/datasets/datasets.hook'
import { useAppDispatch } from 'features/app/app.hooks'
import { setModalOpen } from 'features/modals/modals.slice'
import UserLoggedIconButton from 'features/user/UserLoggedIconButton'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import { selectCustomUserDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { selectUserContextDatasets } from 'features/user/selectors/user.permissions.selectors'
import LayerPanelContainer from '../shared/LayerPanelContainer'
import LayerPanel from './UserLayerPanel'

export function RegisterOrLoginToUpload() {
  return (
    <Trans i18nKey="dataset.uploadLogin">
      <a
        className={styles.link}
        href={GFWAPI.getRegisterUrl(
          typeof window !== 'undefined' ? window.location.toString() : ''
        )}
      >
        Register
      </a>
      or
      <LocalStorageLoginLink className={styles.link}>login</LocalStorageLoginLink>
      to upload datasets (free, 2 minutes)
    </Trans>
  )
}

function UserSection(): React.ReactElement {
  const { t } = useTranslation()
  const { dispatchSetMapDrawing } = useMapDrawConnect()
  const guestUser = useSelector(selectIsGuestUser)
  const dispatch = useAppDispatch()
  const isSmallScreen = useSmallScreen()

  const readOnly = useSelector(selectReadOnly)
  const dataviews = useSelector(selectCustomUserDataviews)
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)

  const onAddNewClick = useAddDataset({})

  const onDrawClick = useCallback(() => {
    dispatchSetMapDrawing(true)
    trackEvent({
      category: TrackCategory.ReferenceLayer,
      action: `Draw a custom reference layer - Start`,
    })
  }, [dispatchSetMapDrawing])

  const userDatasets = useSelector(selectUserContextDatasets)

  const onUploadClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.ReferenceLayer,
      action: `Open panel to upload new reference layer`,
      value: userDatasets.length,
    })
    onAddNewClick()
  }, [onAddNewClick, userDatasets.length])

  const onAddClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.ReferenceLayer,
      action: `Open panel to add a reference layer`,
      value: userDatasets.length,
    })
    dispatch(setModalOpen({ id: 'layerLibrary', open: DataviewCategory.User }))
  }, [dispatch, userDatasets.length])

  const onToggleLayer = useCallback(
    (dataview: UrlDataviewInstance) => () => {
      const isVisible = dataview?.config?.visible ?? false
      const dataset = dataview.datasets?.find(
        (d) => d.type === DatasetTypes.Context || d.type === DatasetTypes.UserContext
      )
      const layerTitle = dataset?.name ?? dataset?.id ?? 'Unknown layer'
      const action = isVisible ? 'disable' : 'enable'
      trackEvent({
        category: TrackCategory.ReferenceLayer,
        action: `Toggle reference layer`,
        label: getEventLabel([action, layerTitle]),
      })
    },
    []
  )
  return (
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={styles.header}>
        <h2 className={cx('print-hidden', styles.sectionTitle)}>
          {t('user.datasets', 'User datasets')}
        </h2>
        {!readOnly && (
          <Fragment>
            {!isSmallScreen && (
              <UserLoggedIconButton
                icon="upload"
                type="border"
                size="medium"
                className="print-hidden"
                onClick={onUploadClick}
                tooltip={t('dataset.upload', 'Upload dataset')}
                tooltipPlacement="top"
                loginTooltip={t(
                  'download.eventsDownloadLogin',
                  'Register and login to download vessel events (free, 2 minutes)'
                )}
              />
            )}
            <UserLoggedIconButton
              icon="draw"
              type="border"
              size="medium"
              tooltip={t('layer.drawPolygon', 'Draw a layer')}
              tooltipPlacement="top"
              className="print-hidden"
              onClick={onDrawClick}
              loginTooltip={t(
                'download.eventsDownloadLogin',
                'Register and login to download vessel events (free, 2 minutes)'
              )}
            />
            <IconButton
              icon="plus"
              type="border"
              size="medium"
              tooltip={t('dataset.addUser', 'Add an uploaded dataset')}
              tooltipPlacement="top"
              className="print-hidden"
              onClick={onAddClick}
            />
          </Fragment>
        )}
      </div>
      {guestUser ? (
        <div className={styles.emptyStateBig}>
          <RegisterOrLoginToUpload />
        </div>
      ) : (
        <SortableContext items={dataviews}>
          {dataviews?.length ? (
            dataviews?.map((dataview) => (
              <LayerPanelContainer key={dataview.id} dataview={dataview}>
                <LayerPanel dataview={dataview} onToggle={onToggleLayer(dataview)} />
              </LayerPanelContainer>
            ))
          ) : (
            <div className={styles.emptyStateBig}>
              {t(
                'workspace.emptyStateEnvironment',
                'Upload custom datasets like animal telemetry clicking on the plus icon.'
              )}
            </div>
          )}
        </SortableContext>
      )}
    </div>
  )
}

export default UserSection
