import { createSelector } from 'reselect'
import { RootState } from 'store'
import { Query } from 'redux-first-router'
import { WorkspaceParam, ModalTypes } from 'types'
import { DEFAULT_WORKSPACE } from 'data/config'
import { LocationRoute, ROUTE_TYPES } from './routes'

const selectLocation = (state: RootState) => state.location

export const selectCurrentLocation = createSelector([selectLocation], ({ type, routesMap }) => {
  const routeMap = routesMap[type] as LocationRoute
  return { type: type as ROUTE_TYPES, ...routeMap }
})

const selectLocationQuery = createSelector([selectLocation], (location) => {
  return location.query as Query
})

const selectQueryParam = <T = any>(param: WorkspaceParam) =>
  createSelector<RootState, Query, T>([selectLocationQuery], (query: any) => {
    if (query === undefined || query[param] === undefined) {
      return DEFAULT_WORKSPACE[param]
    }
    return query[param]
  })

export const selectMapZoomQuery = selectQueryParam<number>('zoom')
export const selectMapLatitudeQuery = selectQueryParam<number>('latitude')
export const selectMapLongitudeQuery = selectQueryParam<number>('longitude')
export const selectStartQuery = selectQueryParam<string>('start')
export const selectEndQuery = selectQueryParam<string>('end')
export const selectModal = selectQueryParam<ModalTypes>('modal')

export const selectViewport = createSelector(
  [selectMapZoomQuery, selectMapLatitudeQuery, selectMapLongitudeQuery],
  (zoom, latitude, longitude) => ({
    zoom,
    latitude,
    longitude,
  })
)

export const selectTimerange = createSelector([selectStartQuery, selectEndQuery], (start, end) => ({
  start,
  end,
}))
