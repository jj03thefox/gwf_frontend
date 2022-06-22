import { saveAs } from 'file-saver'
import type {
  UserData,
  ResourceResponseType,
  ResourceRequestType,
} from '@globalfishingwatch/api-types'
import { isUrlAbsolute } from './utils/url'
import { parseAPIError } from './utils/errors'

const API_GATEWAY =
  process.env.API_GATEWAY ||
  process.env.REACT_APP_API_GATEWAY ||
  process.env.NEXT_PUBLIC_API_GATEWAY ||
  'https://gateway.api.dev.globalfishingwatch.org'
export const USER_TOKEN_STORAGE_KEY = 'GFW_API_USER_TOKEN'
export const USER_REFRESH_TOKEN_STORAGE_KEY = 'GFW_API_USER_REFRESH_TOKEN'
const AUTH_PATH = 'auth'

export interface V2MessageError {
  detail: string
  title: string
}
export interface ResponseError {
  status: number
  message: string
  messages?: V2MessageError[]
}

interface UserTokens {
  token: string
  refreshToken: string
}

interface LibConfig {
  debug?: boolean
  baseUrl?: string
  dataset?: string
}

interface LoginParams {
  accessToken?: string | null
  refreshToken?: string | null
}

export type FetchOptions<T = BodyInit> = Partial<RequestInit> & {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  responseType?: ResourceResponseType
  requestType?: ResourceRequestType
  dataset?: boolean
  body?: T
  local?: boolean
}

const processStatus = (response: Response): Promise<Response> => {
  return new Promise(async (resolve, reject) => {
    const { status, statusText } = response
    try {
      if (response.status >= 200 && response.status < 300) {
        return resolve(response)
      }
      // Compatibility with v1 and v2 errors format
      const errors = {
        message: '',
        messages: [],
      }
      if (response.status >= 400 && response.status < 500) {
        await response.text().then((text) => {
          try {
            const res = JSON.parse(text)
            errors.message = res.message
            errors.messages = res.messages
          } catch (e: any) {
            errors.message = statusText
          }
        })
      }
      return reject({
        status,
        message: errors?.message || statusText,
        messages: errors.messages,
      })
    } catch (e: any) {
      return reject({ status, message: statusText })
    }
  })
}

const parseJSON = (response: Response) => response.json()
const isUnauthorizedError = (error: ResponseError) =>
  error && error.status > 400 && error.status < 403

const isClientSide = typeof window !== 'undefined'

export type RequestStatus = 'idle' | 'refreshingToken' | 'logging' | 'downloading'
export class GFW_API_CLASS {
  debug: boolean
  token = ''
  refreshToken = ''
  dataset = ''
  baseUrl: string
  storageKeys: {
    token: string
    refreshToken: string
  }
  maxRefreshRetries = 1
  logging: Promise<UserData> | null
  status: RequestStatus = 'idle'

  constructor({
    debug = false,
    baseUrl = API_GATEWAY,
    tokenStorageKey = USER_TOKEN_STORAGE_KEY,
    refreshTokenStorageKey = USER_REFRESH_TOKEN_STORAGE_KEY,
  } = {}) {
    this.debug = debug
    this.baseUrl = baseUrl
    this.storageKeys = { token: tokenStorageKey, refreshToken: refreshTokenStorageKey }
    if (isClientSide) {
      this.setToken(localStorage.getItem(tokenStorageKey) || '')
      this.setRefreshToken(localStorage.getItem(refreshTokenStorageKey) || '')
    }
    this.logging = null

    if (debug) {
      console.log('GFWAPI: GFW API Client initialized with the following config', this.getConfig())
    }
  }

  getBaseUrl() {
    return this.baseUrl
  }

  getStatus() {
    return this.status
  }

  getLoginUrl(callbackUrl: string, { client = 'gfw', locale = '' } = {}) {
    const fallbackLocale =
      locale ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem('i18nextLng') : '') ||
      'en'
    const callbackUrlEncoded = encodeURIComponent(callbackUrl)
    return `${this.baseUrl}/${AUTH_PATH}?client=${client}&callback=${callbackUrlEncoded}&locale=${fallbackLocale}`
  }

  getConfig() {
    return {
      debug: this.debug,
      baseUrl: this.baseUrl,
      storageKeys: this.storageKeys,
      token: this.getToken(),
      refreshToken: this.getRefreshToken(),
    }
  }

  setConfig(config: LibConfig) {
    const { debug = this.debug, baseUrl = this.baseUrl, dataset = this.dataset } = config
    this.debug = debug
    this.baseUrl = baseUrl
    this.dataset = dataset
  }

  getToken() {
    return this.token
  }

  setToken(token: string) {
    this.token = token
    if (token) {
      localStorage.setItem(this.storageKeys.token, token)
    } else {
      localStorage.removeItem(this.storageKeys.token)
    }
    if (this.debug) {
      console.log('GFWAPI: updated token with', token)
    }
  }

  getRefreshToken() {
    return this.refreshToken
  }

  setRefreshToken(refreshToken: string) {
    this.refreshToken = refreshToken
    if (refreshToken) {
      localStorage.setItem(this.storageKeys.refreshToken, refreshToken)
    } else {
      localStorage.removeItem(this.storageKeys.refreshToken)
    }
    if (this.debug) {
      console.log('GFWAPI: updated refreshToken with', refreshToken)
    }
  }

  async getTokensWithAccessToken(accessToken: string): Promise<UserTokens> {
    return fetch(`${this.baseUrl}/${AUTH_PATH}/token?access-token=${accessToken}`)
      .then(processStatus)
      .then(parseJSON)
  }

  async getTokenWithRefreshToken(refreshToken: string): Promise<{ token: string }> {
    return fetch(`${this.baseUrl}/${AUTH_PATH}/token/reload`, {
      headers: {
        'refresh-token': refreshToken,
      },
    })
      .then(processStatus)
      .then(parseJSON)
  }

  async refreshAPIToken() {
    if (this.status !== 'refreshingToken') {
      this.status = 'refreshingToken'
      try {
        const refreshToken = this.getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token')
        }
        const { token } = await this.getTokenWithRefreshToken(refreshToken)
        this.setToken(token)
        this.status = 'idle'
        return token
      } catch (e: any) {
        this.status = 'idle'
        e.status = 401
        throw e
      }
    }
    return
  }

  fetch<T>(url: string, options: FetchOptions = {}) {
    return this._internalFetch<T>(url, options)
  }

  download(downloadUrl: string, fileName = 'download'): Promise<boolean> {
    this.status = 'downloading'
    return this._internalFetch<Blob>(downloadUrl, { responseType: 'blob' })
      .then((blob) => {
        saveAs(blob, fileName)
        this.status = 'idle'
        return true
      })
      .catch((e) => {
        this.status = 'idle'
        return false
      })
  }

  async _internalFetch<T = Record<string, unknown> | Blob | ArrayBuffer | Response>(
    url: string,
    options: FetchOptions = {},
    refreshRetries = 0,
    waitLogin = true
  ): Promise<T> {
    try {
      if (this.logging && waitLogin) {
        // Don't do any request until the login is completed
        // and don't wait for the login request itselft
        try {
          await this.logging
        } catch (e: any) {
          if (this.debug) {
            console.log(`Fetch resource executed without login headers in url: ${url}`)
          }
        }
      }

      try {
        const {
          method = 'GET',
          body = null,
          headers = {},
          responseType = 'json',
          requestType = 'json',
          signal,
          dataset = this.dataset,
          local = false,
        } = options
        if (this.debug) {
          console.log(`GFWAPI: Fetching URL: ${url}`)
        }
        const fetchUrl = isUrlAbsolute(url)
          ? url
          : this.baseUrl + (dataset ? `/datasets/${this.dataset}` : '') + url
        const data = await fetch(fetchUrl, {
          method,
          signal,
          ...(body && { body: requestType === 'json' ? JSON.stringify(body) : body }),
          headers: {
            ...headers,
            ...(requestType === 'json' && { 'Content-Type': 'application/json' }),
            ...(local && {
              'x-gateway-url': API_GATEWAY,
              user: JSON.stringify({
                id: process.env.REACT_APP_LOCAL_API_USER_ID,
                type: process.env.REACT_APP_LOCAL_API_USER_TYPE,
                email: process.env.REACT_APP_LOCAL_API_USER_EMAIL,
              }),
            }),
            Authorization: `Bearer ${this.getToken()}`,
          },
        })
          .then(processStatus)
          .then((res) => {
            switch (responseType) {
              case 'default':
                return res
              case 'json':
                return parseJSON(res).catch((e) => {
                  // When an error occurs while parsing and
                  // http response is no content, returns an
                  // empty response instead of an raising error
                  if (res.status === 204) return
                })
              case 'blob':
                return res.blob()
              case 'text':
                return res.text()
              case 'arrayBuffer':
                return res.arrayBuffer()
              case 'vessel': {
                try {
                  return import('@globalfishingwatch/pbf/decoders/vessels').then(({ vessels }) => {
                    return res.arrayBuffer().then((buffer) => {
                      const track = vessels.Track.decode(new Uint8Array(buffer))
                      return track.data
                    })
                  })
                } catch (e: any) {
                  console.warn(
                    '@globalfishingwatch/pbf is a mandatory external dependency when using vessel response decoding'
                  )
                  throw e
                }
              }
              default:
                return res
            }
          })
        return data
      } catch (e: any) {
        // 401 = not authenticated => trying to refresh the token
        // 403 = not authorized => trying to refresh the token
        // 401 + refreshError = true => refresh token failed
        if (refreshRetries <= this.maxRefreshRetries) {
          const isAuthError = e.status === 401 || e.status === 403
          if (isAuthError) {
            if (this.debug) {
              console.log(`GFWAPI: Trying to refresh the token attempt: ${refreshRetries}`)
            }
            try {
              await this.refreshAPIToken()
              if (this.debug) {
                console.log(`GFWAPI: Token refresh worked! trying to fetch again ${url}`)
              }
            } catch (e: any) {
              if (this.debug) {
                console.warn(`GFWAPI: Error fetching ${url}`, e)
              }
              localStorage.removeItem(this.storageKeys.token)
              localStorage.removeItem(this.storageKeys.refreshToken)
              e.refreshError = true
              throw parseAPIError(e)
            }
          }
          if (isAuthError || e.status >= 500) {
            return this._internalFetch(url, options, ++refreshRetries, waitLogin)
          }
          throw e
        } else {
          if (this.debug) {
            if (refreshRetries >= this.maxRefreshRetries) {
              console.log(`GFWAPI: Attemps to retry the request excedeed`)
            }
            console.warn(`GFWAPI: Error fetching ${url}`, e)
          }
          throw parseAPIError(e)
        }
      }
    } catch (e: any) {
      if (this.debug) {
        console.warn(`GFWAPI: Error fetching ${url}`, e)
      }
      throw parseAPIError(e)
    }
  }

  async fetchUser() {
    try {
      const user = await this._internalFetch<UserData>(
        `/${AUTH_PATH}/me`,
        { dataset: false },
        0,
        false
      )
      return user
    } catch (e: any) {
      console.warn(e)
      throw new Error('Error trying to get user data')
    }
  }

  async login(params: LoginParams): Promise<UserData> {
    const { accessToken = null, refreshToken = this.getRefreshToken() } = params
    this.status = 'logging'
    this.logging = new Promise(async (resolve, reject) => {
      if (accessToken) {
        if (this.debug) {
          console.log(`GFWAPI: Trying to get tokens using access-token`)
        }
        try {
          const tokens = await this.getTokensWithAccessToken(accessToken)
          this.setToken(tokens.token)
          this.setRefreshToken(tokens.refreshToken)
          if (this.debug) {
            console.log(`GFWAPI: access-token valid, tokens ready`)
          }
        } catch (e: any) {
          if (!this.getToken() && !this.getRefreshToken()) {
            const msg = isUnauthorizedError(e)
              ? 'Invalid access token'
              : 'Error trying to generate tokens'
            if (this.debug) {
              console.warn(`GFWAPI: ${msg}`)
            }
            reject(new Error(msg))
            this.status = 'idle'
            return null
          }
        }
      }

      if (this.getToken()) {
        if (this.debug) {
          console.log(`GFWAPI: Trying to get user with current token`)
        }
        try {
          const user = await this.fetchUser()
          if (this.debug) {
            console.log(`GFWAPI: Token valid, user data ready:`, user)
          }
          resolve(user)
          this.status = 'idle'
          return user
        } catch (e: any) {
          if (this.debug) {
            console.warn('GFWAPI: Token expired, trying to refresh', e)
          }
        }
      }

      if (refreshToken) {
        if (this.debug) {
          console.log(`GFWAPI: Token wasn't valid, trying to refresh`)
        }
        try {
          const { token } = await this.getTokenWithRefreshToken(refreshToken)
          this.setToken(token)
          if (this.debug) {
            console.log(`GFWAPI: Refresh token OK, fetching user`)
          }
          const user = await this.fetchUser()
          if (this.debug) {
            console.log(`GFWAPI: Login finished, user data ready:`, user)
          }
          resolve(user)
          this.status = 'idle'
          return user
        } catch (e: any) {
          const msg = isUnauthorizedError(e)
            ? 'Invalid refresh token'
            : 'Error trying to refreshing the token'
          console.warn(e)
          if (this.debug) {
            console.warn(`GFWAPI: ${msg}`)
          }
          reject(new Error(msg))
          this.status = 'idle'
          return null
        }
      }
      this.status = 'idle'
      reject(new Error('No login token provided'))
      return
    })
    return await this.logging
  }

  async logout() {
    try {
      if (this.debug) {
        console.log(`GFWAPI: Logout - tokens cleaned`)
      }
      await fetch(`${this.baseUrl}/${AUTH_PATH}/logout`, {
        headers: {
          'refresh-token': this.refreshToken,
        },
      }).then(processStatus)
      this.setToken('')
      this.setRefreshToken('')
      if (this.debug) {
        console.log(`GFWAPI: Logout invalid session api OK`)
      }
      return true
    } catch (e: any) {
      if (this.debug) {
        console.warn(`GFWAPI: Logout invalid session fail`)
      }
      throw new Error('Error on the logout proccess')
    }
  }
}

export const GFWAPI = new GFW_API_CLASS()
