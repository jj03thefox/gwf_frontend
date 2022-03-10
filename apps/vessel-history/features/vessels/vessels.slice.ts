import { createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { memoize } from 'lodash'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { DataviewInstance } from '@globalfishingwatch/api-types'
import { VesselAPISource, VesselWithHistory } from 'types'
import {
  asyncInitialState,
  AsyncReducer,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'
import { VesselSourceId } from 'types/vessel'
import gfwThunk from 'features/vessels/sources/gfw.slice'
import tmtThunk from 'features/vessels/sources/tmt.slice'
import { RootState } from 'store'
import { RenderedVoyage } from 'types/voyage'
import { mergeVesselFromSources } from './vessels.utils'

export type VoyagesState = {
  expanded: Record<number, RenderedVoyage | undefined>
  initialized?: boolean
}
export interface VesselState extends AsyncReducer<VesselWithHistory> {
  dataview?: DataviewInstance<GeneratorType>
  voyages: Record<string, VoyagesState>
}
const initialState: VesselState = {
  ...asyncInitialState,
  dataview: undefined,
  voyages: {},
}
export interface VesselAPIThunk {
  fetchById(id: VesselSourceId): Promise<VesselWithHistory>
}

const getVesselFromSourceAPI: (source: VesselAPISource) => VesselAPIThunk = (
  source: VesselAPISource
) => {
  const thunks = {
    [VesselAPISource.GFW]: gfwThunk,
    [VesselAPISource.TMT]: tmtThunk,
  }
  return thunks[source]
}

export type FetchVessel = {
  source: VesselAPISource
  sourceId: VesselSourceId
}
type FetchIds = {
  id: string
  akas?: string[]
}
export const fetchVesselByIdThunk = createAsyncThunk(
  'vessels/fetchById',
  async (idData: FetchIds, { rejectWithValue }) => {
    const id = idData.id
    try {
      const [dataset, gfwId, tmtId] = id.split('_')
      const vesselsToFetch: FetchVessel[] = [
        {
          source: VesselAPISource.GFW,
          sourceId: {
            id: gfwId,
            dataset: dataset,
          },
        },
        {
          source: VesselAPISource.TMT,
          sourceId: {
            id: tmtId,
          },
        },
      ]
      if (idData.akas) {
        idData.akas.forEach((akaId) => {
          const [akaDataset, akaGfwId, akaTmtId] = akaId.split('_')
          vesselsToFetch.push(
            {
              source: VesselAPISource.GFW,
              sourceId: {
                id: akaGfwId,
                dataset: akaDataset,
              },
            },
            {
              source: VesselAPISource.TMT,
              sourceId: {
                id: akaTmtId,
              },
            }
          )
        })
      }
      const vesselsToFetchFiltered = [
        // TODO added any to stop build failures, review it
        ...(new Map(vesselsToFetch.map((item) => [item.sourceId.id, item])).values() as any),
      ].filter(({ sourceId: { id } }) => id && id.toLowerCase() !== 'na')

      const vessels = await Promise.all(
        vesselsToFetchFiltered.map(async ({ source, sourceId }) => ({
          source,
          vessel: await getVesselFromSourceAPI(source).fetchById(sourceId),
        }))
      )

      return {
        ...mergeVesselFromSources(vessels),
        id: [id, ...(idData.akas ?? [])].join('|'),
      }
    } catch (e: any) {
      return rejectWithValue({ status: e.status || e.code, message: `${id} - ${e.message}` })
    }
  }
)

const { slice: vesselsSlice, entityAdapter } = createAsyncSlice<VesselState, VesselWithHistory>({
  name: 'vessels',
  initialState,
  thunks: {
    fetchByIdThunk: fetchVesselByIdThunk,
  },
  reducers: {
    clearVesselDataview: (state) => {
      state.dataview = undefined
      state.status = AsyncReducerStatus.Idle
    },
    upsertVesselDataview: (state, action: PayloadAction<DataviewInstance<GeneratorType>>) => {
      state.dataview = action.payload
    },
    upsertVesselVoyagesExpanded: (
      state,
      action: PayloadAction<Record<string, Record<number, RenderedVoyage | undefined>>>
    ) => {
      const entries = Object.entries(action.payload)

      entries
        .map(([id, expanded]) => ({
          id,
          updates: {
            ...(state.voyages[id] ?? {}),
            expanded,
          },
        }))
        .forEach(({ id, updates }) => {
          state.voyages[id] = updates
        })
    },
    setVesselVoyagesInitialized: (state, action: PayloadAction<Record<string, boolean>>) => {
      const entries = Object.entries(action.payload)

      entries
        .map(([id, initialized]) => ({
          id,
          updates: {
            ...(state.voyages[id] ?? {}),
            initialized,
          },
        }))
        .forEach(({ id, updates }) => {
          state.voyages[id] = updates as any
        })
    },
  },
})

export const { selectById, selectIds } = entityAdapter.getSelectors<RootState>(
  (state) => state.vessels
)

export const selectVesselById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => {
    return selectById(state, id)
  })
)

export const selectVessels = (state: RootState) => state.vessels.entities
export const selectVesselsStatus = (state: RootState) => state.vessels.status
export const selectVesselDataview = (state: RootState) => state.vessels.dataview
export const selectVesselVoyages = (state: RootState) => state.vessels.voyages

export const {
  clearVesselDataview,
  upsertVesselDataview,
  setVesselVoyagesInitialized,
  upsertVesselVoyagesExpanded,
} = vesselsSlice.actions

export default vesselsSlice.reducer
