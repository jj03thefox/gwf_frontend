import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { stringify } from 'qs'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { APIPagination, ReportVesselsByDataset } from '@globalfishingwatch/api-types'
import { RootState } from 'store'
import { AsyncReducerStatus } from 'utils/async-slice'
import { getUTCDateTime } from 'utils/dates'
import { DateRange } from '../download/downloadActivity.slice'

interface ReportState {
  status: AsyncReducerStatus
  data: ReportVesselsByDataset[] | null
}

const initialState: ReportState = {
  status: AsyncReducerStatus.Idle,
  data: null,
}
type ReportRegion = {
  dataset: string
  id: number
}

type TemporalResolution = 'daily' | 'monthly' | 'yearly' | 'entire'
type FetchReportVesselsThunkParams = {
  region: ReportRegion
  datasets: string[][]
  temporalResolution: TemporalResolution
  dateRange: DateRange
  groupBy?: 'vessel_id' | 'flag' | 'geartype' | 'flagAndGearType' | 'mmsi'
  spatialResolution?: 'low' | 'high'
  format?: 'csv' | 'json'
  spatialAggregation?: boolean
}
export const fetchReportVesselsThunk = createAsyncThunk(
  'reports/vessels',
  async (params: FetchReportVesselsThunkParams) => {
    const {
      region,
      datasets,
      dateRange,
      temporalResolution,
      groupBy = 'vessel_id',
      spatialResolution = 'low',
      spatialAggregation = true,
      format = 'json',
    } = params
    const query = stringify(
      {
        datasets: datasets.map((d) => d.join(',')),
        'temporal-resolution': temporalResolution,
        'date-range': [
          getUTCDateTime(dateRange?.start).toString(),
          getUTCDateTime(dateRange?.end).toString(),
        ].join(','),
        'group-by': groupBy,
        'spatial-resolution': spatialResolution,
        'spatial-aggregation': spatialAggregation,
        format: format,
      },
      { arrayFormat: 'indices' }
    )
    const vessels = await GFWAPI.fetch<APIPagination<ReportVesselsByDataset>>(
      `/4wings/report?${query}`,
      {
        method: 'POST',
        body: {
          region,
        } as any,
      }
    )
    return vessels.entries
  },
  {
    condition: (params: FetchReportVesselsThunkParams, { getState }) => {
      const { status } = (getState() as RootState)?.reports
      if (status === AsyncReducerStatus.Loading || status === AsyncReducerStatus.Error) {
        return false
      }
      return true
    },
  }
)

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchReportVesselsThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchReportVesselsThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      state.data = action.payload
    })
    builder.addCase(fetchReportVesselsThunk.rejected, (state) => {
      state.status = AsyncReducerStatus.Error
    })
  },
})

export const selectReportSummary = (state: RootState) => state.reports
export const selectReportVesselsStatus = (state: RootState) => state.reports.status
export const selectReportVesselsData = (state: RootState) => state.reports.data

export default reportSlice.reducer
