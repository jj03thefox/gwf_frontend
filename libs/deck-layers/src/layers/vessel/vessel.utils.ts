import { DateTime } from 'luxon'
import memoize from 'lodash/memoize'
import { UserTrackBinaryData, VesselTrackData } from '@globalfishingwatch/deck-loaders'
import { ApiEvent, EventTypes, EventVessel, TrackSegment } from '@globalfishingwatch/api-types'
import { getUTCDateTime } from '../../utils'
import { VesselEventsLayer } from './VesselEventsLayer'

export const FIRST_YEAR_OF_DATA = 2012
export const CURRENT_YEAR = DateTime.now().year
export const getVesselResourceChunks = (start: number, end: number) => {
  const startDT = getUTCDateTime(start)
  const startYear = startDT.year
  const startDTBuffered = startYear > FIRST_YEAR_OF_DATA ? startDT.minus({ months: 2 }) : startDT
  const startYearBuffered = startDTBuffered.year

  const endDT = getUTCDateTime(end).minus({ milliseconds: 1 })
  const endYear = endDT.year
  const endDTBuffered = endYear < CURRENT_YEAR ? endDT.plus({ months: 2 }) : endDT
  const endYearBuffered = endDTBuffered.year

  const yearsDelta = endYear - startYear + 1

  const initialBuffer = startYearBuffered === startYear ? 0 : 1
  const finalBuffer = endYearBuffered === endYear ? 0 : 1

  // Prebuffering one year before and another after
  const yearsChunks = [...new Array(yearsDelta + initialBuffer + finalBuffer)].map((_, i) => {
    // Generating one full year per chunk so we could take advantage of browser cache more often
    const year = startYearBuffered + i
    const start = DateTime.fromObject({ year }, { zone: 'utc' }).toISO()
    const end = DateTime.fromObject({ year: year + 1 }, { zone: 'utc' }).toISO()
    return { start, end }
  })
  return yearsChunks
}

export type GetSegmentsFromDataParams = {
  includeMiddlePoints?: boolean
  includeCoordinates?: boolean
}

export const getSegmentsFromData = memoize(
  (
    data: VesselTrackData | UserTrackBinaryData,
    { includeMiddlePoints = false, includeCoordinates = false } = {} as GetSegmentsFromDataParams
  ): TrackSegment[] => {
    const segmentsIndexes = data.startIndices
    const positions = data.attributes?.getPath?.value
    const timestamps = data.attributes?.getTimestamp?.value
    const speeds = (data as VesselTrackData).attributes?.getSpeed?.value
    const elevations = (data as VesselTrackData).attributes?.getElevation?.value

    if (!positions?.length || !timestamps.length) {
      return []
    }

    const pathSize = data.attributes.getPath!?.size
    const timestampSize = data.attributes.getTimestamp!?.size
    const speedSize = (data as VesselTrackData).attributes.getSpeed!?.size
    const elevationSize = (data as VesselTrackData).attributes.getElevation!?.size

    const segments = segmentsIndexes.map((segmentIndex, i, segmentsIndexes) => {
      const points = [] as TrackSegment
      points.push({
        ...(includeCoordinates && {
          longitude: positions[segmentIndex * pathSize],
          latitude: positions[segmentIndex * pathSize + 1],
        }),
        timestamp: timestamps[segmentIndex / timestampSize],
        ...(speedSize && {
          speed: speeds?.[segmentIndex / speedSize] || 0,
        }),
        ...(elevationSize && {
          elevation: elevations?.[segmentIndex / elevationSize] || 0,
        }),
      })
      const nextSegmentIndex = segmentsIndexes[i + 1] || timestamps.length - 1
      if (includeMiddlePoints && segmentIndex + 1 < nextSegmentIndex) {
        for (let index = segmentIndex + 1; index < nextSegmentIndex; index++) {
          points.push({
            ...(includeCoordinates && {
              longitude: positions[index * pathSize],
              latitude: positions[index * pathSize + 1],
            }),

            timestamp: timestamps[index / timestampSize],
            ...(speedSize && {
              speed: speeds?.[index / speedSize] || 0,
            }),
            ...(elevationSize && {
              elevation: elevations?.[index / elevationSize] || 0,
            }),
          })
        }
      }
      if (i === segmentsIndexes.length - 1) {
        points.push({
          ...(includeCoordinates && {
            longitude: positions[positions.length - pathSize],
            latitude: positions[positions.length - 1],
          }),
          timestamp: timestamps[timestamps.length - 1],
          ...(speedSize && { speed: speeds?.[speeds.length - 1] || 0 }),
          ...(elevationSize && { elevation: elevations?.[elevations.length - 1] || 0 }),
        })
      } else {
        points.push({
          ...(includeCoordinates && {
            longitude: positions[nextSegmentIndex / pathSize - 1],
            latitude: positions[nextSegmentIndex / timestampSize + 1],
          }),
          timestamp: timestamps[nextSegmentIndex / timestampSize - 1],
          ...(speedSize && { speed: speeds?.[nextSegmentIndex / speedSize - 1] || 0 }),
          ...(elevationSize && {
            elevation: elevations?.[nextSegmentIndex / elevationSize - 1] || 0,
          }),
        })
      }
      return points
    })
    return segments
  },
  (data, params) => {
    return `${data?.startIndices?.join(',')}-${JSON.stringify(params || {})}`
  }
)

export const getEvents = memoize(
  (
    layers: VesselEventsLayer[],
    { types } = {} as { types?: EventTypes[]; startTime?: number; endTime?: number }
  ) => {
    return layers
      .flatMap((layer: VesselEventsLayer): ApiEvent<EventVessel>[] => {
        const events =
          types && types.length
            ? types.includes(layer.props.type)
              ? layer.props.data
              : []
            : layer.props.data || []
        return events as ApiEvent[]
      }, [])
      .sort((a, b) => (a.start as number) - (b.start as number))
  },
  (layers, { types, startTime, endTime }) => {
    const typesHash = types?.join(',')
    const layersLength = layers.length
    const layersIdsHash = layers.map((layer) => layer.id).join(',')
    const layersLoaded = layers.map((layer) => layer.isLoaded).join(',')
    const chunksHash = JSON.stringify(getVesselResourceChunks(startTime, endTime))
    return `${layersLength}-${layersLoaded}-${layersIdsHash}-${typesHash}-${chunksHash}`
  }
)
