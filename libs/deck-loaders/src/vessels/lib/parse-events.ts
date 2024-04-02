import { DateTime } from 'luxon'
import { ApiEvent } from '@globalfishingwatch/api-types'
import { VesselDeckLayersEventData } from './types'

function decodeEventsBuffer(arrayBuffer: ArrayBuffer) {
  const data = JSON.parse(new TextDecoder().decode(arrayBuffer))
  return data.entries as ApiEvent[]
}

export function parseEvents(arrayBuffer: ArrayBuffer): VesselDeckLayersEventData[] {
  const events = decodeEventsBuffer(arrayBuffer)
  return events?.map((event) => {
    const { position, start, end, type, ...attributes } = event
    return {
      ...attributes,
      type,
      coordinates: [event.position.lon, event.position.lat],
      start: DateTime.fromISO(start as string, { zone: 'utc' }).toMillis(),
      end: DateTime.fromISO(end as string, { zone: 'utc' }).toMillis(),
    }
  })
}
