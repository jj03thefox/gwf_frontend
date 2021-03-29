import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import type { Feature, Polygon } from 'geojson'
import GFWAPI from '@globalfishingwatch/api-client'
import { Report } from '@globalfishingwatch/api-types'
import {
  AsyncError,
  asyncInitialState,
  AsyncReducer,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'
import { RootState } from 'store'
import { Bbox } from 'types'

export type DateRange = {
  start: string
  end: string
}

export type ReportGeometry = Feature<Polygon>

export type CreateReport = {
  name: string
  dateRange: DateRange
  filters: Record<string, any>
  datasets: string[]
  geometry: ReportGeometry
}

export const createSingleReportThunk = createAsyncThunk<
  Report,
  CreateReport,
  {
    rejectValue: AsyncError
  }
>('report/createsingle', async (createReport: CreateReport, { rejectWithValue }) => {
  try {
    const { dateRange, filters, datasets } = createReport
    const fromDate = DateTime.fromISO(dateRange.start).toUTC().toISODate()
    const toDate = DateTime.fromISO(dateRange.end).toUTC().toISODate()

    const queryFiltersFields = [
      {
        value: filters.flag,
        field: 'flag',
        operator: 'IN',
        transformation: (value: any): string =>
          `(${(value as string[])?.map((v: string) => `'${v}'`).join(', ')})`,
      },
      {
        value: filters.fleet,
        field: 'fleet',
        operator: 'IN',
        transformation: (value: any): string =>
          `(${(value as string[])?.map((v: string) => `'${v}'`).join(', ')})`,
      },
      {
        value: filters.origin,
        field: 'origin',
        operator: 'IN',
        transformation: (value: any): string =>
          `(${(value as string[])?.map((v: string) => `'${v}'`).join(', ')})`,
      },
      {
        value: filters.geartype,
        field: 'geartype',
        operator: 'IN',
        transformation: (value: any): string =>
          `(${(value as string[])?.map((v: string) => `'${v}'`).join(', ')})`,
      },
      {
        value: filters.vessel_type,
        field: 'vessel_type',
        operator: 'IN',
        transformation: (value: any): string =>
          `(${(value as string[])?.map((v: string) => `'${v}'`).join(', ')})`,
      },
    ]

    const queryFilters = queryFiltersFields
      .filter(({ value }) => value && value !== undefined)
      .map(
        ({ field, operator, transformation, value }) =>
          `${field} ${operator} ${transformation ? transformation(value) : `'${value}'`}`
      )
      .join(' AND ')

    const payload = {
      ...createReport,
      type: 'detail',
      timeGroup: 'none',
      filters: [queryFilters],
      datasets: datasets,
      dateRange: [fromDate, toDate],
    }

    const createdReport = await GFWAPI.fetch<Report>('/v1/reports', {
      method: 'POST',
      body: payload as any,
    })
    return createdReport
  } catch (e) {
    return rejectWithValue({ status: e.status || e.code, message: e.message })
  }
})

export const createReportThunk = createAsyncThunk(
  'report/create',
  async (createReport: CreateReport[], { dispatch }) => {
    return Promise.all(createReport.map((report) => dispatch(createSingleReportThunk(report))))
  }
)

export interface ReportState extends AsyncReducer<Report> {
  area: {
    geometry: ReportGeometry | undefined
    bounds: Bbox | undefined
    name: string
    id: string
  }
}

const initialState: ReportState = {
  ...asyncInitialState,
  area: {
    geometry: undefined,
    bounds: undefined,
    name: '',
    id: '',
  },
}

const { slice: analysisSlice } = createAsyncSlice<ReportState, Report>({
  name: 'report',
  initialState,
  reducers: {
    resetReportStatus: (state) => {
      state.status = AsyncReducerStatus.Idle
    },
    clearAnalysisGeometry: (state) => {
      state.area.geometry = undefined
      state.area.name = ''
      state.area.bounds = undefined
      state.status = AsyncReducerStatus.Idle
    },
    setAnalysisGeometry: (
      state,
      action: PayloadAction<{
        geometry: ReportGeometry | undefined
        name: string
        bounds: [number, number, number, number]
      }>
    ) => {
      state.area.geometry = action.payload.geometry
      state.area.bounds = action.payload.bounds
      state.area.name = action.payload.name
    },
  },
  thunks: {
    createThunk: createReportThunk,
  },
})

export const {
  resetReportStatus,
  clearAnalysisGeometry,
  setAnalysisGeometry,
} = analysisSlice.actions

export const selectAnalysisGeometry = (state: RootState) => state.analysis.area.geometry
export const selectAnalysisBounds = (state: RootState) => state.analysis.area.bounds
export const selectAnalysisAreaName = (state: RootState) => state.analysis.area.name
export const selectAnalysisAreaId = (state: RootState) => state.analysis.area.id
export const selectReportStatus = (state: RootState) => state.analysis.status

export default analysisSlice.reducer
