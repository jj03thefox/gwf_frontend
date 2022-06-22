import { FeatureCollection } from 'geojson'
import { EndpointId, ThinningConfig } from '@globalfishingwatch/api-types'
import { getTracksChunkSetId } from '@globalfishingwatch/dataviews-client'
import { LineColorBarOptions } from '@globalfishingwatch/ui-components'
import { hasDatasetConfigVesselData } from 'features/datasets/datasets.utils'
import { TimebarGraphs } from 'types'

type ThinningConfigParam = { zoom: number; config: ThinningConfig }
export const trackDatasetConfigsCallback = (
  thinningConfig = {} as ThinningConfigParam,
  chunks: { start: string; end: string }[],
  timebarGraph
) => {
  return ([info, track, ...events]) => {
    if (track.endpoint === EndpointId.Tracks) {
      const query = [...(track.query || [])]
      const fieldsQueryIndex = query.findIndex((q) => q.id === 'fields')
      let trackGraph
      if (timebarGraph !== TimebarGraphs.None) {
        trackGraph = { ...track }
        const fieldsQuery = {
          id: 'fields',
          value: ['timestamp', timebarGraph].join(','),
        }
        if (fieldsQueryIndex > -1) {
          query[fieldsQueryIndex] = fieldsQuery
          trackGraph.query = query
        } else {
          trackGraph.query = [...query, fieldsQuery]
        }
      }

      const thinningQuery = Object.entries(thinningConfig?.config || []).map(([id, value]) => ({
        id,
        value,
      }))
      const trackWithThinning = {
        ...track,
        query: [...(track.query || []), ...thinningQuery],
        metadata: {
          zoom: thinningConfig?.zoom || 12,
        },
      }

      // Generate one infoconfig per chunk (if specified)
      // TODO move this in dataviews-client/get-resources, since merging back tracks together is done by the generic slice anyways
      let allTracks = [trackWithThinning]

      if (chunks) {
        const chunkSetId = getTracksChunkSetId(trackWithThinning)
        allTracks = chunks.map((chunk) => {
          const trackChunk = { ...trackWithThinning }
          const trackQuery = [...(trackWithThinning.query || [])]
          trackChunk.query = [
            ...trackQuery,
            {
              id: 'start-date',
              value: chunk.start,
            },
            {
              id: 'end-date',
              value: chunk.end,
            },
          ]
          const trackMetadata = { ...trackWithThinning.metadata } || {}

          trackChunk.metadata = {
            ...trackMetadata,
            chunkSetId,
            chunkSetNum: chunks.length,
          }

          return trackChunk
        })
      }
      // Clean resources when mandatory vesselId is missing
      // needed for vessels with no info datasets (zebraX)
      const vesselData = hasDatasetConfigVesselData(info)
      return [
        ...allTracks,
        ...events,
        ...(vesselData ? [info] : []),
        ...(trackGraph ? [trackGraph] : []),
      ]
    }
    return [info, track, ...events].filter(Boolean)
  }
}

export const parseUserTrackCallback = (geoJSON: FeatureCollection) => {
  geoJSON.features = geoJSON.features.map((feature, i) => {
    const color = LineColorBarOptions[i % LineColorBarOptions.length].value
    return {
      ...feature,
      properties: {
        ...feature.properties,
        color,
      },
    }
  })
  return geoJSON
}
