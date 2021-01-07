import { Dispatch } from 'redux'
import {
  NOT_FOUND,
  RoutesMap,
  redirect,
  connectRoutes,
  Options,
  StateGetter,
  NavigationAction,
} from 'redux-first-router'
import { stringify, parse } from 'qs'
import { Dictionary, Middleware } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { AppActions, AppState } from 'types/redux.types'
//import { AppState, AppActions } from 'types/redux.types'
//import { vesselInfoThunk } from 'features/vessels/vessels.thunks'
import { UpdateQueryParamsAction } from './routes.actions'
import { getLocationType, selectLocationQuery } from './routes.selectors'

export const HOME = 'HOME'
export const LOGIN = 'LOGIN'
export const PROFILE = 'PROFILE'

//const preFetchThunks = [trackThunk, vesselInfoThunk]

const thunk = async (
  dispatch: Dispatch<AppActions | NavigationAction>,
  getState: StateGetter<AppState>
) => {
  const locationType = getLocationType(getState())
  const logged = false //await checkUserLoggedThunk(dispatch, getState)
  if (logged) {
    const query = selectLocationQuery(getState())
    if (locationType === LOGIN || (query && (query.state || query['access-token']))) {
      const prevQueryState: any = query && query.state ? parse(window.atob(query.state)) : {}
      dispatch(
        redirect({
          type: HOME,
          query: { ...prevQueryState, 'access-token': undefined, state: undefined },
        })
      )
    }
    // TODO:
    //preFetchThunks.forEach((thunk) => thunk(dispatch, getState))
  } else {
    if (locationType !== LOGIN) {
      dispatch(redirect({ type: LOGIN }))
    }
  }
}

const routesMap: RoutesMap = {
  [HOME]: {
    path: '/',
    thunk,
  },
  [LOGIN]: {
    path: '/login',
    thunk,
  },
  [PROFILE]: {
    path: '/profile',
    thunk,
  },
  [NOT_FOUND]: {
    path: '',
    thunk: async (dispatch: Dispatch) => {
      dispatch(redirect({ type: HOME }))
    },
  },
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

const urlToObjectTransformation: Dictionary<(value: any) => any> = {
  latitude: (s) => parseFloat(s),
  longitude: (s) => parseFloat(s),
  zoom: (s) => parseFloat(s),
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
    next(newAction)
  }
}

export default connectRoutes(routesMap, routesOptions)
