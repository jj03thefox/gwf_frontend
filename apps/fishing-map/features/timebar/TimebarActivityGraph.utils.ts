import { uniqBy } from 'lodash'
import { DateTime } from 'luxon'
import {
  AggregationOperation,
  getTimeSeries,
  TimeSeriesFrame,
} from '@globalfishingwatch/fourwings-aggregate'
import { quantizeOffsetToDate, Interval } from '@globalfishingwatch/layer-composer'
import { DataviewChunkFeature, DataviewFeature } from 'features/map/map-sources.hooks'

type TimeseriesParams = {
  chunksFeatures: DataviewChunkFeature[]
  numSublayers: number
  interval: Interval
  visibleSublayers: boolean[]
  aggregationOperation: AggregationOperation
}

export const getChunksTimeseries = ({
  chunksFeatures,
  numSublayers,
  interval,
  visibleSublayers,
  aggregationOperation,
}: TimeseriesParams) => {
  const allChunksValues = chunksFeatures.flatMap(({ features, quantizeOffset }) => {
    if (features?.length > 0) {
      const { values } = getTimeSeries(features, numSublayers, quantizeOffset)

      const finalValues = values.map((frameValues) => {
        // Ideally we don't have the features not visible in 4wings but we have them
        // so this needs to be filtered by the current active ones
        const activeFrameValues = Object.fromEntries(
          Object.entries(frameValues).map(([key, value]) => {
            const cleanValue =
              key === 'frame' || visibleSublayers[parseInt(key)] === true ? value : 0
            return [key, cleanValue]
          })
        ) as TimeSeriesFrame
        return {
          ...activeFrameValues,
          date: quantizeOffsetToDate(frameValues.frame, interval).getTime(),
        }
      })
      if (aggregationOperation === AggregationOperation.Avg) {
        const lastItem = finalValues[finalValues.length - 1]
        const month = DateTime.fromMillis(lastItem.date)
        const nextMonth = DateTime.fromMillis(lastItem.date).plus({ month: 1 })
        const millisOffset = nextMonth.diff(month).milliseconds
        return finalValues.concat({
          ...lastItem,
          frame: lastItem.frame + 1,
          date: lastItem.date + millisOffset,
        })
      }
      return finalValues
    } else {
      return []
    }
  })
  return allChunksValues
}

export const getTimeseriesFromDataviews = (dataviewFeatures: DataviewFeature[]) => {
  const uniqDataviewFeatures = uniqBy(dataviewFeatures, 'sourceId')
  const dataviewsTimeseries = uniqDataviewFeatures.map(({ chunksFeatures, metadata, state }) => {
    if (!state.loaded || state.error || !chunksFeatures) {
      // TODO return loading or null depending on state
      return []
    }
    const timeChunks = metadata.timeChunks
    const timeseries = getChunksTimeseries({
      chunksFeatures,
      interval: timeChunks.interval,
      numSublayers: metadata.numSublayers,
      visibleSublayers: metadata.visibleSublayers,
      aggregationOperation: metadata.aggregationOperation,
    })
    return timeseries
  })
  return dataviewsTimeseries[0]
}
