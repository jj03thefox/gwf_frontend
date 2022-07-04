import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Vessel, VesselGroup, VesselGroupUpsert } from '@globalfishingwatch/api-types'
import { GFWAPI, FetchOptions, parseAPIError } from '@globalfishingwatch/api-client'
import {
  AsyncError,
  asyncInitialState,
  AsyncReducer,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'
import { API_VERSION } from 'data/config'
import { RootState } from 'store'

interface VesselGroupsSliceState extends AsyncReducer<VesselGroup> {
  isModalOpen: boolean
  vessels: Vessel[]
  currentDataviewId: string
}

const initialState: VesselGroupsSliceState = {
  ...asyncInitialState,
  isModalOpen: false,
  currentDataviewId: undefined,
  vessels: undefined,
}

export const fetchAllVesselGroupsThunk = createAsyncThunk(
  'vessel-groups/all',
  async () => {
    const url = `/${API_VERSION}/vessel-groups`
    const vesselGroups = (await GFWAPI.fetch(url)) as any
    return vesselGroups.entries as VesselGroup[]
  },
  {
    condition: (_, { getState }) => {
      const vesselGroupsStatus = (getState() as any).vesselGroups.status
      // Fetched already in progress, don't need to re-fetch
      return vesselGroupsStatus !== AsyncReducerStatus.Loading
    },
  }
)

export const createVesselGroupThunk = createAsyncThunk(
  'vessel-groups/create',
  async (vesselGroup: VesselGroupUpsert, { dispatch, getState }) => {
    // const url = [`/${API_VERSION}/vessel-groups/`, vesselGroup.id ? vesselGroup.id : ''].join('')
    // const method = vesselGroup.id ? 'PATCH' : 'POST'
    const url = `/${API_VERSION}/vessel-groups/`
    const method = 'POST'

    const vesselGroupUpdated = await GFWAPI.fetch<VesselGroup>(url, {
      method,
      body: vesselGroup,
    } as FetchOptions<any>)
    return vesselGroupUpdated
  }
)

export const deleteVesselGroupThunk = createAsyncThunk<
  VesselGroup,
  string,
  {
    rejectValue: AsyncError
  }
>('vessel-groups/delete', async (id: any, { rejectWithValue }) => {
  try {
    const vesselGroup = await GFWAPI.fetch<VesselGroup>(`/${API_VERSION}/vessel-groups/${id}`, {
      method: 'DELETE',
    })
    return { ...vesselGroup, id }
  } catch (e: any) {
    console.warn(e)
    return rejectWithValue(parseAPIError(e))
  }
})

export const { slice: vesselGroupsSlice, entityAdapter } = createAsyncSlice<
  VesselGroupsSliceState,
  VesselGroup
>({
  name: 'vesselGroups',
  initialState,
  reducers: {
    setVesselGroupsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload
    },
    setVesselGroupVessels: (state, action: PayloadAction<Vessel[]>) => {
      state.vessels = action.payload
    },
    setCurrentDataviewId: (state, action: PayloadAction<string>) => {
      state.currentDataviewId = action.payload
    },
  },
  thunks: {
    fetchThunk: fetchAllVesselGroupsThunk,
    // updateThunk: updateDatasetThunk,
    createThunk: createVesselGroupThunk,
    deleteThunk: deleteVesselGroupThunk,
  },
})

export const { setVesselGroupsModalOpen, setVesselGroupVessels, setCurrentDataviewId } =
  vesselGroupsSlice.actions

export const { selectAll: selectAllVesselGroups } = entityAdapter.getSelectors<RootState>(
  (state) => state.vesselGroups
)

export const selectVesselGroupModalOpen = (state: RootState) => state.vesselGroups.isModalOpen
export const selectVesselGroupsStatus = (state: RootState) => state.vesselGroups.status
export const selectVesselGroupVessels = (state: RootState) => state.vesselGroups.vessels
export const selectVesselGroupsStatusId = (state: RootState) => state.vesselGroups.statusId
export const selectCurrentDataviewId = (state: RootState) => state.vesselGroups.currentDataviewId

export default vesselGroupsSlice.reducer
