import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { stringify } from 'qs'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { APIPagination, ReportVesselsByDataset } from '@globalfishingwatch/api-types'
import { AsyncError, AsyncReducerStatus } from 'utils/async-slice'
import { getUTCDateTime } from 'utils/dates'
import {
  Format,
  GroupBy,
  SpatialResolution,
  TemporalResolution,
} from 'features/download/downloadActivity.config'
import { DateRange } from '../download/downloadActivity.slice'

type ReportStateError = AsyncError<{ currentReportUrl: string }>
interface ReportState {
  status: AsyncReducerStatus
  error: ReportStateError | null
  data: ReportVesselsByDataset[] | null
  dateRangeHash: string
}
type ReportSliceState = { report: ReportState }

const initialState: ReportState = {
  status: AsyncReducerStatus.Idle,
  error: null,
  data: null,
  dateRangeHash: '',
}
type ReportRegion = {
  dataset: string
  id: number
}

type FetchReportVesselsThunkParams = {
  region: ReportRegion
  datasets: string[]
  filters: Record<string, any>[]
  vesselGroups: string[]
  dateRange: DateRange
  temporalResolution?: TemporalResolution
  groupBy?: GroupBy
  spatialResolution?: SpatialResolution
  format?: Format.Csv | Format.Json
  spatialAggregation?: boolean
}

export const getReportQuery = (params: FetchReportVesselsThunkParams) => {
  const {
    region,
    datasets,
    filters,
    vesselGroups,
    dateRange,
    temporalResolution = TemporalResolution.Full,
    groupBy = GroupBy.Vessel,
    spatialResolution = SpatialResolution.Low,
    spatialAggregation = true,
    format = Format.Json,
  } = params
  const query = stringify(
    {
      datasets,
      filters,
      'vessel-groups': vesselGroups,
      'temporal-resolution': temporalResolution,
      'date-range': [
        getUTCDateTime(dateRange?.start)?.toString(),
        getUTCDateTime(dateRange?.end)?.toString(),
      ].join(','),
      'group-by': groupBy,
      'spatial-resolution': spatialResolution,
      'spatial-aggregation': spatialAggregation,
      format: format,
      'region-id': region.id,
      'region-dataset': region.dataset,
    },
    { arrayFormat: 'indices' }
  )
  return query
}
export const fetchReportVesselsThunk = createAsyncThunk(
  'report/vessels',
  async (params: FetchReportVesselsThunkParams, { rejectWithValue }) => {
    try {
      const query = getReportQuery(params)
      const vessels = await GFWAPI.fetch<APIPagination<ReportVesselsByDataset>>(
        `/4wings/report?${query}`
      )
      return vessels.entries
    } catch (e) {
      console.warn(e)
      return rejectWithValue(e)
    }
  },
  {
    condition: (params: FetchReportVesselsThunkParams, { getState }) => {
      const { status } = (getState() as ReportSliceState)?.report
      if (status === AsyncReducerStatus.Loading) {
        return false
      }
      return true
    },
  }
)

export function getDateRangeHash(dateRange: DateRange) {
  return [dateRange.start, dateRange.end].join('-')
}

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    resetReportData: () => {
      return initialState
    },
    setDateRangeHash: (state, action: PayloadAction<string>) => {
      state.dateRangeHash = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchReportVesselsThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchReportVesselsThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      state.data = action.payload
      state.dateRangeHash = getDateRangeHash(action.meta.arg.dateRange)
    })
    builder.addCase(fetchReportVesselsThunk.rejected, (state, action) => {
      state.status = AsyncReducerStatus.Error
      state.error = action.payload as ReportStateError
    })
  },
})

export const { resetReportData, setDateRangeHash } = reportSlice.actions

export const selectReportSummary = (state: ReportSliceState) => state.report
export const selectReportVesselsStatus = (state: ReportSliceState) => state.report.status
export const selectReportVesselsError = (state: ReportSliceState) => state.report.error
export const selectReportVesselsData = (state: ReportSliceState) => state.report.data
export const selectReportVesselsDateRangeHash = (state: ReportSliceState) =>
  state.report.dateRangeHash

export default reportSlice.reducer
