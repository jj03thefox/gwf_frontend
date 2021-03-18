import { DateTime, Duration, Interval as LuxonInterval } from 'luxon'

export type Interval = 'month' | '10days' | 'day' | 'hour'
export type IntervalOption = 'auto' | Interval

export type TimeChunk = {
  id: string
  start?: string
  viewEnd?: string
  dataEnd?: string
  quantizeOffset: number
  frame: number
  active: boolean
}

export type TimeChunks = {
  chunks: TimeChunk[]
  delta: number
  deltaInIntervalUnits: number
  deltaInDays: number
  interval: Interval
  activeStart: string
  activeEnd: string
  activeChunkFrame: number
  activeId: string
}

const toDT = (dateISO: string) => DateTime.fromISO(dateISO).toUTC()

// Buffer size relative to active time delta
const TIME_CHUNK_BUFFER_RELATIVE_SIZE = 0.2

const CONFIG_BY_INTERVAL: Record<Interval, Record<string, any>> = {
  hour: {
    isValid: (duration: Duration): boolean => {
      return duration.as('days') < 5
    },
    getFirstChunkStart: (bufferedActiveStart: number): DateTime => {
      const TWENTY_DAYS_MS = 1000 * 60 * 60 * 24 * 20
      const time = TWENTY_DAYS_MS * Math.floor(bufferedActiveStart / TWENTY_DAYS_MS)
      return DateTime.fromMillis(time).toUTC()
    },
    getChunkViewEnd: (chunkStart: DateTime): DateTime => {
      return chunkStart.plus({ days: 20 })
    },
    getChunkDataEnd: (chunkViewEnd: DateTime): DateTime => {
      return chunkViewEnd.plus({ days: 5 })
    },
    // We will substract every timestamp with a quantize offset to end up with shorter arrays indexes
    getFrame: (start: number) => {
      return Math.floor(start / 1000 / 60 / 60)
    },
    getDate: (frame: number) => {
      return new Date(frame * 1000 * 60 * 60)
    },
  },
  day: {
    isValid: (duration: Duration): boolean => {
      return duration.as('days') < 100
    },
    getFirstChunkStart: (bufferedActiveStart: number): DateTime => {
      // tileset should start at current year
      return DateTime.fromMillis(bufferedActiveStart).toUTC().startOf('year')
    },
    getChunkViewEnd: (chunkStart: DateTime): DateTime => {
      return chunkStart.plus({ years: 1 })
    },
    getChunkDataEnd: (chunkViewEnd: DateTime): DateTime => {
      return chunkViewEnd.plus({ days: 100 })
    },
    getFrame: (start: number) => {
      return Math.floor(start / 1000 / 60 / 60 / 24)
    },
    getDate: (frame: number) => {
      return new Date(frame * 1000 * 60 * 60 * 24)
    },
  },
  '10days': {
    getFrame: (start: number) => {
      return Math.floor(start / 1000 / 60 / 60 / 24 / 10)
    },
    getDate: (frame: number) => {
      return new Date(frame * 1000 * 60 * 60 * 24 * 10)
    },
  },
  month: {
    getFrame: (start: number) => {
      Math.floor(
        LuxonInterval.fromDateTimes(
          DateTime.fromMillis(0).toUTC(),
          DateTime.fromMillis(start).toUTC()
        ).toDuration('month').months
      )
    },
    getDate: (frame: number) => {
      const year = 1970 + Math.floor(frame / 12)
      const month = frame % 12
      return new Date(Date.UTC(year, month, 1))
    },
  },
}

/**
 * Returns the type of interval for a given delta in ms
 * @param delta delta in ms
 */
const getInterval = (delta: number): Interval => {
  const duration = Duration.fromMillis(delta)
  if (CONFIG_BY_INTERVAL.day.isValid(duration)) {
    if (CONFIG_BY_INTERVAL.hour.isValid(duration)) {
      return 'hour'
    }
    return 'day'
  }
  return '10days'
}

/**
 * Returns an array of starting points for future time chunks
 * @param bufferedActiveStart start of the buffer in ms
 * @param bufferedActiveEnd  end of the buffer in ms
 * @param interval interval to consider ('day' or 'hour')
 */
const getChunkStarts = (
  bufferedActiveStart: number,
  bufferedActiveEnd: number,
  interval: Interval
): DateTime[] => {
  const config = CONFIG_BY_INTERVAL[interval]
  const firstChunkStart = config.getFirstChunkStart(bufferedActiveStart)
  const chunkStarts: DateTime[] = [firstChunkStart]
  while (true) {
    const nextChunkStart = config.getChunkViewEnd(chunkStarts[chunkStarts.length - 1])
    if (+nextChunkStart > bufferedActiveEnd) {
      break
    }
    chunkStarts.push(nextChunkStart)
  }
  return chunkStarts
}

/**
 * Derive full time chunks from chunk starts
 * @param chunkStarts a series of chunk starts as DT objects
 * @param datasetStart start of available data for this dataset
 * @param datasetEnd end of available data for this dataset
 * @param interval interval to consider ('day' or 'hour')
 */
const getTimeChunks = (
  chunkStarts: DateTime[],
  datasetStart: string,
  datasetEnd: string,
  interval: Interval,
  activeStart: string
) => {
  const config = CONFIG_BY_INTERVAL[interval]
  let activeChunkFrame = 0
  let activeId = ''
  const chunks: TimeChunk[] = chunkStarts.map((chunkStart) => {
    // end of *usable* tileset is end of year
    // end of *loaded* tileset is end of year + 100 days
    const chunkViewEnd = config.getChunkViewEnd(chunkStart)
    let chunkDataEnd = config.getChunkDataEnd(chunkViewEnd)
    // use dataset start if chunk starts before dataset
    if (+chunkStart < +toDT(datasetStart)) chunkStart = toDT(datasetStart)
    // use dataset end if chunk ends after dataset
    if (+chunkDataEnd > +toDT(datasetEnd)) chunkDataEnd = toDT(datasetEnd)
    const start = chunkStart.toString()
    const viewEnd = chunkViewEnd.toString()
    const dataEnd = chunkDataEnd.toString()

    // we will substract every timestamp with this to end up with shorter arrays indexes
    const quantizeOffset = config.getFrame(+chunkStart)

    const activeStartDT = +toDT(activeStart)
    const isActive = activeStartDT > +chunkStart && activeStartDT <= chunkViewEnd
    const frame = toQuantizedFrame(activeStart, quantizeOffset, interval)
    const id = `heatmapchunk_${start.slice(0, 13)}_${viewEnd.slice(0, 13)}`
    if (isActive) {
      activeChunkFrame = frame
      activeId = id
    }

    const chunk: TimeChunk = {
      start,
      viewEnd,
      dataEnd,
      quantizeOffset,
      id,
      frame,
      active: isActive,
    }
    return chunk
  })
  return { chunks, activeChunkFrame, activeId }
}

/**
 * Returns the time chunks that should be loaded for a viewed time range
 * @param activeStart   active time range start (timebar selection)
 * @param activeEnd     active time range end (timebar selection)
 * @param datasetStart  start of available data for this dataset
 * @param datasetEnd    end of available data for this dataset
 */
export const getActiveTimeChunks = (
  activeStart: string,
  activeEnd: string,
  datasetStart: string,
  datasetEnd: string,
  interval_?: IntervalOption
): TimeChunks => {
  const delta = +toDT(activeEnd) - +toDT(activeStart)
  const finalInterval: Interval =
    !interval_ || interval_ === 'auto' ? getInterval(delta) : (interval_ as Interval)
  const timeChunks: TimeChunks = {
    activeStart,
    activeEnd,
    chunks: [],
    delta,
    deltaInIntervalUnits: CONFIG_BY_INTERVAL[finalInterval].getFrame(delta),
    deltaInDays: Duration.fromMillis(delta).as('days'),
    interval: finalInterval,
    activeChunkFrame: 0,
    activeId: '',
  }

  // ignore any start/end time chunk calculation as for the '10 days' interval the entire tileset is loaded
  if (timeChunks.interval === '10days') {
    const frame = toQuantizedFrame(activeStart, 0, timeChunks.interval)
    const config = CONFIG_BY_INTERVAL['10days']
    const id = 'heatmapchunk_10days'
    timeChunks.chunks = [
      {
        quantizeOffset: 0,
        id,
        frame,
        active: true,
      },
    ]
    timeChunks.activeChunkFrame = frame
    timeChunks.activeId = id
    return timeChunks
  } else if (timeChunks.interval === 'month') {
    const frame = toQuantizedFrame(activeStart, 0, timeChunks.interval)
    const id = 'heatmapchunk_month'
    timeChunks.chunks = [
      {
        quantizeOffset: 0,
        id,
        frame,
        active: true,
      },
    ]
    timeChunks.activeChunkFrame = frame
    timeChunks.activeId = id
    console.log(timeChunks)
    return timeChunks
  }

  // calculate start and end taking some buffer into account to proactively load time chunks
  const bufferSize = delta * TIME_CHUNK_BUFFER_RELATIVE_SIZE
  const bufferedActiveStart = +toDT(activeStart) - bufferSize
  const bufferedActiveEnd = +toDT(activeEnd) + bufferSize

  // case when view range is completely outside of dataset range - no chunks
  if (bufferedActiveEnd < +toDT(datasetStart) || bufferedActiveStart > +toDT(datasetEnd)) {
    return timeChunks
  }

  const chunkStarts = getChunkStarts(bufferedActiveStart, bufferedActiveEnd, timeChunks.interval)
  const { chunks, activeChunkFrame, activeId } = getTimeChunks(
    chunkStarts,
    datasetStart,
    datasetEnd,
    timeChunks.interval,
    activeStart
  )
  timeChunks.chunks = chunks
  timeChunks.activeChunkFrame = activeChunkFrame
  timeChunks.activeId = activeId

  return timeChunks
}

const toQuantizedFrame = (date: string, quantizeOffset: number, interval: Interval) => {
  const config = CONFIG_BY_INTERVAL[interval]
  // TODO Use Luxon to use UTC!!!!
  const ms = new Date(date).getTime()
  const frame = config.getFrame(ms)
  return frame - quantizeOffset
}

export const frameToDate = (frame: number, quantizeOffset: number, interval: Interval) => {
  const offsetedFrame = frame + quantizeOffset
  const config = CONFIG_BY_INTERVAL[interval]
  return config.getDate(offsetedFrame) as Date
}

export const quantizeOffsetToDate = (quantizeOffset: number, interval: Interval) => {
  return frameToDate(0, quantizeOffset, interval)
}

export const getDelta = (start: string, end: string, interval: Interval) => {
  const config = CONFIG_BY_INTERVAL[interval]
  const startTimestampMs = new Date(start).getTime()
  const endTimestampMs = new Date(end).getTime()
  const delta = config.getFrame(endTimestampMs - startTimestampMs)
  return delta
}
