import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { uniqBy } from 'lodash'
import {
  GFWAPI,
  getAdvancedSearchQuery,
  ADVANCED_SEARCH_QUERY_FIELDS,
  parseAPIError,
} from '@globalfishingwatch/api-client'
import { resolveEndpoint } from '@globalfishingwatch/datasets-client'
import {
  Dataset,
  DatasetTypes,
  APIVesselSearchPagination,
  IdentityVessel,
  EndpointId,
  VesselIdentitySourceEnum,
} from '@globalfishingwatch/api-types'
import { AsyncError, AsyncReducerStatus } from 'utils/async-slice'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType, isFieldInFieldsAllowed } from 'features/datasets/datasets.utils'
import { VesselSearchState } from 'types'
import { IdentityVesselData, VesselDataIdentity } from 'features/vessel/vessel.slice'
import { getVesselId, getVesselIdentities } from 'features/vessel/vessel.utils'

export type VesselLastIdentity = Omit<IdentityVesselData, 'identities'> & VesselDataIdentity

interface SearchState {
  selectedVessels: string[]
  status: AsyncReducerStatus
  statusCode: number | undefined
  data: IdentityVesselData[]
  suggestion: string | null
  suggestionClicked: boolean
  pagination: {
    loading: boolean
    total: number
    since: string
  }
}
type SearchSliceState = { search: SearchState }

const paginationInitialState = { total: 0, since: '', loading: false }
const initialState: SearchState = {
  selectedVessels: [],
  status: AsyncReducerStatus.Idle,
  statusCode: undefined,
  pagination: paginationInitialState,
  data: [],
  suggestion: null,
  suggestionClicked: false,
}

export type VesselSearchThunk = {
  query: string
  since: string
  filters: VesselSearchState
  datasets: Dataset[]
  gfwUser?: boolean
}

export function checkAdvanceSearchFiltersEnabled(filters: VesselSearchState): boolean {
  const { sources, ...rest } = filters
  return Object.values(rest).filter((f) => f !== undefined).length > 0
}

export const fetchVesselSearchThunk = createAsyncThunk(
  'search/fetch',
  async (
    { query, filters, datasets, since, gfwUser = false }: VesselSearchThunk,
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

        const andCombinedFields = ADVANCED_SEARCH_QUERY_FIELDS.filter((f) => f !== 'shipname')

        const fields = andCombinedFields.flatMap((field) => {
          const isInFieldsAllowed = isFieldInFieldsAllowed({
            field,
            fieldsAllowed,
            infoSource: filters.infoSource,
          })

          const cleanField = field
            .replace(`${VesselIdentitySourceEnum.Registry}.`, '')
            .replace(`${VesselIdentitySourceEnum.SelfReported}.`, '')
          const filter = (filters as any)[cleanField]
          if (filter && isInFieldsAllowed) {
            let value = filter
            // Supports searching by multiple values separated by comma in owners
            if (field === 'owner' && value?.includes(', ')) {
              value = (value as string).split(', ')
            }
            return { key: field, value }
          }
          return []
        })

        if (query) {
          fields.push({
            key: 'shipname',
            value: query,
          })
        }
        if (!fields?.length) {
          console.warn('No fields to search found or allowed')
        }
        advancedQuery = getAdvancedSearchQuery(fields, { rootObject: filters.infoSource })
      }

      const datasetConfig = {
        endpoint: EndpointId.VesselSearch,
        datasetId: dataset.id,
        params: [],
        query: [
          { id: 'includes', value: ['MATCH_CRITERIA', 'OWNERSHIP'] },
          { id: 'datasets', value: datasets.map((d) => d.id) },
          {
            id: advancedQuery ? 'where' : 'query',
            value: encodeURIComponent(advancedQuery || query || ''),
          },
          { id: 'since', value: since },
        ],
      }
      if (!advancedQuery) {
        // datasetConfig.query.push({ id: 'match-fields', value: 'SEVERAL_FIELDS' })
      }

      const url = resolveEndpoint(dataset, datasetConfig)
      if (url) {
        const searchResults = await GFWAPI.fetch<APIVesselSearchPagination<IdentityVessel>>(url, {
          signal,
        })
        // Not removing duplicates for GFWStaff so they can compare other VS fishing vessels
        const uniqSearchResults = gfwUser
          ? searchResults.entries
          : uniqBy(searchResults.entries, 'selfReportedInfo[0].id')

        const vesselsWithDataset = uniqSearchResults.flatMap((vessel) => {
          if (!vessel) return []
          const infoDataset = selectDatasetById(vessel.dataset)(state as any)
          if (!infoDataset) return []

          const trackDatasetId = getRelatedDatasetByType(infoDataset, DatasetTypes.Tracks)?.id
          const {
            matchCriteria,
            registryOwners,
            registryPublicAuthorizations,
            combinedSourcesInfo,
          } = vessel
          return {
            id: getVesselId(vessel),
            ...(matchCriteria && { matchCriteria }),
            ...(registryOwners && { registryOwners }),
            ...(registryPublicAuthorizations && { registryPublicAuthorizations }),
            ...(combinedSourcesInfo && { combinedSourcesInfo }),
            dataset: infoDataset,
            info: infoDataset?.id,
            track: trackDatasetId,
            identities: getVesselIdentities(vessel),
          } as IdentityVesselData
        })

        return {
          data:
            since && currentResults
              ? currentResults.concat(vesselsWithDataset)
              : vesselsWithDataset,
          // TO DO: switch suggestions with DID YOU MEAN from API
          // suggestion: searchResults.metadata?.suggestion,
          pagination: {
            loading: false,
            total: searchResults.total,
            since: searchResults.since,
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
    setSelectedVessels: (state, action: PayloadAction<string[]>) => {
      const selection = action.payload
      if (selection.length === 0) {
        state.selectedVessels = []
      }
      if (selection.length === 1) {
        const vessel = selection[0]
        if (state.selectedVessels.includes(vessel)) {
          state.selectedVessels = state.selectedVessels.filter((id) => id !== vessel)
        } else {
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
      state.pagination.loading = action.meta.arg.since ? true : false
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
export const selectSelectedVesselsIds = (state: SearchSliceState) => state.search.selectedVessels
export const selectSelectedVessels = createSelector(
  [selectSearchResults, selectSelectedVesselsIds],
  (searchResults, vesselsSelectedIds) => {
    return searchResults.filter((vessel) => vesselsSelectedIds.includes(vessel.id))
  }
)

export default searchSlice.reducer
