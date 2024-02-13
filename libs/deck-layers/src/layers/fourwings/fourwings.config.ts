import { DateTime, DateTimeUnit, Duration, DurationLikeObject } from 'luxon'
import { Interval } from '@globalfishingwatch/layer-composer'

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const PATH_BASENAME = process.env.NEXT_PUBLIC_URL || (IS_PRODUCTION ? '/map' : '')

export const HEATMAP_ID = 'heatmap'
export const POSITIONS_ID = 'positions'

export const CHUNKS_BY_INTERVAL: Record<
  Interval,
  { unit: DateTimeUnit; value: number } | undefined
> = {
  HOUR: {
    unit: 'day',
    value: 20,
  },
  DAY: {
    unit: 'year',
    value: 1,
  },
  MONTH: undefined,
  YEAR: undefined,
}

export const LIMITS_BY_INTERVAL: Record<
  Interval,
  { unit: keyof DurationLikeObject; value: number; buffer: number } | undefined
> = {
  HOUR: {
    unit: 'days',
    value: 3,
    buffer: 1,
  },
  DAY: {
    unit: 'months',
    value: 6,
    buffer: 1,
  },
  MONTH: {
    unit: 'year',
    value: 6,
    buffer: 1,
  },
  YEAR: undefined,
}

export const getInterval = (start: number, end: number): Interval => {
  const duration = Duration.fromMillis(end - start)
  const validIntervals = Object.entries(LIMITS_BY_INTERVAL).flatMap(([interval, limits]) => {
    if (!limits) return interval as Interval
    return Math.round(duration.as(limits.unit)) <= limits.value ? (interval as Interval) : []
  })
  return validIntervals[0]
}

export const getDateInIntervalResolution = (date: number, interval: Interval): number => {
  return DateTime.fromMillis(date)
    .startOf(interval as any)
    .toMillis()
}

export const getDatesInIntervalResolution = (
  start: number,
  end: number
): { start: number; end: number } => {
  const interval = getInterval(start, end)
  return {
    start: getDateInIntervalResolution(start, interval),
    end: getDateInIntervalResolution(end, interval),
  }
}

export type Chunk = {
  id: string
  interval: Interval
  start: number
  end: number
}

export const CHUNKS_BUFFER = 0
// TODO: validate if worth to make this dynamic for the playback
// export const getChunksByInterval = (start: number, end: number, interval: Interval): Chunk[] => {
//   const intervalUnit = LIMITS_BY_INTERVAL[interval]?.unit
//   if (!intervalUnit) {
//     return [{ id: 'full-time-range', interval, start, end }]
//   }
//   const startDate = DateTime.fromMillis(start).startOf(intervalUnit as any)
//   const endDate = DateTime.fromMillis(end).endOf(intervalUnit as any)
//   // TODO review if more than the interval units return an offset or calculates the total amount
//   const chunksNumber = Math.round(
//     Duration.fromMillis(endDate.toMillis() - startDate.toMillis()).as(intervalUnit)
//   )
//   const preBufferChunkStart = startDate.minus({ [intervalUnit]: CHUNKS_BUFFER })
//   const preBufferChunk = Array.from(Array(CHUNKS_BUFFER).keys()).map((buffer) => ({
//     id: `${intervalUnit}-pre-buffer-${buffer}`,
//     interval,
//     start: preBufferChunkStart.plus({ [intervalUnit]: buffer }).toMillis(),
//     end: preBufferChunkStart.plus({ [intervalUnit]: buffer + 1 }).toMillis(),
//   }))
//   const dataChunks: Chunk[] = Array.from(Array(chunksNumber).keys()).map((chunkIndex) => {
//     return {
//       id: `${intervalUnit}-${chunkIndex + 1}`,
//       interval,
//       start: startDate.plus({ [intervalUnit]: chunkIndex }).toMillis(),
//       end: startDate.plus({ [intervalUnit]: chunkIndex + 1 }).toMillis(),
//     }
//   })
//   const postBufferChunkDate = DateTime.fromMillis(dataChunks[dataChunks.length - 1].end)
//   const postBufferChunk = Array.from(Array(CHUNKS_BUFFER).keys()).map((buffer) => ({
//     id: `${intervalUnit}-post-buffer-${buffer}`,
//     interval,
//     start: postBufferChunkDate.plus({ [intervalUnit]: buffer }).toMillis(),
//     end: postBufferChunkDate.plus({ [intervalUnit]: buffer + 1 }).toMillis(),
//   }))
//   const data = [...preBufferChunk, ...dataChunks, ...postBufferChunk].map((c) => ({
//     ...c,
//     startISO: DateTime.fromMillis(c.start).toISODate(),
//     endISO: DateTime.fromMillis(c.end).toISODate(),
//   }))
//   return data
// }

export const getChunkBuffer = (interval: Interval) => {
  const { buffer, unit } = LIMITS_BY_INTERVAL[interval] || {}
  if (!unit) {
    throw new Error(`No buffer for interval: ${interval}`)
  }
  return Duration.fromObject({ [unit]: buffer }).toMillis()
}

export const getChunksByInterval = (start: number, end: number, interval: Interval): Chunk[] => {
  const chunkUnit = CHUNKS_BY_INTERVAL[interval]?.unit
  if (!chunkUnit) {
    return [{ id: 'full-time-range', interval, start, end }]
  }
  const startDate = DateTime.fromMillis(start).startOf(chunkUnit)
  const endDate = DateTime.fromMillis(end).endOf(chunkUnit)
  // TODO review if more than the interval units return an offset or calculates the total amount
  const chunksNumber = Math.round(
    Duration.fromMillis(endDate.toMillis() - startDate.toMillis()).as(chunkUnit)
  )
  const dataChunks: Chunk[] = Array.from(Array(chunksNumber).keys()).map((chunkIndex) => {
    return {
      id: `${chunkUnit}-${chunkIndex + 1}`,
      interval,
      start: startDate.plus({ [chunkUnit]: chunkIndex }).toMillis(),
      end: startDate.plus({ [chunkUnit]: chunkIndex + 1 }).toMillis(),
    }
  })
  const data = dataChunks.map((c) => ({
    ...c,
    startISO: DateTime.fromMillis(c.start).toISODate(),
    endISO: DateTime.fromMillis(c.end).toISODate(),
  }))
  return data
}

// TODO use the existing class function instead of repeating the logic
export const getChunks = (minFrame: number, maxFrame: number) => {
  const interval = getInterval(minFrame, maxFrame)
  const chunks = getChunksByInterval(minFrame, maxFrame, interval)
  return chunks
}
