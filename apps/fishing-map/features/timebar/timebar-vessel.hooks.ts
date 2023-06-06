import { minBy, maxBy } from 'lodash'
import { useEffect, useState } from 'react'
import { ResourceStatus } from '@globalfishingwatch/api-types'
import { useVesselLayers } from '@globalfishingwatch/deck-layers'
import {
  HighlighterCallbackFnArgs,
  TimebarChartData,
  TrackEventChunkProps,
} from '@globalfishingwatch/timebar'
import { t } from 'features/i18n/i18n'

const getUserTrackHighlighterLabel = ({ chunk }: HighlighterCallbackFnArgs) => {
  return chunk.props?.id || null
}

export const useTimebarVesselTracks = () => {
  const vessels = useVesselLayers()
  const [tracks, setVesselTracks] = useState<TimebarChartData<any> | null>(null)

  useEffect(() => {
    requestAnimationFrame(() => {
      if (vessels?.length) {
        const vesselTracks = vessels.map((vessel) => {
          const track = vessel.getVesselTrackData()
          const chunks = track.map((t) => {
            const start = (minBy(t, 'timestamp') as any)?.timestamp
            const end = (maxBy(t, 'timestamp') as any)?.timestamp
            return {
              start,
              end,
              props: { id: '', color: 'red' },
              values: t.map((v) => ({
                longitude: v.coordinates[0],
                latitude: v.coordinates[1],
                timestamp: v.timestamp,
              })),
            }
          })
          return {
            status: ResourceStatus.Finished,
            chunks,
            defaultLabel: vessel.getVesselName() || '',
            getHighlighterLabel: getUserTrackHighlighterLabel,
            getHighlighterIcon: 'vessel',
          }
        })
        setVesselTracks(vesselTracks)
      }
    })
  }, [vessels])
  return tracks
}

const getTrackEventHighlighterLabel = ({ chunk, expanded }: HighlighterCallbackFnArgs) => {
  if (chunk.cluster) {
    return `${chunk.props?.descriptionGeneric} (${chunk.cluster.numChunks} ${t(
      'event.events',
      'events'
    )})`
  }
  if (expanded) {
    return chunk.props?.description
  }
  return chunk.props?.descriptionGeneric
}

export const useTimebarVesselEvents = () => {
  const vessels = useVesselLayers()
  const [events, setVesselEvents] = useState<TimebarChartData<TrackEventChunkProps> | null>(null)

  useEffect(() => {
    requestAnimationFrame(() => {
      if (vessels.length) {
        const vesselEvents: TimebarChartData<any> = vessels.map((vessel, index) => {
          const chunks = vessel.getVesselEventsData().map((e) => ({
            start: e.start as number,
            end: e.end as number,
            type: e.type,
          }))
          return {
            color: vessel.props?.themeColor,
            chunks,
            status: ResourceStatus.Finished,
            defaultLabel: vessel.getVesselName(),
            getHighlighterLabel: getTrackEventHighlighterLabel,
            getHighlighterIcon: 'vessel',
          }
        })
        setVesselEvents(vesselEvents)
      }
    })
  }, [vessels])
  return events
}
