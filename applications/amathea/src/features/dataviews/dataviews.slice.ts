import { createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'
import { Dataview, DataviewCreation } from '@globalfishingwatch/api-types'
import { SelectOption } from '@globalfishingwatch/ui-components/dist/select'
import { Generators } from '@globalfishingwatch/layer-composer'
import { RootState } from 'store'
import { AsyncReducer, createAsyncSlice } from 'features/api/api.slice'
import { getUserId } from 'features/user/user.slice'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { APP_NAME_FILTER } from 'data/config'

export const fetchDataviewsThunk = createAsyncThunk('dataviews/fetch', async () => {
  const data = await GFWAPI.fetch<Dataview[]>(`/v1/dataviews?app=${APP_NAME_FILTER}`)
  return data
})

const draftToAPIdataview = (draftDataview: DataviewDraft) => {
  const { dataset, color, colorRamp, steps, flagFilter } = draftDataview
  // TODO remove datasets when updated
  const dataview: DataviewCreation = {
    name: dataset.label,
    description: dataset.description,
    app: APP_NAME_FILTER,
    config: {
      type: Generators.Type.UserContext,
      color,
      colorRamp,
      dataset: 'marine-reserve-user',
      ...(steps && { steps }),
      ...(flagFilter && { flagFilter }),
    },
    datasetsConfig: [
      {
        datasetId: dataset.id as string,
        endpoint: 'user-context-tiles',
        params: [],
      },
    ],
  }
  return dataview
}
export const createDataviewThunk = createAsyncThunk(
  'dataviews/create',
  async (draftDataview: DataviewDraft) => {
    const dataview = draftToAPIdataview(draftDataview)
    const createdDataview = await GFWAPI.fetch<Dataview>('/v1/dataviews', {
      method: 'POST',
      body: dataview as any,
    })
    return createdDataview
  },
  {
    condition: (draftDataview) => {
      if (!draftDataview || !draftDataview.dataset) return false
    },
  }
)

export const updateDataviewThunk = createAsyncThunk(
  'dataviews/update',
  async (draftDataview: DataviewDraft) => {
    const dataview = draftToAPIdataview(draftDataview)
    const updatedDataview = await GFWAPI.fetch<Dataview>(`/v1/dataviews/${draftDataview.id}`, {
      method: 'PATCH',
      body: dataview as any,
    })
    return updatedDataview
  },
  {
    condition: (draftDataview) => {
      if (!draftDataview || !draftDataview.id) return false
    },
  }
)

export const deleteDataviewThunk = createAsyncThunk(
  'dataviews/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const dataview = await GFWAPI.fetch<Dataview>(`/v1/dataviews/${id}`, {
        method: 'DELETE',
      })
      return { ...dataview, id }
    } catch (e) {
      return rejectWithValue(id)
    }
  }
)

export type DataviewDraftDataset = SelectOption & {
  type: string
  description: string
  category?: string
}

export type DataviewDraft = {
  id?: number // used when needs update
  name?: string
  source?: SelectOption
  dataset: DataviewDraftDataset
  color?: string
  colorRamp?: Generators.ColorRampsIds
  flagFilter?: string
  steps?: number[]
  datasetsConfig?: any
}

export interface DataviewsState extends AsyncReducer<Dataview> {
  draft?: DataviewDraft
}

const { slice: dataviewsSlice, entityAdapter } = createAsyncSlice<DataviewsState, Dataview>({
  name: 'dataviews',
  reducers: {
    setDraftDataview: (state, action: PayloadAction<DataviewDraft>) => {
      state.draft = { ...state.draft, ...action.payload }
    },
    resetDraftDataview: (state, action: PayloadAction<undefined>) => {
      state.draft = action.payload
    },
  },
  thunks: {
    fetchThunk: fetchDataviewsThunk,
    createThunk: createDataviewThunk,
    updateThunk: updateDataviewThunk,
    deleteThunk: deleteDataviewThunk,
  },
})

export const { setDraftDataview, resetDraftDataview } = dataviewsSlice.actions

export const {
  selectAll: selectDataviews,
  selectById: selectDataviewById,
} = entityAdapter.getSelectors<RootState>((state) => state.dataviews)

export const selectDraftDataview = (state: RootState) => state.dataviews.draft
export const selectDataviewStatus = (state: RootState) => state.dataviews.status
export const selectDataviewStatusId = (state: RootState) => state.dataviews.statusId

export const selectAllDataviews = createSelector(
  [selectDataviews, selectAllDatasets],
  (dataviews, allDatasets) => {
    return dataviews.map((dataview) => {
      const dataviewDatasets = dataview.datasetsConfig?.map(({ datasetId }) => datasetId)
      const datasets = allDatasets.filter((dataset) => dataviewDatasets?.includes(dataset.id))
      return { ...dataview, datasets }
    })
  }
)

export const selectDrafDataviewSource = createSelector(
  [selectDraftDataview],
  (draftDataview) => draftDataview?.source
)

export const selectDrafDataviewDataset = createSelector(
  [selectDraftDataview],
  (draftDataview) => draftDataview?.dataset
)

export const selectDrafDataviewColor = createSelector(
  [selectDraftDataview],
  (draftDataview) => draftDataview?.dataset
)

export const selectShared = createSelector([selectAllDataviews, getUserId], (dataviews, userId) =>
  // TODO: make this real when editors in workspaces API
  dataviews.filter((w: any) => w.editors?.includes(userId))
)

export default dataviewsSlice.reducer
