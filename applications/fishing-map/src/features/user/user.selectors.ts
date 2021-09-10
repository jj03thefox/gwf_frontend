import { createSelector } from '@reduxjs/toolkit'
import { orderBy } from 'lodash'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import { DatasetStatus, DatasetCategory, UserPermission } from '@globalfishingwatch/api-types'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import {
  selectContextAreasDataviews,
  selectEnvironmentalDataviews,
} from 'features/dataviews/dataviews.selectors'
import { selectWorkspaces } from 'features/workspaces-list/workspaces-list.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { PRIVATE_SUFIX } from 'data/config'
import { selectUserStatus, selectUserLogged, GUEST_USER_TYPE, selectUserData } from './user.slice'

const DEFAULT_GROUP_ID = 'Default'
const PRIVATE_SUPPORTED_GROUPS = ['Indonesia', 'Peru', 'Panama']

export const isGuestUser = createSelector([selectUserData], (userData) => {
  return userData?.type === GUEST_USER_TYPE
})

export const isUserLogged = createSelector(
  [selectUserStatus, selectUserLogged],
  (status, logged) => {
    return status === AsyncReducerStatus.Finished && logged
  }
)

export const hasUserPermission = (permission: UserPermission) =>
  createSelector([selectUserData], (userData) => {
    if (!userData?.permissions) return false
    return checkExistPermissionInList(userData.permissions, permission)
  })

export const selectUserWorkspaceEditPermissions = hasUserPermission({
  type: 'entity',
  value: 'workspace',
  action: 'create-all',
})

export const selectUserDataviewEditPermissions = hasUserPermission({
  type: 'entity',
  value: 'dataview',
  action: 'create-all',
})

export const selectUserId = createSelector([selectUserData], (userData) => {
  return userData?.id
})

export const selectUserGroups = createSelector([selectUserData], (userData) => {
  return userData?.groups
})

export const selectUserGroupsClean = createSelector([selectUserGroups], (userGroups) => {
  return userGroups?.filter((g) => g !== DEFAULT_GROUP_ID)
})

export const selectUserWorkspaces = createSelector(
  [selectUserData, selectWorkspaces],
  (userData, workspaces) => {
    return orderBy(
      workspaces?.filter((workspace) => workspace.ownerId === userData?.id),
      'createdAt',
      'desc'
    )
  }
)

export const selectUserWorkspacesPrivate = createSelector(
  [selectUserGroups, selectWorkspaces],
  (userGroups = [], workspaces) => {
    const groupsWithAccess = userGroups
      .filter((g) => PRIVATE_SUPPORTED_GROUPS.includes(g))
      .map((g) => g.toLowerCase())
    return orderBy(
      workspaces?.filter(
        (workspace) =>
          workspace.id.includes(PRIVATE_SUFIX) &&
          groupsWithAccess.some((g) => workspace.id.includes(g))
      ),
      'createdAt',
      'desc'
    )
  }
)

export const selectUserDatasets = createSelector(
  [selectAllDatasets, selectUserId],
  (datasets, userId) => datasets?.filter((d) => d.ownerId === userId)
)

export const selectUserDatasetsByCategory = (datasetCategory: DatasetCategory) =>
  createSelector([selectUserDatasets], (datasets) =>
    datasets?.filter((d) => d.category === datasetCategory)
  )

export const selectUserDatasetsNotUsed = (datasetCategory: DatasetCategory) => {
  const dataviewsSelector =
    datasetCategory === DatasetCategory.Context
      ? selectContextAreasDataviews
      : selectEnvironmentalDataviews
  return createSelector(
    [selectUserDatasetsByCategory(datasetCategory), dataviewsSelector],
    (datasets, dataviews) => {
      const dataviewDatasets = dataviews?.flatMap(
        (dataview) => dataview.datasets?.flatMap(({ id }) => id || []) || []
      )
      return datasets.filter(
        ({ id, status }) => !dataviewDatasets?.includes(id) && status !== DatasetStatus.Error
      )
    }
  )
}
