import { Dispatch } from 'redux'
import { NOT_FOUND, RoutesMap, redirect, connectRoutes, Options, StateGetter, Bag } from 'redux-first-router'
import { parseWorkspace, stringifyWorkspace } from '@globalfishingwatch/dataviews-client'
import { IS_PRODUCTION } from 'data/config'
export const PATH_BASENAME = process.env.NEXT_PUBLIC_URL || (IS_PRODUCTION ? '/map' : '')
export const HOME = 'HOME'
export const WORKSPACE = 'WORKSPACE'
export const WORKSPACES_LIST = 'WORKSPACES_LIST'
export const USER = 'USER'
export const WORKSPACE_ROUTES = [HOME, WORKSPACE]
export type ROUTE_TYPES = typeof HOME | typeof USER | typeof WORKSPACES_LIST | typeof WORKSPACE

export const routesMap: RoutesMap = {
  [HOME]: {
    path: '/',
  },
  [USER]: {
    path: '/user',
  },
  [WORKSPACES_LIST]: {
    path: '/:category',
  },
  [WORKSPACE]: {
    path: '/:category/:workspaceId?',
  },
  [NOT_FOUND]: {
    path: '',
    thunk: async (dispatch: Dispatch) => {
      dispatch(redirect({ type: HOME }))
    },
  },
}

const parseAppWorkspace = (queryString: string) => {
  return parseWorkspace(queryString, {
    analysis: (analysis: any) => ({
      ...analysis,
      bounds: analysis.bounds?.map((bound: string) => parseFloat(bound)),
    }),
  })
}

const routesOptions: Options = {
  basename: PATH_BASENAME,
  querySerializer: {
    stringify: stringifyWorkspace,
    parse: parseAppWorkspace,
  },
  onAfterChange: ((dispatch: Dispatch<any>, getState: StateGetter, bag: Bag) => {
    // prevent error before the the document is initialized
    if (typeof window !== "undefined") {
      document.querySelector('meta[name="description"]').setAttribute("content", getState().description);
      document.querySelector('meta[property="og:description"]').setAttribute("content", getState().description);
      document.querySelector('meta[name="twitter:description"]').setAttribute("content", getState().description);

    }
  })
}

export default connectRoutes(routesMap, routesOptions)
