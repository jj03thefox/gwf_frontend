import type { FourwingsLayerMode } from 'layers/fourwings/FourwingsLayer'
import { TileCell } from 'loaders/fourwings/fourwingsTileParser'
import { TimebarRange } from 'features/timebar/timebar.hooks'
import { getUTCDateTime } from 'utils/dates'

export interface Bounds {
  north: number
  south: number
  west: number
  east: number
}

export function getRoundedDateFromTS(ts: number) {
  return getUTCDateTime(ts).toISODate()
}

export const ACTIVITY_SWITCH_ZOOM_LEVEL = 9

export function getFourwingsMode(zoom: number, timerange: TimebarRange): FourwingsLayerMode {
  const duration = getUTCDateTime(timerange?.end).diff(getUTCDateTime(timerange?.start), 'days')
  return zoom >= ACTIVITY_SWITCH_ZOOM_LEVEL && duration.days < 30 ? 'positions' : 'heatmap'
}

export const filterCellsByBounds = (cells: TileCell[], bounds: Bounds) => {
  if (!bounds || cells?.length === 0) {
    return []
  }
  const { north, east, south, west } = bounds
  const rightWorldCopy = east >= 180
  const leftWorldCopy = west <= -180
  return cells.filter((c) => {
    if (!c) return false
    const [lon, lat] = (c.coordinates as any)[0][0]
    if (lat < south || lat > north) {
      return false
    }
    // This tries to translate features longitude for a proper comparison against the viewport
    // when they fall in a left or right copy of the world but not in the center one
    // but... https://c.tenor.com/YwSmqv2CZr8AAAAd/dog-mechanic.gif
    const featureInLeftCopy = lon > 0 && lon - 360 >= west
    const featureInRightCopy = lon < 0 && lon + 360 <= east
    const leftOffset = leftWorldCopy && !rightWorldCopy && featureInLeftCopy ? -360 : 0
    const rightOffset = rightWorldCopy && !leftWorldCopy && featureInRightCopy ? 360 : 0
    return lon + leftOffset + rightOffset > west && lon + leftOffset + rightOffset < east
  })
}

export const aggregateCellTimeseries = (cells: TileCell[]) => {
  if (!cells) {
    return []
  }
  const timeseries = cells.reduce((acc, cell) => {
    if (!cell) {
      return acc
    }
    cell.timeseries.forEach(({ frame, value }) => {
      if (acc[frame]) {
        acc[frame] += value
      } else {
        acc[frame] = value
      }
    })
    return acc
  }, {} as Record<number, number>)
  return timeseries
}
