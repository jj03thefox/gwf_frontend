import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { uniqBy } from 'lodash'
import {
  GFWAPI,
  getAdvancedSearchQuery,
  AdvancedSearchQueryField,
  AdvancedSearchQueryFieldKey,
  parseAPIError,
} from '@globalfishingwatch/api-client'
import { resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import {
  Dataset,
  DatasetTypes,
  Vessel,
  APIPagination,
  VesselSearch,
  EndpointId,
} from '@globalfishingwatch/api-types'
import { MultiSelectOption } from '@globalfishingwatch/ui-components'
import { AsyncError, AsyncReducerStatus } from 'utils/async-slice'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType, SupportedDatasetSchema } from 'features/datasets/datasets.utils'

export const RESULTS_PER_PAGE = 20

export type VesselWithDatasets = Omit<Vessel, 'dataset'> & {
  dataset: Dataset
  trackDatasetId?: string
}
export type SearchType = 'basic' | 'advanced'
export type SearchFilter = {
  lastTransmissionDate?: string
  firstTransmissionDate?: string
  mmsi?: string
  imo?: string
  callsign?: string
  owner?: string
  sources?: MultiSelectOption<string>[]
} & Partial<Record<SupportedDatasetSchema, MultiSelectOption<string>[]>>

interface SearchState {
  selectedVessels: VesselWithDatasets[]
  status: AsyncReducerStatus
  statusCode: number | undefined
  data: VesselWithDatasets[] | null
  suggestion: string | null
  suggestionClicked: boolean
  option: SearchType
  pagination: {
    loading: boolean
    total: number
    offset: number
  }
}
type SearchSliceState = { search: SearchState }

const paginationInitialState = { total: 0, offset: 0, loading: false }
const initialState: SearchState = {
  selectedVessels: [],
  status: AsyncReducerStatus.Idle,
  statusCode: undefined,
  pagination: paginationInitialState,
  data: null,
  suggestion: null,
  suggestionClicked: false,
  option: 'basic',
}

export type VesselSearchThunk = {
  query: string
  offset: number
  filters: SearchFilter
  datasets: Dataset[]
  gfwUser?: boolean
}

export function checkAdvanceSearchFiltersEnabled(filters: SearchFilter): boolean {
  const { sources, ...rest } = filters
  return Object.values(rest).filter((f) => f !== undefined).length > 0
}

export const fetchVesselSearchThunk = createAsyncThunk(
  'search/fetch',
  async (
    { query, filters, datasets, offset, gfwUser = false }: VesselSearchThunk,
    { getState, signal, rejectWithValue }
  ) => {
    const state = getState() as SearchSliceState
    const dataset = datasets[0]
    const currentResults = selectSearchResults(state)
    let advancedQuery
    try {
      if (checkAdvanceSearchFiltersEnabled(filters)) {
        const fieldsAllowed = Array.from(
          new Set(datasets.flatMap((dataset) => dataset.fieldsAllowed))
        )

        const andCombinedFields: AdvancedSearchQueryFieldKey[] = [
          'geartype',
          'targetSpecies',
          'flag',
          'fleet',
          'origin',
          'lastTransmissionDate',
          'firstTransmissionDate',
          'mmsi',
          'imo',
          'codMarinha',
        ]

        const fields: AdvancedSearchQueryField[] = [
          {
            key: 'shipname',
            value: query,
          },
          ...andCombinedFields.flatMap((field) => {
            if (filters[field] && fieldsAllowed.includes(field)) {
              return {
                key: field,
                value: filters[field],
              }
            }
            return []
          }),
        ]
        advancedQuery = getAdvancedSearchQuery(fields)
      }

      const datasetConfig = {
        endpoint: advancedQuery ? EndpointId.VesselAdvancedSearch : EndpointId.VesselSearch,
        datasetId: dataset.id,
        params: [],
        query: [
          { id: 'datasets', value: datasets.map((d) => d.id) },
          // { id: 'limit', value: RESULTS_PER_PAGE },
          // { id: 'offset', value: offset },
          {
            id: advancedQuery ? 'where' : 'query',
            value: encodeURIComponent(advancedQuery || query),
          },
        ],
      }

      const url = resolveEndpoint(dataset, datasetConfig)
      if (url) {
        const searchResults = await GFWAPI.fetch<APIPagination<VesselSearch>>(url, {
          signal,
        })
        // Not removing duplicates for GFWStaff so they can compare other VS fishing vessels
        const uniqSearchResults = gfwUser
          ? searchResults.entries
          : uniqBy(searchResults.entries, 'id')

        const vesselsWithDataset = uniqSearchResults.flatMap((vessel) => {
          if (!vessel) return []
          const infoDataset = selectDatasetById(vessel.dataset)(state as any)
          if (!infoDataset) return []

          const trackDatasetId = getRelatedDatasetByType(infoDataset, DatasetTypes.Tracks)?.id
          return {
            ...vessel,
            dataset: infoDataset,
            trackDatasetId,
          }
        })

        return {
          data:
            offset > 0 && currentResults
              ? currentResults.concat(vesselsWithDataset)
              : vesselsWithDataset,
          suggestion: searchResults.metadata?.suggestion,
          pagination: {
            loading: false,
            total: searchResults.total,
            offset: searchResults.nextOffset,
          },
        }
      }
    } catch (e: any) {
      return rejectWithValue(parseAPIError(e))
    }
  }
)

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSelectedVessels: (state, action: PayloadAction<VesselWithDatasets[]>) => {
      const selection = action.payload
      if (selection.length === 0) {
        state.selectedVessels = []
      }
      if (selection.length === 1) {
        const selectedIds = state.selectedVessels.map((vessel) => vessel.id)
        const vessel = selection[0]
        if (selectedIds.includes(vessel.id)) {
          state.selectedVessels = state.selectedVessels.filter((v) => v.id !== vessel.id)
        } else if (vessel && vessel.dataset && vessel.trackDatasetId) {
          state.selectedVessels = [...state.selectedVessels, vessel]
        }
      } else {
        state.selectedVessels = selection
      }
    },
    setSuggestionClicked: (state, action: PayloadAction<boolean>) => {
      state.suggestionClicked = action.payload
    },
    cleanVesselSearchResults: (state) => {
      state.status = initialState.status
      state.suggestion = initialState.suggestion
      state.suggestionClicked = false
      state.data = initialState.data
      state.pagination = paginationInitialState
      state.selectedVessels = initialState.selectedVessels
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchVesselSearchThunk.pending, (state, action) => {
      state.status = AsyncReducerStatus.Loading
      state.pagination.loading = action.meta.arg.offset > 0
    })
    builder.addCase(fetchVesselSearchThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      const payload = action.payload as any
      if (payload) {
        state.data = payload.data
        state.suggestion = payload.suggestion
        state.pagination = payload.pagination
      }
    })
    builder.addCase(fetchVesselSearchThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.status = AsyncReducerStatus.Aborted
      } else {
        state.data = initialState.data
        state.pagination = paginationInitialState
        state.status = AsyncReducerStatus.Error
        state.statusCode = (action.payload as AsyncError)?.status
      }
    })
  },
})

export const { setSelectedVessels, setSuggestionClicked, cleanVesselSearchResults } =
  searchSlice.actions

export const selectSearchResults = (state: SearchSliceState) => state.search.data
export const selectSearchStatus = (state: SearchSliceState) => state.search.status
export const selectSearchStatusCode = (state: SearchSliceState) => state.search.statusCode
export const selectSearchSuggestion = (state: SearchSliceState) => state.search.suggestion
export const selectSearchSuggestionClicked = (state: SearchSliceState) =>
  state.search.suggestionClicked
export const selectSearchPagination = (state: SearchSliceState) => state.search.pagination
export const selectSelectedVessels = (state: SearchSliceState) => state.search.selectedVessels

export default searchSlice.reducer
