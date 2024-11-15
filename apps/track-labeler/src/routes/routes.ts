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
import { GFWAPI } from '@globalfishingwatch/api-client'
import { AppState, AppActions } from '../types/redux.types'
import { vesselInfoThunk } from '../features/vessels/vessels.thunks'
import { checkUserLoggedThunk } from '.././features/user/user.thunks'
import { trackThunk } from './.././features/tracks/tracks.thunks'
import { getLocationType, selectLocationQuery } from './routes.selectors'

export const HOME = 'HOME'
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'

const preFetchThunks = [trackThunk, vesselInfoThunk]

const thunk = async (
  dispatch: Dispatch<AppActions | NavigationAction>,
  getState: StateGetter<AppState>
) => {
  const locationType = getLocationType(getState())
  const logged = await checkUserLoggedThunk(dispatch, getState)
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
    preFetchThunks.forEach((thunk) => thunk(dispatch, getState))
  } else {
    if (locationType !== LOGIN) {
      dispatch(redirect({ type: LOGIN }))
    }
  }
}

export const routesMap: RoutesMap = {
  [HOME]: {
    path: '/',
    thunk,
  },
  [LOGIN]: {
    path: '/login',
    thunk,
  },
  [LOGOUT]: {
    path: '/logout',
    thunk: async (dispatch: Dispatch) => {
      await GFWAPI.logout()
      dispatch(redirect({ type: LOGIN }) as any)
    },
  },
  [NOT_FOUND]: {
    path: '',
    thunk: async (dispatch: Dispatch) => {
      dispatch(redirect({ type: HOME }) as any)
    },
  },
}

const urlToObjectTransformation: any = {
  latitude: (s: any) => parseFloat(s),
  longitude: (s: any) => parseFloat(s),
  zoom: (s: any) => parseFloat(s),
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

export default connectRoutes(routesMap, routesOptions)
