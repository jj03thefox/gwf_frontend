import { ResponseError } from '../api-client'

export const parseAPIErrorStatus = (error: ResponseError) => {
  return error.status || (error as any).code
}

export const parseAPIErrorMessage = (error: ResponseError) => {
  if (error.messages?.length) {
    return error.messages[0]?.detail
  }
  return error.message
}

export type ParsedAPIError = { status: number; message: string }
export const parseAPIError = (error: ResponseError): ParsedAPIError => ({
  status: parseAPIErrorStatus(error),
  message: parseAPIErrorMessage(error),
})

export function isAuthError(error = {} as Partial<ParsedAPIError> | null) {
  return error?.status === 401 || error?.status === 403
}
