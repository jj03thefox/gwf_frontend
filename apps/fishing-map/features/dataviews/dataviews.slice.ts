import { createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { uniqBy, memoize } from 'lodash'
import {
  DatasetConfigsTransforms,
  getDataviewsForResourceQuerying,
  getVesselIdFromDatasetConfig,
  mergeWorkspaceUrlDataviewInstances,
  resolveDataviews,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import {
  DatasetTypes,
  DataviewCategory,
  DataviewInstance,
  Dataview,
} from '@globalfishingwatch/api-types'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { GFWAPI } from '@globalfishingwatch/api-client'
import {
  selectWorkspaceStateProperty,
  selectWorkspaceDataviewInstances,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import { selectUrlDataviewInstances } from 'routes/routes.selectors'
import { AsyncReducerStatus, AsyncError, AsyncReducer, createAsyncSlice } from 'utils/async-slice'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { createDeepEqualSelector } from 'utils/selectors'
import { TimebarGraphs } from 'types'
import { isActivityDataview } from 'features/workspace/activity/activity.utils'
import { selectThinningConfig } from 'features/resources/resources.slice'
import { RootState } from 'store'

export const fetchDataviewByIdThunk = createAsyncThunk(
  'dataviews/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const dataview = await GFWAPI.fetch<Dataview>(`/v1/dataviews/${id}`)
      return dataview
    } catch (e: any) {
      return rejectWithValue({ status: e.status || e.code, message: `${id} - ${e.message}` })
    }
  }
)

export const fetchDataviewsByIdsThunk = createAsyncThunk(
  'dataviews/fetch',
  async (ids: number[], { signal, rejectWithValue, getState }) => {
    const existingIds = selectIds(getState() as RootState) as number[]
    const uniqIds = ids.filter((id) => !existingIds.includes(id))
    if (!uniqIds?.length) {
      return [] as Dataview[]
    }
    try {
      let dataviews = await GFWAPI.fetch<Dataview[]>(`/v1/dataviews?ids=${uniqIds.join(',')}`, {
        signal,
      })
      if (
        process.env.NODE_ENV === 'development' ||
        process.env.NEXT_PUBLIC_USE_LOCAL_DATAVIEWS === 'true'
      ) {
        const mockedDataviews = await import('./dataviews.mock')
        dataviews = uniqBy([...mockedDataviews.default, ...dataviews], 'id')
      }
      return dataviews
    } catch (e: any) {
      return rejectWithValue({ status: e.status || e.code, message: e.message })
    }
  }
)

export const createDataviewThunk = createAsyncThunk<
  Dataview,
  Partial<Dataview>,
  {
    rejectValue: AsyncError
  }
>('dataviews/create', async (dataview, { rejectWithValue }) => {
  try {
    const createdDataview = await GFWAPI.fetch<Dataview>('/v1/dataviews', {
      method: 'POST',
      body: dataview as any,
    })

    return createdDataview
  } catch (e: any) {
    return rejectWithValue({ status: e.status || e.code, message: e.message })
  }
})

export const updateDataviewThunk = createAsyncThunk<
  Dataview,
  Partial<Dataview>,
  {
    rejectValue: AsyncError
  }
>(
  'dataviews/update',
  async (partialDataview, { rejectWithValue }) => {
    try {
      const dataview = await GFWAPI.fetch<Dataview>(`/v1/dataviews/${partialDataview.id}`, {
        method: 'PATCH',
        body: partialDataview as any,
      })
      return dataview
    } catch (e: any) {
      return rejectWithValue({ status: e.status || e.code, message: e.message })
    }
  },
  {
    condition: (partialDataset) => {
      if (!partialDataset || !partialDataset.id) {
        console.warn('To update the dataset you need the id')
        return false
      }
    },
  }
)

export type ResourcesState = AsyncReducer<Dataview>

const { slice: dataviewsSlice, entityAdapter } = createAsyncSlice<ResourcesState, Dataview>({
  name: 'dataview',
  thunks: {
    fetchThunk: fetchDataviewsByIdsThunk,
    fetchByIdThunk: fetchDataviewByIdThunk,
    createThunk: createDataviewThunk,
    updateThunk: updateDataviewThunk,
  },
  reducers: {
    addDataviewEntity: (state, action: PayloadAction<Dataview>) => {
      entityAdapter.addOne(state, action.payload)
    },
  },
})

export const { addDataviewEntity } = dataviewsSlice.actions
export const { selectAll, selectById, selectIds } = entityAdapter.getSelectors<RootState>(
  (state) => state.dataviews
)

export function selectAllDataviews(state: RootState) {
  return selectAll(state)
}

export const selectDataviewById = memoize((id: number) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export const selectDataviewsStatus = (state: RootState) => state.dataviews.status

export const selectDataviewInstancesMerged = createSelector(
  [selectWorkspaceStatus, selectWorkspaceDataviewInstances, selectUrlDataviewInstances],
  (
    workspaceStatus,
    workspaceDataviewInstances,
    urlDataviewInstances = []
  ): UrlDataviewInstance[] | undefined => {
    if (workspaceStatus !== AsyncReducerStatus.Finished) {
      return
    }
    const mergedDataviewInstances = mergeWorkspaceUrlDataviewInstances(
      workspaceDataviewInstances as DataviewInstance<any>[],
      urlDataviewInstances
    )
    return mergedDataviewInstances
  }
)

export const selectAllDataviewInstancesResolved = createSelector(
  [selectDataviewInstancesMerged, selectAllDataviews, selectAllDatasets],
  (dataviewInstances, dataviews, datasets): UrlDataviewInstance[] | undefined => {
    if (!dataviewInstances) return
    const dataviewInstancesResolved = resolveDataviews(dataviewInstances, dataviews, datasets)
    return dataviewInstancesResolved
  }
)

/**
 * Calls getDataviewsForResourceQuerying to prepare track dataviews' datasetConfigs.
 * Injects app-specific logic by using getDataviewsForResourceQuerying's callback
 */
export const selectDataviewsForResourceQuerying = createSelector(
  [
    selectAllDataviewInstancesResolved,
    selectThinningConfig,
    selectWorkspaceStateProperty('timebarGraph'),
  ],
  (dataviewInstances, thinningConfig, timebarGraph) => {
    const datasetConfigsTransforms: DatasetConfigsTransforms = {
      [GeneratorType.Track]: ([info, track, ...events]) => {
        const trackWithThinning = track
        if (thinningConfig) {
          const thinningQuery = Object.entries(thinningConfig).map(([id, value]) => ({
            id,
            value,
          }))
          trackWithThinning.query = [...(track.query || []), ...thinningQuery]
        }

        const trackWithoutSpeed = trackWithThinning
        const query = [...(trackWithoutSpeed.query || [])]
        const fieldsQueryIndex = query.findIndex((q) => q.id === 'fields')
        let trackGraph
        if (timebarGraph !== TimebarGraphs.None) {
          trackGraph = { ...trackWithoutSpeed }
          const fieldsQuery = {
            id: 'fields',
            value: timebarGraph,
          }
          if (fieldsQueryIndex > -1) {
            query[fieldsQueryIndex] = fieldsQuery
            trackGraph.query = query
          } else {
            trackGraph.query = [...query, fieldsQuery]
          }
        }

        // Clean resources when mandatory vesselId is missing
        // needed for vessels with no info datasets (zebraX)
        const vesselData = getVesselIdFromDatasetConfig(info)
        return [
          trackWithoutSpeed,
          ...events,
          ...(vesselData ? [info] : []),
          ...(trackGraph ? [trackGraph] : []),
        ]
      },
    }
    return getDataviewsForResourceQuerying(dataviewInstances || [], datasetConfigsTransforms)
  }
)

export const selectDataviewInstancesResolved = createSelector(
  [selectDataviewsForResourceQuerying, selectWorkspaceStateProperty('activityCategory')],
  (dataviews = [], activityCategory) => {
    return dataviews.filter((dataview) => {
      const activityDataview = isActivityDataview(dataview)
      return activityDataview ? dataview.category === activityCategory : true
    })
  }
)
export const selectDataviewInstancesByType = (type: GeneratorType) => {
  return createSelector([selectDataviewInstancesResolved], (dataviews) => {
    return dataviews?.filter((dataview) => dataview.config?.type === type)
  })
}

export const selectTrackDataviews = createSelector(
  [selectDataviewInstancesByType(GeneratorType.Track)],
  (dataviews) => dataviews
)

export const selectVesselsDataviews = createSelector([selectTrackDataviews], (dataviews) => {
  return dataviews?.filter(
    (dataview) =>
      !dataview.datasets ||
      (dataview.datasets?.[0]?.type !== DatasetTypes.UserTracks &&
        dataview.category === DataviewCategory.Vessels)
  )
})

export const selectActiveVesselsDataviews = createDeepEqualSelector(
  [selectVesselsDataviews],
  (dataviews) => dataviews?.filter((d) => d.config?.visible)
)

export const selectActiveTrackDataviews = createDeepEqualSelector(
  [selectTrackDataviews],
  (dataviews) => dataviews?.filter((d) => d.config?.visible)
)

export default dataviewsSlice.reducer
