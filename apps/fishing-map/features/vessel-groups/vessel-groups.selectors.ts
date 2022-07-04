import { createSelector } from '@reduxjs/toolkit'
import { selectActivityDatasets } from 'features/datasets/datasets.selectors'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { selectAllDataviewsInWorkspace } from 'features/dataviews/dataviews.selectors'
import { isAdvancedSearchAllowed } from 'features/search/search.selectors'
import { getDatasetsInDataviews } from 'features/datasets/datasets.utils'
import { isGFWUser } from 'features/user/user.slice'

export const selectVessselGroupsAllowed = createSelector(
  [isAdvancedSearchAllowed, isGFWUser],
  (advancedSearchAllowed, gfwUser) => {
    return gfwUser && advancedSearchAllowed
  }
)

export const selectActivityDatasetsInWorkspace = createSelector(
  [selectAllDataviewsInWorkspace, selectActivityDatasets, selectAllDatasets],
  (dataviews, vesselsDatasets, allDatasets) => {
    const datasetsIds = getDatasetsInDataviews(dataviews)
    const datasets = allDatasets.flatMap(({ id, relatedDatasets }) => {
      if (!datasetsIds.includes(id)) return []
      return [id, ...(relatedDatasets || []).map((d) => d.id)]
    })
    return vesselsDatasets.filter((dataset) => datasets.includes(dataset.id))
  }
)
