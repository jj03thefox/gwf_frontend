import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { FeatureCollection } from 'geojson'
import { IconButton } from '@globalfishingwatch/ui-components'
import {
  Segment,
  segmentsToBbox,
  filterSegmentsByTimerange,
  geoJSONToSegments,
} from '@globalfishingwatch/data-transforms'
import { Resource } from '@globalfishingwatch/api-types'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import { Bbox } from 'types'

type FitBoundsProps = {
  className: string
  trackResource: Resource<Segment[] | FeatureCollection>
  hasError: boolean
}

const FitBounds = ({ className, trackResource, hasError }: FitBoundsProps) => {
  const { t } = useTranslation()
  const fitBounds = useMapFitBounds()
  const { dispatchTimeranges, start, end } = useTimerangeConnect()
  const onFitBoundsClick = useCallback(() => {
    if (trackResource?.data && start && end) {
      const segments = (trackResource.data as FeatureCollection).features
        ? geoJSONToSegments(trackResource.data as FeatureCollection)
        : (trackResource?.data as Segment[])
      const filteredSegments = filterSegmentsByTimerange(segments, { start, end })
      const bbox = filteredSegments?.length ? segmentsToBbox(filteredSegments) : undefined
      if (bbox) {
        fitBounds(bbox as Bbox)
      } else {
        // TODO use prompt to ask user if wants to update the timerange to fit the track
        if (
          window.confirm(
            t(
              'layer.vessel_fit_bounds_out_of_timerange',
              'The track has no activity in your selected timerange. Change timerange to fit this track?'
            )
          )
        ) {
          let minTimestamp = Number.POSITIVE_INFINITY
          let maxTimestamp = Number.NEGATIVE_INFINITY
          segments.forEach((seg) => {
            seg.forEach((pt) => {
              if (pt.timestamp && pt.timestamp < minTimestamp) minTimestamp = pt.timestamp
              if (pt.timestamp && pt.timestamp > maxTimestamp) maxTimestamp = pt.timestamp
            })
          })
          dispatchTimeranges({
            start: new Date(minTimestamp).toISOString(),
            end: new Date(maxTimestamp).toISOString(),
            source: '',
          })
          const fullBBox = segmentsToBbox(segments)
          fitBounds(fullBBox as Bbox)
        }
      }
    }
  }, [fitBounds, trackResource, start, end, t, dispatchTimeranges])
  return (
    <IconButton
      size="small"
      icon={hasError ? 'warning' : 'target'}
      type={hasError ? 'warning' : 'default'}
      className={className}
      tooltip={
        hasError
          ? t('errors.trackLoading', 'There was an error loading the vessel track')
          : t('layer.vessel_fit_bounds', 'Center view on vessel track')
      }
      onClick={onFitBoundsClick}
      tooltipPlacement="top"
    />
  )
}

export default FitBounds
