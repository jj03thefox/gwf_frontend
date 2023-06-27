import { createAsyncThunk } from '@reduxjs/toolkit'
import { GFWAPI } from '@globalfishingwatch/api-client'
import {
  asyncInitialState,
  AsyncReducer,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'
import { RootState } from 'store'
import { sortFields } from 'utils/shared'

export type RegionId = string | number
export enum MarineRegionType {
  eez = 'eez',
  rfmo = 'rfmo',
  mpa = 'mpa',
}

export interface Region {
  id: string
  label: string
}
export interface GroupRegions {
  id: RegionId
  type: MarineRegionType
}
export interface Regions {
  id: RegionId
  data: Region[]
}
export type RegionsState = AsyncReducer<Regions>

const initialState: RegionsState = {
  ...asyncInitialState,
}

export const fetchRegionsThunk = createAsyncThunk(
  'regions/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const apiUrl = `/datasets`
      const options = {}
      const promises = [
        GFWAPI.fetch<Region[]>(`${apiUrl}/public-eez-areas/user-context-layer-v1`, options),
        GFWAPI.fetch<Region[]>(`${apiUrl}/public-mpa-all/user-context-layer-v1`, options),
        GFWAPI.fetch<Region[]>(`${apiUrl}/public-rfmo/user-context-layer-v1`, options),
      ]
      const regions = await Promise.allSettled(promises)
      const result: Regions[] = [
        {
          id: MarineRegionType.eez,
          data: regions[0]?.status === 'fulfilled' ? regions[0].value.sort(sortFields) : [],
        },
        {
          id: MarineRegionType.mpa,
          data: regions[1]?.status === 'fulfilled' ? regions[1].value.sort(sortFields) : [],
        },
        {
          id: MarineRegionType.rfmo,
          data: regions[2]?.status === 'fulfilled' ? regions[2].value.sort(sortFields) : [],
        },
      ]
      return result
    } catch (e: any) {
      return rejectWithValue({
        status: e.status || e.code,
        message: `Regions - ${e.message}`,
      })
    }
  },
  {
    condition: (_, { getState, extra }) => {
      const { regions } = getState() as RootState
      const fetchStatus = regions.status
      if (
        fetchStatus === AsyncReducerStatus.Finished ||
        fetchStatus === AsyncReducerStatus.Loading
      ) {
        // Already fetched or in progress, don't need to re-fetch
        return false
      }
      return true
    },
  }
)

const { slice: regionsSlice, entityAdapter } = createAsyncSlice<RegionsState, Regions>({
  name: 'regions',
  initialState,
  thunks: {
    fetchThunk: fetchRegionsThunk,
  },
})

export const regionsEntityAdapter = entityAdapter
export default regionsSlice.reducer
