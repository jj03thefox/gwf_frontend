import { Fragment, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove } from '@dnd-kit/sortable'
import { Spinner, Button } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectWorkspaceStatus,
  selectWorkspaceError,
  selectWorkspace,
} from 'features/workspace/workspace.selectors'
import { fetchResourceThunk } from 'features/resources/resources.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { isGFWUser, isGuestUser, logoutUserThunk, selectUserData } from 'features/user/user.slice'
import { selectLocationCategory, selectWorkspaceId } from 'routes/routes.selectors'
import { HOME } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import LocalStorageLoginLink from 'routes/LoginLink'
import { selectReadOnly, selectSearchQuery } from 'features/app/app.selectors'
import { PRIVATE_SUFIX, PUBLIC_SUFIX, SUPPORT_EMAIL, USER_SUFIX } from 'data/config'
import { WorkspaceCategories } from 'data/workspaces'
import {
  selectDataviewInstancesMergedOrdered,
  selectDataviewsResources,
} from 'features/dataviews/dataviews.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { parseTrackEventChunkProps } from 'features/timebar/timebar.utils'
import { parseUserTrackCallback } from 'features/resources/resources.utils'
import DetectionsSection from 'features/workspace/detections/DetectionsSection'
import { selectWorkspaceVessselGroupsIds } from 'features/vessel-groups/vessel-groups.selectors'
import { useHideLegacyActivityCategoryDataviews } from 'features/workspace/legacy-activity-category.hook'
import {
  fetchUserVesselGroupsThunk,
  fetchWorkspaceVesselGroupsThunk,
  selectWorkspaceVesselGroupsError,
  selectWorkspaceVesselGroupsStatus,
} from 'features/vessel-groups/vessel-groups.slice'
import ActivitySection from './activity/ActivitySection'
import VesselsSection from './vessels/VesselsSection'
import EventsSection from './events/EventsSection'
import EnvironmentalSection from './environmental/EnvironmentalSection'
import ContextAreaSection from './context-areas/ContextAreaSection'
import styles from './Workspace.module.css'

const Search = dynamic(() => import(/* webpackChunkName: "Search" */ 'features/search/Search'))

function WorkspaceError(): React.ReactElement {
  const [logoutLoading, setLogoutLoading] = useState(false)
  const error = useSelector(selectWorkspaceError)
  const vesselGroupsError = useSelector(selectWorkspaceVesselGroupsError)
  const workspaceId = useSelector(selectWorkspaceId)
  const guestUser = useSelector(isGuestUser)
  const userData = useSelector(selectUserData)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const ErrorPlaceHolder = ({ title, children }: { title: string; children?: React.ReactNode }) => (
    <div className={styles.placeholder}>
      <div>
        <h2 className={styles.errorTitle}>{title}</h2>
        {children && children}
      </div>
    </div>
  )
  if (
    error.status === 401 ||
    error.status === 403 ||
    vesselGroupsError?.code === 401 ||
    vesselGroupsError?.code === 403
  ) {
    return (
      <ErrorPlaceHolder title={t('errors.privateView', 'This is a private view')}>
        {guestUser ? (
          <LocalStorageLoginLink className={styles.button}>
            {t('common.login', 'Log in') as string}
          </LocalStorageLoginLink>
        ) : (
          <Fragment>
            <Button
              href={`mailto:${SUPPORT_EMAIL}?subject=Requesting access for ${workspaceId} view`}
            >
              {t('errors.requestAccess', 'Request access') as string}
            </Button>
            {userData?.email && (
              <p className={styles.logged}>
                {t('common.loggedAs', 'Logged as')} {userData.email}
              </p>
            )}
            <Button
              type="secondary"
              size="small"
              loading={logoutLoading}
              onClick={async () => {
                setLogoutLoading(true)
                await dispatch(logoutUserThunk({ loginRedirect: true }))
                setLogoutLoading(false)
              }}
            >
              {t('errors.switchAccount', 'Switch account') as string}
            </Button>
          </Fragment>
        )}
      </ErrorPlaceHolder>
    )
  }
  if (error.status === 404) {
    return (
      <ErrorPlaceHolder title={t('errors.workspaceNotFound', 'The view you request was not found')}>
        <Button
          onClick={() => {
            dispatch(
              updateLocation(HOME, {
                payload: { workspaceId: undefined },
                query: {},
                replaceQuery: true,
              })
            )
          }}
        >
          Load default view
        </Button>
      </ErrorPlaceHolder>
    )
  }
  return (
    <ErrorPlaceHolder
      title={t(
        'errors.workspaceLoad',
        'There was an error loading the workspace, please try again later'
      )}
    ></ErrorPlaceHolder>
  )
}

function Workspace() {
  useHideLegacyActivityCategoryDataviews()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const searchQuery = useSelector(selectSearchQuery)
  const readOnly = useSelector(selectReadOnly)
  const workspace = useSelector(selectWorkspace)
  const gfwUser = useSelector(isGFWUser)
  const dataviews = useSelector(selectDataviewInstancesMergedOrdered)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const workspaceVesselGroupsStatus = useSelector(selectWorkspaceVesselGroupsStatus)
  const locationCategory = useSelector(selectLocationCategory)
  const dataviewsResources = useSelector(selectDataviewsResources)
  const workspaceVesselGroupsIds = useSelector(selectWorkspaceVessselGroupsIds)
  const isUserWorkspace =
    workspace?.id?.endsWith(`-${USER_SUFIX}`) ||
    workspace?.id?.endsWith(`-${USER_SUFIX}-${PUBLIC_SUFIX}`)
  const { dispatchQueryParams } = useLocationConnect()

  useEffect(() => {
    if (dataviewsResources) {
      const { resources } = dataviewsResources
      resources.forEach((resource) => {
        dispatch(
          fetchResourceThunk({
            resource,
            resourceKey: resource.key,
            parseEventCb: parseTrackEventChunkProps,
            parseUserTrackCb: parseUserTrackCallback,
          })
        )
      })
    }
  }, [dispatch, dataviewsResources])

  useEffect(() => {
    if (gfwUser) {
      dispatch(fetchUserVesselGroupsThunk())
    }
  }, [dispatch, gfwUser])

  useEffect(() => {
    if (workspaceVesselGroupsIds.length) {
      dispatch(fetchWorkspaceVesselGroupsThunk(workspaceVesselGroupsIds))
    }
  }, [workspaceVesselGroupsIds, dispatch])

  if (
    workspaceStatus === AsyncReducerStatus.Idle ||
    workspaceStatus === AsyncReducerStatus.Loading
  ) {
    return (
      <div className={styles.placeholder}>
        <Spinner />
      </div>
    )
  }

  if (
    workspaceStatus === AsyncReducerStatus.Error ||
    workspaceVesselGroupsStatus === AsyncReducerStatus.Error
  ) {
    return <WorkspaceError />
  }

  if (searchQuery !== undefined) {
    return <Search />
  }

  function handleDragEnd(event) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      const oldIndex = dataviews.findIndex((d) => d.id === active.id)
      const newIndex = dataviews.findIndex((d) => d.id === over.id)
      const dataviewInstancesId = arrayMove(dataviews, oldIndex, newIndex).map((d) => d.id)
      dispatchQueryParams({ dataviewInstancesOrder: dataviewInstancesId })
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
      {(locationCategory === WorkspaceCategories.MarineManager ||
        locationCategory === WorkspaceCategories.FishingActivity) &&
        workspace?.name &&
        !readOnly && (
          <div className={styles.header}>
            {isUserWorkspace && (
              <label className={styles.subTitle}>{t('workspace.user', 'User workspace')}</label>
            )}
            <h2 className={styles.title}>
              {workspace.id.startsWith(PRIVATE_SUFIX) && '🔒 '}
              {workspace.name}
            </h2>
          </div>
        )}
      <ActivitySection />
      <DetectionsSection />
      <VesselsSection />
      <EventsSection />
      <EnvironmentalSection />
      <ContextAreaSection />
    </DndContext>
  )
}

export default Workspace
