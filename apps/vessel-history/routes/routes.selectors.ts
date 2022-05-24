import { createSelector } from '@reduxjs/toolkit'
import { Query, RouteObject } from 'redux-first-router'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { DEFAULT_WORKSPACE } from 'data/config'
import { formatVesselProfileId } from 'features/vessels/vessels.utils'
import { createDeepEqualSelector } from 'utils/selectors'
import { RootState } from 'store'
import { WorkspaceParam } from 'types'
import { ROUTE_TYPES } from './routes'

const selectLocation = (state: RootState) => state.location
export const selectCurrentLocation = createSelector([selectLocation], ({ type, routesMap }) => {
  const routeMap = routesMap[type] as RouteObject
  return { type: type as ROUTE_TYPES, ...routeMap }
})

export const selectLocationType = createSelector(
  [selectLocation],
  (location) => location.type as ROUTE_TYPES
)

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

export const selectQueryParam = (param: WorkspaceParam) =>
  createDeepEqualSelector([selectLocationQuery], (query: any) => {
    if (query === undefined || query[param] === undefined) {
      return DEFAULT_WORKSPACE[param]
    }
    return query[param]
  })

export const selectUrlMapZoomQuery = createSelector(
  [selectQueryParam('zoom')],
  (zoom: number) => zoom
)
export const selectUrlMapLatitudeQuery = createSelector(
  [selectQueryParam('latitude')],
  (latitude: number) => latitude
)
export const selectUrlMapLongitudeQuery = createSelector(
  [selectQueryParam('longitude')],
  (longitude: number) => longitude
)
export const selectUrlStartQuery = createSelector(
  [selectQueryParam('start')],
  (start: string) => start
)
export const selectUrlEndQuery = createSelector([selectQueryParam('end')], (end: string) => end)
export const selectUrlQuery = createSelector([selectQueryParam('q')], (q: string) => q || '')
export const selectUrlDataviewInstances = createSelector(
  [selectQueryParam('dataviewInstances')],
  (dataviewInstance: UrlDataviewInstance[]) => dataviewInstance
)

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
  (start, end) => ({ start, end })
)

export const selectAdvancedSearchMMSI = createSelector(
  [selectQueryParam('mmsi')],
  (mmsi: string) => mmsi || ''
)
export const selectAdvancedSearchIMO = createSelector(
  [selectQueryParam('imo')],
  (imo: string) => imo || ''
)
export const selectAdvancedSearchCallsign = createSelector(
  [selectQueryParam('callsign')],
  (callsign: string) => callsign || ''
)
export const selectAdvancedSearchRawFlags = createSelector(
  [selectQueryParam('flags')],
  (flags: string) => flags
)
export const selectAdvancedSearchFlags = createSelector(
  [selectAdvancedSearchRawFlags],
  (rawFlags) => {
    return rawFlags ? rawFlags.split(',') : []
  }
)

export const selectLastTransmissionDate = createSelector(
  [selectQueryParam('lastTransmissionDate')],
  (lastTransmissionDate: string) => lastTransmissionDate
)
export const selectFirstTransmissionDate = createSelector(
  [selectQueryParam('firstTransmissionDate')],
  (firstTransmissionDate: string) => firstTransmissionDate
)
export const selectAdvancedSearchFields = createSelector(
  [
    selectAdvancedSearchMMSI,
    selectAdvancedSearchIMO,
    selectAdvancedSearchCallsign,
    selectAdvancedSearchFlags,
    selectLastTransmissionDate,
    selectFirstTransmissionDate,
  ],
  (mmsi, imo, callsign, flags, lastTransmissionDate, firstTransmissionDate) => {
    const hasFields = [
      mmsi,
      imo,
      callsign,
      flags,
      lastTransmissionDate,
      firstTransmissionDate,
    ].filter((field) => field && field.length)
    if (!hasFields.length) return undefined

    return {
      mmsi,
      imo,
      callsign,
      flags,
      lastTransmissionDate,
      firstTransmissionDate,
    }
  }
)

export const selectHasSearch = createSelector(
  [selectUrlQuery, selectAdvancedSearchFields],
  (query, advancedSearch) => {
    return query || advancedSearch
  }
)

export const selectUrlAkaVesselQuery = createSelector(
  [selectQueryParam('aka')],
  (aka: string[]) => aka
)

export const isOfflineForced = createSelector(
  [selectQueryParam('offline')],
  (offline: string) => {
    return offline === 'true'
  }
)

export const selectMergedVesselId = createSelector(
  [selectVesselProfileId, selectUrlAkaVesselQuery],
  (vesselProfileId, akaVesselId) => [vesselProfileId, ...(akaVesselId ?? [])].join('|')
)

export const selectSearchableQueryParams = createSelector(
  [selectAdvancedSearchFields, selectUrlQuery],
  (filters, query) =>
  ({
    q: query,
    ...filters,
    flags: filters?.flags.join(','),
  } as any)
)