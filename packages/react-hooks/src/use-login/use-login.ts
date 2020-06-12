import { useState, useEffect } from 'react'
import GFWAPI, {
  UserData,
  getAccessTokenFromUrl,
  removeAccessTokenFromUrl,
} from '@globalfishingwatch/api-client'

interface GFWLoginHook {
  logged: boolean
  loading: boolean
  user: UserData | null
  error: string | undefined
}

const useGFWLogin = (APIClient: typeof GFWAPI = GFWAPI): GFWLoginHook => {
  const [state, setState] = useState<GFWLoginHook>({
    logged: false,
    loading: true,
    user: null,
    error: undefined,
  })

  useEffect(() => {
    const accessToken = getAccessTokenFromUrl()
    APIClient.login({ accessToken })
      .then((user) => {
        const newState = user
          ? { loading: false, logged: true, user }
          : { loading: false, logged: false, error: 'no user' }

        setState((state) => ({ ...state, ...newState }))
        if (accessToken) {
          removeAccessTokenFromUrl()
        }
      })
      .catch((e) => {
        setState((state) => ({ ...state, loading: false, error: e }))
      })
  }, [APIClient])

  return state
}

export default useGFWLogin
