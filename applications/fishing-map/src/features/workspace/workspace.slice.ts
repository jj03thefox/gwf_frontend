import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import uniq from 'lodash/uniq'
import {
  Workspace,
  Dataview,
  DataviewInstance,
  WorkspaceUpsert,
} from '@globalfishingwatch/api-types'
import GFWAPI, { FetchOptions } from '@globalfishingwatch/api-client'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { WorkspaceState } from 'types'
import { RootState } from 'store'
import { fetchDatasetsByIdsThunk } from 'features/datasets/datasets.slice'
import { fetchDataviewsByIdsThunk } from 'features/dataviews/dataviews.slice'
import {
  selectLocationCategory,
  selectLocationType,
  selectUrlDataviewInstances,
  selectVersion,
} from 'routes/routes.selectors'
import { HOME, WORKSPACE } from 'routes/routes'
import { cleanQueryLocation, updateLocation } from 'routes/routes.actions'
import { selectCustomWorkspace } from 'features/app/app.selectors'
import { getWorkspaceEnv, WorkspaceCategories } from 'data/workspaces'
import { AsyncReducerStatus, AsyncError } from 'utils/async-slice'
import { selectWorkspaceStatus } from './workspace.selectors'

interface WorkspaceSliceState {
  status: AsyncReducerStatus
  // used to identify when someone saves its own version of the workspace
  customStatus: AsyncReducerStatus
  error: AsyncError
  data: Workspace<WorkspaceState> | null
}

const initialState: WorkspaceSliceState = {
  status: AsyncReducerStatus.Idle,
  customStatus: AsyncReducerStatus.Idle,
  error: {},
  data: null,
}

type RejectedActionPayload = {
  workspace: Workspace<WorkspaceState>
  error: AsyncError
}

export const getDefaultWorkspace = () => {
  const workspaceEnv = getWorkspaceEnv()
  const workspace = import(`../../data/default-workspaces/workspace.${workspaceEnv}`).then(
    (m) => m.default
  )
  return workspace as Promise<Workspace<WorkspaceState>>
}

export const getDatasetByDataview = (
  dataviews: (Dataview | DataviewInstance | UrlDataviewInstance)[]
) => {
  return uniq(
    dataviews?.flatMap((dataviews) => {
      if (!dataviews.datasetsConfig) return []
      return dataviews.datasetsConfig.map(({ datasetId }) => datasetId)
    })
  )
}

export const fetchWorkspaceThunk = createAsyncThunk(
  'workspace/fetch',
  async (workspaceId: string, { signal, dispatch, getState, rejectWithValue }) => {
    const state = getState() as RootState
    const version = selectVersion(state)
    const locationType = selectLocationType(state)
    const urlDataviewInstances = selectUrlDataviewInstances(state)

    try {
      let workspace = workspaceId
        ? await GFWAPI.fetch<Workspace<WorkspaceState>>(`/${version}/workspaces/${workspaceId}`, {
            signal,
          })
        : null
      if (!workspace && locationType === HOME) {
        workspace = await getDefaultWorkspace()
      }

      if (!workspace) {
        return
      }
      const dataviewIds = [
        ...(workspace.dataviews?.map(({ id }) => id as number) || []),
        ...uniq(workspace.dataviewInstances?.map(({ dataviewId }) => dataviewId)),
      ]

      let dataviews: Dataview[] = []
      if (dataviewIds?.length) {
        const fetchDataviewsAction: any = dispatch(fetchDataviewsByIdsThunk(dataviewIds))
        signal.addEventListener('abort', fetchDataviewsAction.abort)
        const { payload } = await fetchDataviewsAction
        if (payload?.length) {
          dataviews = payload
        }
      }

      if (!signal.aborted) {
        const dataviewInstances = [
          ...dataviews,
          ...(workspace.dataviewInstances || []),
          ...(urlDataviewInstances || []),
        ]
        const datasets = getDatasetByDataview(dataviewInstances)
        const fetchDatasetsAction: any = dispatch(fetchDatasetsByIdsThunk(datasets))
        signal.addEventListener('abort', fetchDatasetsAction.abort)
        const { error, payload } = await fetchDatasetsAction
        if (error) {
          return rejectWithValue({ workspace, error: payload })
        }
      }

      return workspace
    } catch (e) {
      return rejectWithValue({ error: e as AsyncError })
    }
  },
  {
    condition: (workspaceId, { getState }) => {
      const workspaceStatus = selectWorkspaceStatus(getState() as RootState)
      // Fetched already in progress, don't need to re-fetch
      return workspaceStatus !== AsyncReducerStatus.Loading
    },
  }
)

export const saveCurrentWorkspaceThunk = createAsyncThunk(
  'workspace/saveCurrent',
  async (defaultName: string, { dispatch, getState }) => {
    const state = getState() as RootState
    const mergedWorkspace = selectCustomWorkspace(state)

    const saveWorkspace = async (tries = 0): Promise<Workspace<WorkspaceState> | undefined> => {
      let workspaceUpdated
      try {
        const version = selectVersion(state)
        const name = tries > 0 ? defaultName + `_${tries}` : defaultName
        workspaceUpdated = await GFWAPI.fetch<Workspace<WorkspaceState>>(`/${version}/workspaces`, {
          method: 'POST',
          body: { ...mergedWorkspace, name },
        } as FetchOptions<WorkspaceUpsert<WorkspaceState>>)
      } catch (e) {
        // Means we already have a workspace with this name
        if (e.status === 400) {
          return await saveWorkspace(tries + 1)
        }
        throw e
      }
      return workspaceUpdated
    }

    const workspaceUpdated = await saveWorkspace()
    const locationType = selectLocationType(state)
    const locationCategory = selectLocationCategory(state) || WorkspaceCategories.FishingActivity
    if (workspaceUpdated) {
      dispatch(
        updateLocation(locationType === HOME ? WORKSPACE : locationType, {
          payload: {
            category: locationCategory,
            workspaceId: workspaceUpdated.id,
          },
          replaceQuery: true,
        })
      )
    }
    return workspaceUpdated
  }
)

export const updatedCurrentWorkspaceThunk = createAsyncThunk(
  'workspace/updatedCurrent',
  async (workspaceId: string, { dispatch, getState }) => {
    const state = getState() as RootState
    const version = selectVersion(state)
    const workspace = selectCustomWorkspace(state)

    const workspaceUpdated = await GFWAPI.fetch<Workspace<WorkspaceState>>(
      `/${version}/workspaces/${workspaceId}`,
      {
        method: 'PATCH',
        body: workspace,
      } as FetchOptions<WorkspaceUpsert<WorkspaceState>>
    )
    if (workspaceUpdated) {
      dispatch(cleanQueryLocation())
    }
    return workspaceUpdated
  }
)

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchWorkspaceThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchWorkspaceThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      if (action.payload) {
        state.data = action.payload
      }
    })
    builder.addCase(fetchWorkspaceThunk.rejected, (state, action) => {
      if (action.payload) {
        const { workspace, error } = action.payload as RejectedActionPayload
        state.status = AsyncReducerStatus.Error
        if (workspace) {
          state.data = workspace
        }
        if (error) {
          state.error = error
        }
      } else {
        // This means action was cancelled
        state.status = AsyncReducerStatus.Idle
      }
    })
    builder.addCase(saveCurrentWorkspaceThunk.pending, (state) => {
      state.customStatus = AsyncReducerStatus.Loading
    })
    builder.addCase(saveCurrentWorkspaceThunk.fulfilled, (state, action) => {
      state.customStatus = AsyncReducerStatus.Finished
      if (action.payload) {
        state.data = action.payload
      }
    })
    builder.addCase(saveCurrentWorkspaceThunk.rejected, (state) => {
      state.customStatus = AsyncReducerStatus.Error
    })
    builder.addCase(updatedCurrentWorkspaceThunk.pending, (state) => {
      state.customStatus = AsyncReducerStatus.Loading
    })
    builder.addCase(updatedCurrentWorkspaceThunk.fulfilled, (state, action) => {
      state.customStatus = AsyncReducerStatus.Finished
      if (action.payload) {
        state.data = action.payload
      }
    })
    builder.addCase(updatedCurrentWorkspaceThunk.rejected, (state) => {
      state.customStatus = AsyncReducerStatus.Error
    })
  },
})

export default workspaceSlice.reducer
