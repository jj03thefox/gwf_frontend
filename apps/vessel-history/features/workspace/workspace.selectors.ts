import { createSelector } from '@reduxjs/toolkit'
import { WorkspaceState, WorkspaceStateProperty } from 'types'
import { RootState } from 'features/app/app.hooks'
import { selectQueryParam } from 'routes/routes.selectors'
import { DEFAULT_WORKSPACE } from 'data/config'

export const selectWorkspace = (state: RootState) => state.workspace

export const selectCurrentWorkspaceId = createSelector([selectWorkspace], (workspace) => {
  return workspace?.id
})

export const selectWorkspaceViewport = createSelector([selectWorkspace], (workspace) => {
  return workspace?.viewport
})

export const selectWorkspaceTimeRange = createSelector([selectWorkspace], (workspace) => {
  return {
    start: workspace?.startAt,
    end: workspace?.endAt,
  }
})

export const selectWorkspaceDataviewInstances = createSelector([selectWorkspace], (workspace) => {
  return workspace?.dataviewInstances
})

export const selectWorkspaceState = createSelector(
  [selectWorkspace],
  (workspace): WorkspaceState => {
    return workspace?.state || ({} as WorkspaceState)
  }
)

export const selectWorkspaceProfileView = createSelector([selectWorkspace], (workspace) => {
  return workspace?.profileView
})

export const selectWorkspaceStateProperty = (property: WorkspaceStateProperty) =>
  createSelector(
    [selectQueryParam(property), selectWorkspaceState],
    (urlProperty, workspaceState) => {
      if (urlProperty !== undefined) return urlProperty
      return workspaceState[property] ?? DEFAULT_WORKSPACE[property]
    }
  )
