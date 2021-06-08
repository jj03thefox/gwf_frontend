import { createSelector } from '@reduxjs/toolkit'
import { Query, RouteObject } from 'redux-first-router'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { DEFAULT_WORKSPACE } from 'data/config'
import { formatVesselProfileId } from 'features/vessels/vessels.utils'
import { RootState } from 'store'
import { WorkspaceParam } from 'types'
import { ROUTE_TYPES } from './routes'

const selectLocation = (state: RootState) => state.location
export const selectCurrentLocation = createSelector([selectLocation], ({ type, routesMap }) => {
  const routeMap = routesMap[type] as RouteObject
  return { type: type as ROUTE_TYPES, ...routeMap }
})

export const selectLocationQuery = createSelector([selectLocation], (location) => {
  return location.query as Query
})

export const getLocationType = createSelector([selectLocation], (location) => {
  return location.type
})

export const selectLocationPayload = createSelector([selectLocation], ({ payload }) => payload)

export const selectVesselId = createSelector([selectLocationPayload], (payload) => {
  return payload.vesselID !== 'NA' ? payload.vesselID : null
})

export const selectTmtId = createSelector([selectLocationPayload], (payload) => {
  return payload.tmtID !== 'NA' ? payload.tmtID : null
})

export const selectDataset = createSelector([selectLocationPayload], (payload) => {
  return payload.dataset
})

export const selectVesselProfileId = createSelector(
  [selectDataset, selectVesselId, selectTmtId],
  formatVesselProfileId
)

export const selectQueryParam = <T = any>(param: WorkspaceParam) =>
  createSelector<RootState, Query, T>([selectLocationQuery], (query: any) => {
    if (query === undefined || query[param] === undefined) {
      return DEFAULT_WORKSPACE[param]
    }
    return query[param]
  })

//export const selectDataviewsQuery = selectQueryParam<any[]>('workspaceDataviews')

export const selectUrlMapZoomQuery = selectQueryParam<number>('zoom')
export const selectUrlMapLatitudeQuery = selectQueryParam<number>('latitude')
export const selectUrlMapLongitudeQuery = selectQueryParam<number>('longitude')
export const selectUrlStartQuery = selectQueryParam<string>('start')
export const selectUrlEndQuery = selectQueryParam<string>('end')
export const selectUrlQuery = selectQueryParam<string>('q')
export const selectUrlDataviewInstances =
  selectQueryParam<UrlDataviewInstance[]>('dataviewInstances')

export const selectUrlViewport = createSelector(
  [selectUrlMapZoomQuery, selectUrlMapLatitudeQuery, selectUrlMapLongitudeQuery],
  (zoom, latitude, longitude) => {
    if (!zoom && !latitude && !longitude) return
    return { zoom, latitude, longitude }
  }
)

/**
 * get the start and end dates in string format
 */
export const getDateRange = createSelector(
  [selectUrlStartQuery, selectUrlEndQuery],
  (start, end) => ({
    start,
    end,
  })
)

/**
 * get the start and end dates in timestamp format
 */
export const selectUrlTimeRange = createSelector(
  [selectUrlStartQuery, selectUrlEndQuery],
  (start, end) => ({
    start: new Date(start).getTime(),
    end: new Date(end).getTime(),
  })
)
