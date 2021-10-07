import { createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { memoize, uniqBy, without, kebabCase, uniq } from 'lodash'
import { stringify } from 'qs'
import { Dataset, DatasetCategory, EndpointId, UploadResponse } from '@globalfishingwatch/api-types'
import GFWAPI from '@globalfishingwatch/api-client'
import {
  asyncInitialState,
  AsyncReducer,
  createAsyncSlice,
  AsyncError,
  AsyncReducerStatus,
} from 'utils/async-slice'
import { RootState } from 'store'
import { LATEST_CARRIER_DATASET_ID, PUBLIC_SUFIX } from 'data/config'

export const PRESENCE_DATASET_ID = 'public-global-presence'
export const PRESENCE_TRACKS_DATASET_ID = 'private-global-presence-tracks'
export const DATASETS_USER_SOURCE_ID = 'user'
export const EARTH_ENGINE_POC_ID = 'public-ee-poc'

const parsePOCsDatasets = (dataset: Dataset) => {
  if (dataset.id.includes(EARTH_ENGINE_POC_ID)) {
    const pocDataset = {
      ...dataset,
      endpoints: dataset.endpoints?.map((endpoint) => {
        if (endpoint.id === EndpointId.FourwingsTiles) {
          return {
            ...endpoint,
            pathTemplate:
              'https://dev-api-4wings-tiler-gee-poc-jzzp2ui3wq-uc.a.run.app/v1/4wings/tile/heatmap/{z}/{x}/{y}',
          }
        }
        return endpoint
      }),
    }
    return pocDataset
  }
  return dataset
}

export const fetchDatasetByIdThunk = createAsyncThunk<
  Dataset,
  string,
  {
    rejectValue: AsyncError
  }
>('datasets/fetchById', async (id: string, { rejectWithValue }) => {
  try {
    const dataset = await GFWAPI.fetch<Dataset>(`/v1/datasets/${id}?include=endpoints&cache=false`)
    return parsePOCsDatasets(dataset)
  } catch (e: any) {
    return rejectWithValue({
      status: e.status || e.code,
      message: `${id} - ${e.message}`,
    })
  }
})

export const fetchDatasetsByIdsThunk = createAsyncThunk(
  'datasets/fetch',
  async (ids: string[] = [], { signal, rejectWithValue, getState }) => {
    const existingIds = selectIds(getState() as RootState) as string[]
    const uniqIds = ids?.length ? ids.filter((id) => !existingIds.includes(id)) : []

    try {
      const workspacesParams = {
        ...(uniqIds?.length && { ids: uniqIds }),
        include: 'endpoints',
        cache: false,
      }
      const initialDatasets = await GFWAPI.fetch<Dataset[]>(
        `/v1/datasets?${stringify(workspacesParams, { arrayFormat: 'comma' })}`,
        { signal }
      )
      const relatedDatasetsIds = uniq(
        initialDatasets.flatMap(
          (dataset) => dataset.relatedDatasets?.flatMap(({ id }) => id || []) || []
        )
      )
      const uniqRelatedDatasetsIds = without(relatedDatasetsIds, ...existingIds).join(',')
      const relatedWorkspaceParams = { ...workspacesParams, ids: uniqRelatedDatasetsIds }
      const relatedDatasets = await GFWAPI.fetch<Dataset[]>(
        `/v1/datasets?${stringify(relatedWorkspaceParams, { arrayFormat: 'comma' })}`,
        { signal }
      )
      let datasets = uniqBy([...initialDatasets, ...relatedDatasets], 'id')
      if (
        process.env.NODE_ENV === 'development' ||
        process.env.REACT_APP_USE_LOCAL_DATASETS === 'true'
      ) {
        const mockedDatasets = await import('./datasets.mock')
        datasets = uniqBy([...mockedDatasets.default, ...datasets], 'id')
      }
      return datasets.map(parsePOCsDatasets)
    } catch (e: any) {
      return rejectWithValue({ status: e.status || e.code, message: e.message })
    }
  }
)

export const fetchAllDatasetsThunk = createAsyncThunk('datasets/all', (_, { dispatch }) => {
  return dispatch(fetchDatasetsByIdsThunk([]))
})

export type CreateDataset = { dataset: Partial<Dataset>; file: File; createAsPublic: boolean }
export const createDatasetThunk = createAsyncThunk<
  Dataset,
  CreateDataset,
  {
    rejectValue: AsyncError
  }
>('datasets/create', async ({ dataset, file, createAsPublic }, { rejectWithValue }) => {
  try {
    const { url, path } = await GFWAPI.fetch<UploadResponse>('/v1/upload', {
      method: 'POST',
      body: {
        contentType: dataset.configuration?.format === 'geojson' ? 'application/json' : file.type,
      } as any,
    })
    await fetch(url, { method: 'PUT', body: file })

    // API needs to have the value in lowercase
    const propertyToInclude = (dataset.configuration?.propertyToInclude as string)?.toLowerCase()
    const id = `${kebabCase(dataset.name)}-${Date.now()}`
    const datasetWithFilePath = {
      ...dataset,
      description: dataset.description || dataset.name,
      id: createAsPublic ? `${PUBLIC_SUFIX}-${id}` : id,
      source: DATASETS_USER_SOURCE_ID,
      configuration: {
        ...dataset.configuration,
        ...(propertyToInclude && { propertyToInclude }),
        filePath: path,
      },
    }

    const createdDataset = await GFWAPI.fetch<Dataset>('/v1/datasets', {
      method: 'POST',
      body: datasetWithFilePath as any,
    })

    return createdDataset
  } catch (e: any) {
    return rejectWithValue({ status: e.status || e.code, message: e.message })
  }
})

export const updateDatasetThunk = createAsyncThunk<
  Dataset,
  Partial<Dataset>,
  {
    rejectValue: AsyncError
  }
>(
  'datasets/update',
  async (partialDataset, { rejectWithValue }) => {
    try {
      const updatedDataset = await GFWAPI.fetch<Dataset>(`/v1/datasets/${partialDataset.id}`, {
        method: 'PATCH',
        body: partialDataset as any,
      })
      return updatedDataset
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

export const deleteDatasetThunk = createAsyncThunk<
  Dataset,
  string,
  {
    rejectValue: AsyncError
  }
>('datasets/delete', async (id: string, { rejectWithValue }) => {
  try {
    const dataset = await GFWAPI.fetch<Dataset>(`/v1/datasets/${id}`, {
      method: 'DELETE',
    })
    return { ...dataset, id }
  } catch (e: any) {
    return rejectWithValue({ status: e.status || e.code, message: e.message })
  }
})

export const fetchLastestCarrierDatasetThunk = createAsyncThunk<
  Dataset,
  undefined,
  {
    rejectValue: AsyncError
  }
>('datasets/fetchLatestCarrier', async (_, { rejectWithValue }) => {
  try {
    const dataset = await GFWAPI.fetch<Dataset>(`/datasets/${LATEST_CARRIER_DATASET_ID}`)
    return dataset
  } catch (e: any) {
    return rejectWithValue({
      status: e.status || e.code,
      message: `${LATEST_CARRIER_DATASET_ID} - ${e.message}`,
    })
  }
})

export type DatasetModals = 'new' | 'edit' | undefined
export interface DatasetsState extends AsyncReducer<Dataset> {
  datasetModal: DatasetModals
  datasetCategory: DatasetCategory
  editingDatasetId: string | undefined
  allDatasetsRequested: boolean
  carrierLatest: {
    status: AsyncReducerStatus
    dataset: Dataset | undefined
  }
}
const initialState: DatasetsState = {
  ...asyncInitialState,
  datasetModal: undefined,
  datasetCategory: DatasetCategory.Context,
  allDatasetsRequested: false,
  editingDatasetId: undefined,
  carrierLatest: {
    status: AsyncReducerStatus.Idle,
    dataset: undefined,
  },
}

const { slice: datasetSlice, entityAdapter } = createAsyncSlice<DatasetsState, Dataset>({
  name: 'datasets',
  initialState,
  reducers: {
    setDatasetModal: (state, action: PayloadAction<DatasetModals>) => {
      if (state.datasetModal === 'edit' && action.payload === undefined) {
        state.editingDatasetId = undefined
      }
      state.datasetModal = action.payload
    },
    setDatasetCategory: (state, action: PayloadAction<DatasetCategory>) => {
      state.datasetCategory = action.payload
    },
    setEditingDatasetId: (state, action: PayloadAction<string>) => {
      state.editingDatasetId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllDatasetsThunk.fulfilled, (state) => {
      state.allDatasetsRequested = true
    })
    builder.addCase(fetchLastestCarrierDatasetThunk.pending, (state) => {
      state.carrierLatest.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchLastestCarrierDatasetThunk.fulfilled, (state, action) => {
      state.carrierLatest.status = AsyncReducerStatus.Finished
      if (action.payload) {
        state.carrierLatest.dataset = action.payload
      }
    })
    builder.addCase(fetchLastestCarrierDatasetThunk.rejected, (state) => {
      state.carrierLatest.status = AsyncReducerStatus.Error
    })
  },
  thunks: {
    fetchThunk: fetchDatasetsByIdsThunk,
    fetchByIdThunk: fetchDatasetByIdThunk,
    updateThunk: updateDatasetThunk,
    createThunk: createDatasetThunk,
    deleteThunk: deleteDatasetThunk,
  },
})

export const { setDatasetModal, setDatasetCategory, setEditingDatasetId } = datasetSlice.actions

export const {
  selectAll: selectAllDatasets,
  selectById,
  selectIds,
} = entityAdapter.getSelectors<RootState>((state) => state.datasets)

export const selectDatasetById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export const selectDatasetsStatus = (state: RootState) => state.datasets.status
export const selectDatasetsStatusId = (state: RootState) => state.datasets.statusId
export const selectDatasetsError = (state: RootState) => state.datasets.error
export const selectEditingDatasetId = (state: RootState) => state.datasets.editingDatasetId
export const selectAllDatasetsRequested = (state: RootState) => state.datasets.allDatasetsRequested
export const selectDatasetModal = (state: RootState) => state.datasets.datasetModal
export const selectCarrierLatestDataset = (state: RootState) => state.datasets.carrierLatest.dataset
export const selectCarrierLatestDatasetStatus = (state: RootState) =>
  state.datasets.carrierLatest.status
export const selectDatasetCategory = (state: RootState) => state.datasets.datasetCategory

export default datasetSlice.reducer
