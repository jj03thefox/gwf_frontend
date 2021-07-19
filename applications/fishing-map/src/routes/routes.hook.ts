import { useSelector, useDispatch } from 'react-redux'
import { history } from 'redux-first-router'
import { useCallback, useEffect } from 'react'
import { parse } from 'qs'
import GFWAPI from '@globalfishingwatch/api-client'
import { QueryParams } from 'types'
import useLocalStorage from 'hooks/use-local-storage'
import { selectCurrentLocation, selectLocationPayload } from 'routes/routes.selectors'
import { initialDispatch } from 'store'
import { ROUTE_TYPES } from './routes'
import { updateLocation } from './routes.actions'

export const CALLBACK_URL_KEY = 'CallbackUrl'
export const CALLBACK_URL_PARAM = 'callbackUrlStorage'

export const getLoginUrl = () => {
  const { origin, pathname } = window.location
  return GFWAPI.getLoginUrl(`${origin}${pathname}?${CALLBACK_URL_PARAM}=true`)
}

export const useLoginRedirect = () => {
  const [redirectUrl, setRedirectUrl] = useLocalStorage(CALLBACK_URL_KEY, '')

  const onLoginClick = useCallback(() => {
    setRedirectUrl(window.location.toString())
    return getLoginUrl()
  }, [setRedirectUrl])

  const cleanRedirectUrl = useCallback(() => {
    localStorage.removeItem(CALLBACK_URL_KEY)
  }, [])

  return { redirectUrl, onLoginClick, cleanRedirectUrl }
}

export const useReplaceLoginUrl = () => {
  const { redirectUrl, cleanRedirectUrl } = useLoginRedirect()

  useEffect(() => {
    const { replace } = history()
    const query = parse(window.location.search, { ignoreQueryPrefix: true })
    if (redirectUrl && query[CALLBACK_URL_PARAM]) {
      replace(redirectUrl)
      cleanRedirectUrl()
    }
    if (initialDispatch) {
      initialDispatch()
    }
    return () => {
      // ensures the localStorage is clean when the app is unmounted
      cleanRedirectUrl()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export const useLocationConnect = () => {
  const dispatch = useDispatch()
  const location = useSelector(selectCurrentLocation)
  const payload = useSelector(selectLocationPayload)

  const dispatchLocation = useCallback(
    (type: ROUTE_TYPES, customPayload: Record<string, any> = {}, replaceQuery = false) => {
      dispatch(updateLocation(type, { payload: { ...payload, ...customPayload }, replaceQuery }))
    },
    [dispatch, payload]
  )

  const dispatchQueryParams = useCallback(
    (query: QueryParams, replaceQuery = false) => {
      dispatch(updateLocation(location.type, { query, payload, replaceQuery }))
    },
    [dispatch, location.type, payload]
  )

  return { location, payload, dispatchLocation, dispatchQueryParams }
}
