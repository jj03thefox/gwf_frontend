import { createSelector } from '@reduxjs/toolkit'
import { selectTimebarGraph } from 'features/app/app.selectors'
import {
  resolveDataviewDatasetResource,
  selectActiveVesselsDataviews,
} from 'features/workspace/workspace.selectors'
import { selectResources, Resource, TrackResourceData } from 'features/resources/resources.slice'
import { TRACKS_DATASET_TYPE } from 'data/datasets'

type TimebarTrackSegment = {
  start: number
  end: number
}

type TimebarTrack = {
  segments: TimebarTrackSegment[]
  color: string
}

export const selectTracksData = createSelector(
  [selectActiveVesselsDataviews, selectResources],
  (trackDataviews, resources) => {
    if (!trackDataviews || !resources) return

    const tracksSegments: TimebarTrack[] = trackDataviews.flatMap((dataview) => {
      const { url } = resolveDataviewDatasetResource(dataview, { type: TRACKS_DATASET_TYPE })
      if (!url) return []
      const track = resources[url] as Resource<TrackResourceData>
      if (!track?.data) return []

      const trackSegments: TimebarTrackSegment[] = track.data?.map((segment) => {
        return {
          start: segment[0].timestamp || 0,
          end: segment[segment.length - 1].timestamp || 0,
        }
      })
      return {
        segments: trackSegments,
        color: dataview.config?.color || '',
      }
    })

    return tracksSegments
  }
)

export const selectTracksGraphs = createSelector(
  [selectActiveVesselsDataviews, selectTimebarGraph, selectResources],
  (trackDataviews, timebarGraph, resources) => {
    if (!trackDataviews || !resources) return

    const graphs = trackDataviews.flatMap((dataview) => {
      const { url } = resolveDataviewDatasetResource(dataview, { type: TRACKS_DATASET_TYPE })
      if (!url) return []
      const track = resources[url] as Resource<TrackResourceData>
      if (!track?.data) return []

      const segmentsWithCurrentFeature = track.data?.map((segment) => {
        return segment.flatMap((pt) => {
          const value = (pt as any)[timebarGraph]
          if (!value) return []
          return {
            date: pt.timestamp,
            value,
          }
        })
      })
      return {
        color: dataview.config?.color || '',
        segmentsWithCurrentFeature,
        // TODO Figure out this magic value
        maxValue: 25,
      }
    })
    return graphs
  }
)
