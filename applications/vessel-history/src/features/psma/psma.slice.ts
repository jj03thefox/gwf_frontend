import { createAsyncThunk } from '@reduxjs/toolkit'
import { uniqBy } from 'lodash'
import {
  asyncInitialState,
  AsyncReducer,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'
import { RootState } from 'store'
import { Psma } from 'types/psma'

export type PsmaState = AsyncReducer<Psma>

const initialState: PsmaState = {
  ...asyncInitialState,
}

export const fetchPsmaThunk = createAsyncThunk(
  'psma/fetch',
  async (_, { rejectWithValue }) => {
    try {
      // TODO Replace with the fetch of the psma from the endpoint when ready
      const mockedPsma = await import('./psma.mock')
      const psma = uniqBy([...mockedPsma.default], 'iso3')
      return psma.map((item) => ({ ...item, id: item.iso3 })) as Psma[]
    } catch (e: any) {
      return rejectWithValue({ status: e.status || e.code, message: e.message })
    }
  },
  {
    condition: (_, { getState, extra }) => {
      const { psma } = getState() as RootState
      const fetchStatus = psma.status
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

const { slice: psmaSlice, entityAdapter } = createAsyncSlice<PsmaState, Psma>({
  name: 'psma',
  initialState,
  thunks: {
    fetchThunk: fetchPsmaThunk,
  },
})

export const { selectById, selectIds } = entityAdapter.getSelectors<RootState>(
  (state) => state.psma
)

export const psmaEntityAdapter = entityAdapter
export default psmaSlice.reducer
