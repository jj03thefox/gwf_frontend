import { createSelector } from '@reduxjs/toolkit'
import { isAdvancedSearchAllowed } from 'features/search/search.selectors'
import { selectUrlDataviewInstances } from 'routes/routes.selectors'
import {
  MAX_VESSEL_GROUP_VESSELS,
  selectNewVesselGroupSearchVessels,
  selectVesselGroupSearchVessels,
} from 'features/vessel-groups/vessel-groups.slice'
import { selectWorkspaceDataviewInstances } from 'features/workspace/workspace.selectors'
import { selectHasUserGroupsPermissions } from 'features/user/selectors/user.permissions.selectors'
import { selectDataviewInstancesResolvedVisible } from 'features/dataviews/selectors/dataviews.selectors'

export const selectAllVesselGroupSearchVessels = createSelector(
  [selectVesselGroupSearchVessels, selectNewVesselGroupSearchVessels],
  (vessels, newVessels) => {
    return [...(newVessels || []), ...(vessels || [])]
  }
)

export const selectHasVesselGroupVesselsOverflow = createSelector(
  [selectAllVesselGroupSearchVessels],
  (vessels = []) => {
    return vessels.length > MAX_VESSEL_GROUP_VESSELS
  }
)

export const selectHasVesselGroupSearchVessels = createSelector(
  [selectAllVesselGroupSearchVessels],
  (vessels = []) => {
    return vessels.length > 0
  }
)

export const selectVessselGroupsAllowed = createSelector(
  [selectHasUserGroupsPermissions, isAdvancedSearchAllowed],
  (hasUserGroupsPermissions, advancedSearchAllowed) => {
    return hasUserGroupsPermissions && advancedSearchAllowed
  }
)

export const selectWorkspaceVessselGroupsIds = createSelector(
  [selectWorkspaceDataviewInstances, selectUrlDataviewInstances],
  (workspaceDataviewInstances = [], urlDataviewInstances = []) => {
    return [...workspaceDataviewInstances, ...urlDataviewInstances].flatMap(
      (dvi) => dvi?.config?.filters?.['vessel-groups'] || []
    )
  }
)

export const selectIsVessselGroupsFiltering = createSelector(
  [selectWorkspaceVessselGroupsIds],
  (workspaceVesselGroupIds = []) => {
    return workspaceVesselGroupIds.length > 0
  }
)

export const selectVessselGroupsInWorkspace = createSelector(
  [selectDataviewInstancesResolvedVisible],
  (dataviews = []) => {
    return dataviews.flatMap((dataview) => dataview.config?.filters?.['vessel-groups'] || [])
  }
)
