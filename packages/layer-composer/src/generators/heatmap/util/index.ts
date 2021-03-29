import { TimeChunk } from './time-chunks'

export const toURLArray = (paramName: string, arr: string[]) => {
  return arr
    .map((element, i) => {
      if (!element) return ''
      return `${paramName}[${i}]=${element}`
    })
    .join('&')
}

export const getSourceId = (baseId: string, timeChunk: TimeChunk) => {
  return `${baseId}-${timeChunk.id}`
}

export const getLayerId = (baseId: string, timeChunk: TimeChunk, suffix = '') => {
  return `${getSourceId(baseId, timeChunk)}-${suffix}`
}
