import { DateTime } from 'luxon'
import { FeatureCollection } from 'geojson'
import { Segment, segmentsToGeoJSON } from '@globalfishingwatch/data-transforms'
import { Dictionary } from '../../types'
import filterTrackByTimerange from '../track/filterTrackByTimerange'
import { AuthorizationOptions, RawEvent } from '../types'

const EVENTS_COLORS: Dictionary<string> = {
  encounter: '#FAE9A0',
  partially: '#F59E84',
  unmatched: '#CE2C54',
  loitering: '#cfa9f9',
  port: '#99EEFF',
  fishing: '#ffffff',
}

const getEncounterAuthColor = (authorizationStatus: AuthorizationOptions) => {
  switch (authorizationStatus) {
    case 'authorized':
      return EVENTS_COLORS.encounter
    case 'partially':
      return EVENTS_COLORS.partially
    case 'unmatched':
      return EVENTS_COLORS.unmatched
    default:
      return ''
  }
}

export const setActiveEvent = (
  data: FeatureCollection,
  currentEventId: string | null
): FeatureCollection => {
  const featureCollection = { ...data }
  featureCollection.features = featureCollection.features.map((feature) => {
    const newFeature = { ...feature }
    newFeature.properties = newFeature.properties || {}
    newFeature.properties.active = currentEventId
      ? newFeature.properties.id === currentEventId
      : false
    return newFeature
  })
  featureCollection.features.sort((a, b) => {
    if (a.properties && a.properties.active) return 1
    else if (b.properties && b.properties.active) return -1
    else return 0
  })
  return featureCollection
}

const getDateTimeDate = (date: string | number) => {
  return typeof date === 'number' ? DateTime.fromMillis(date) : DateTime.fromISO(date)
}

export const getVesselEventsGeojson = (trackEvents: RawEvent[] | null): FeatureCollection => {
  const featureCollection: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  }

  if (!trackEvents) return featureCollection
  const trackEventsSorted = [...trackEvents].sort((a, b) => (a.type === 'encounter' ? 1 : -1))
  featureCollection.features = trackEventsSorted.map((event: RawEvent) => {
    const authorized = event.encounter && event.encounter.authorized === true
    const authorizationStatus = event.encounter
      ? event.encounter.authorizationStatus
      : ('unmatched' as AuthorizationOptions)

    const lng = event.position.lng || event.position.lon || 0

    return {
      type: 'Feature',
      properties: {
        id: event.id,
        type: event.type,
        timestamp: event.start,
        start: getDateTimeDate(event.start).toUTC().toISO(),
        end: getDateTimeDate(event.end).toUTC().toISO(),
        authorized,
        authorizationStatus,
        icon: `carrier_portal_${event.type}`,
        color:
          event.type === 'encounter'
            ? getEncounterAuthColor(authorizationStatus)
            : EVENTS_COLORS[event.type],
      },
      geometry: {
        type: 'Point',
        coordinates: [lng, event.position.lat],
      },
    }
  })

  return featureCollection
}

export const filterGeojsonByTimerange = (
  geojson: FeatureCollection,
  start: string,
  end: string
): FeatureCollection => {
  if (!geojson || !geojson.features) {
    return {
      type: 'FeatureCollection',
      features: [],
    }
  }
  if (!start || !end) {
    return geojson
  }

  const featuresFiltered = geojson.features.filter((feature) => {
    return feature.properties?.start >= start && feature.properties?.end <= end
  })

  const geojsonFiltered: FeatureCollection = {
    ...geojson,
    features: featuresFiltered,
  }
  return geojsonFiltered
}

export const getVesselSegmentsGeojson = (
  track: any,
  data: RawEvent[],
  currentEventId?: string
): FeatureCollection => {
  const featureCollection: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  }

  if (!track || !data) return featureCollection

  const geojson = (track as FeatureCollection).type
    ? (track as FeatureCollection)
    : segmentsToGeoJSON(track as Segment[])
  if (!geojson) return featureCollection

  featureCollection.features = data.flatMap((event: RawEvent) => {
    return filterTrackByTimerange(geojson, event.start, event.end).features.map((feature) => ({
      ...feature,
      properties: {
        id: event.id,
        type: event.type,
        start: getDateTimeDate(event.start).toUTC().toISO(),
        end: getDateTimeDate(event.end).toUTC().toISO(),
        ...(event.vessel && {
          vesselId: event.vessel.id,
          vesselName: event.vessel.name,
        }),
        ...(currentEventId && { active: event.id === currentEventId }),
      },
    }))
  })
  return featureCollection
}
