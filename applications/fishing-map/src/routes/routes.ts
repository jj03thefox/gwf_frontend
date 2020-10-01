import { Dispatch } from 'redux'
import { NOT_FOUND, RoutesMap, redirect, connectRoutes, Options } from 'redux-first-router'
import { stringify, parse } from 'qs'
import { Dictionary, Middleware } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { QueryParams } from 'types'
import { Dataview } from '@globalfishingwatch/dataviews-client'
import { REPLACE_URL_PARAMS } from 'data/config'
import { UpdateQueryParamsAction } from './routes.actions'

export const HOME = 'HOME'
export const SEARCH = 'SEARCH'
export type ROUTE_TYPES = typeof HOME | typeof SEARCH

const routesMap: RoutesMap = {
  [HOME]: {
    path: '/',
  },
  [SEARCH]: {
    path: '/search/:query?',
  },
  [NOT_FOUND]: {
    path: '',
    thunk: async (dispatch: Dispatch) => {
      dispatch(redirect({ type: HOME }))
    },
  },
}

const urlToObjectTransformation: Dictionary<(value: any) => any> = {
  latitude: (latitude) => parseFloat(latitude),
  longitude: (longitude) => parseFloat(longitude),
  zoom: (zoom) => parseFloat(zoom),
  dataviews: (dataviews) =>
    dataviews.map((dataview: Dataview) => ({
      ...dataview,
      config: {
        ...dataview.config,
        visible: dataview.config?.visible?.toString() === 'true',
      },
    })),
}

const encodeWorkspace = (object: Record<string, unknown>) => {
  return stringify(object, { encode: false })
}

const decodeWorkspace = (queryString: string) => {
  const parsed = parse(queryString, { arrayLimit: 300 })
  Object.keys(parsed).forEach((param: string) => {
    const value = parsed[param]
    const transformationFn = urlToObjectTransformation[param]
    if (value && transformationFn) {
      parsed[param] = transformationFn(value)
    }
  })
  return parsed
}

const routesOptions: Options = {
  querySerializer: {
    stringify: encodeWorkspace,
    parse: decodeWorkspace,
  },
}

export const routerQueryMiddleware: Middleware = ({ getState }: { getState: () => RootState }) => (
  next
) => (action: UpdateQueryParamsAction) => {
  const routesActions = Object.keys(routesMap)
  // check if action type matches a route type
  const isRouterAction = routesActions.includes(action.type)
  if (!isRouterAction) {
    next(action)
  } else {
    const newAction: UpdateQueryParamsAction = { ...action }

    const prevQuery = getState().location.query || {}
    if (newAction.replaceQuery !== true) {
      newAction.query = {
        ...prevQuery,
        ...newAction.query,
      }
    }
    const { query } = action
    if (query) {
      const redirect = Object.keys(prevQuery)
        .filter((k) => query[k as keyof QueryParams])
        .some((key) => REPLACE_URL_PARAMS.includes(key))
      if (redirect === true) {
        newAction.meta = {
          location: {
            kind: 'redirect',
          },
        }
      }
    }
    next(newAction)
  }
}

export default connectRoutes(routesMap, routesOptions)
