import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { memoize } from 'lodash'
import { stringify } from 'qs'
import { APIPagination, Report } from '@globalfishingwatch/api-types'
import {
  GFWAPI,
  parseAPIError,
  parseAPIErrorMessage,
  parseAPIErrorStatus,
} from '@globalfishingwatch/api-client'
import { AsyncError, AsyncReducer, AsyncReducerStatus, createAsyncSlice } from 'utils/async-slice'
import { RootState } from 'store'
import { DEFAULT_PAGINATION_PARAMS } from 'data/config'
import { selectReportId } from 'routes/routes.selectors'

export const fetchReportByIdThunk = createAsyncThunk(
  'reports/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const report = await GFWAPI.fetch<Report>(`/reports/${id}`)
      return report
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue({
        status: parseAPIErrorStatus(e),
        message: `${id} - ${parseAPIErrorMessage(e)}`,
      })
    }
  }
)

export const fetchReportsThunk = createAsyncThunk(
  'reports/fetch',
  async (ids: string[], { signal, rejectWithValue }) => {
    try {
      const reportsParams = {
        ...(ids?.length && { ids }),
        ...DEFAULT_PAGINATION_PARAMS,
      }
      const reportsResponse = await GFWAPI.fetch<APIPagination<Report>>(
        `/reports?${stringify(reportsParams, { arrayFormat: 'comma' })}`,
        { signal }
      )
      return reportsResponse?.entries
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue(parseAPIError(e))
    }
  },
  {
    condition: (_, { getState }) => {
      const status = (getState() as RootState).reports.status
      return status !== AsyncReducerStatus.Loading
    },
  }
)

export const createReportThunk = createAsyncThunk<
  Report,
  Partial<Report>,
  {
    rejectValue: AsyncError
  }
>('report/create', async (report, { rejectWithValue }) => {
  try {
    const createdReport = await GFWAPI.fetch<Report>(`/reports`, {
      method: 'POST',
      body: report as any,
    })

    return createdReport
  } catch (e: any) {
    console.warn(e)
    return rejectWithValue(parseAPIError(e))
  }
})

export const updateReportThunk = createAsyncThunk<
  Report,
  Partial<Report>,
  {
    rejectValue: AsyncError
  }
>(
  'reports/update',
  async (partialReport, { rejectWithValue }) => {
    try {
      const report = await GFWAPI.fetch<Report>(`/reports/${partialReport.id}`, {
        method: 'PATCH',
        body: partialReport as any,
      })
      return report
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue(parseAPIError(e))
    }
  },
  {
    condition: (partialReport) => {
      if (!partialReport || !partialReport.id) {
        console.warn('To update the dataset you need the id')
        return false
      }
    },
  }
)

export const deleteReportThunk = createAsyncThunk<
  { id: Report['id'] },
  { id: Report['id'] },
  {
    rejectValue: AsyncError
  }
>(
  'reports/delete',
  async (report, { rejectWithValue }) => {
    try {
      await GFWAPI.fetch<Report>(`/reports/${report?.id}`, {
        method: 'DELETE',
      })
      return report
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue(parseAPIError(e))
    }
  },
  {
    condition: (reportId) => {
      if (!reportId) {
        console.warn('To remove a report you need the id')
        return false
      }
    },
  }
)

export type ResourcesState = AsyncReducer<Report>

const { slice: reportsSlice, entityAdapter } = createAsyncSlice<ResourcesState, Report>({
  name: 'reports',
  thunks: {
    fetchThunk: fetchReportsThunk,
    fetchByIdThunk: fetchReportByIdThunk,
    createThunk: createReportThunk,
    updateThunk: updateReportThunk,
    deleteThunk: deleteReportThunk,
  },
  reducers: {},
})

export const { selectAll, selectById, selectIds } = entityAdapter.getSelectors<RootState>(
  (state) => state.reports
)

export function selectAllReports(state: RootState) {
  return selectAll(state)
}

export const selectReportById = memoize((id: number) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export const selectCurrentReport = createSelector(
  [selectReportId, (state) => state.reports],
  (reportId, reports) => {
    const report = selectReportById(reportId)({ reports })
    return report
  }
)

export const selectReportsStatus = (state: RootState) => state.reports.status
export const selectReportsStatusId = (state: RootState) => state.reports.statusId

export default reportsSlice.reducer
