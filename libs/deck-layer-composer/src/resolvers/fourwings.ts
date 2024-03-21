import { PickingInfo } from '@deck.gl/core'
import { uniq } from 'lodash'
import {
  UrlDataviewInstance,
  resolveDataviewDatasetResource,
} from '@globalfishingwatch/dataviews-client'
import {
  FourwingsAggregationOperation,
  FourwingsComparisonMode,
  FourwingsDeckSublayer,
  FourwingsLayerProps,
  FourwingsVisualizationMode,
  getUTCDateTime,
} from '@globalfishingwatch/deck-layers'
import { DatasetTypes, DataviewCategory } from '@globalfishingwatch/api-types'
import { ColorRampId } from '@globalfishingwatch/deck-layers'
import { getDataviewAvailableIntervals } from './dataviews'
import { ResolverGlobalConfig } from './types'

// TODO: decide if include static here or create a new one
export const resolveDeckFourwingsLayerProps = (
  dataview: UrlDataviewInstance,
  { start, end, resolution }: ResolverGlobalConfig,
  interactions: PickingInfo[]
): FourwingsLayerProps => {
  const startTime = start ? getUTCDateTime(start).toMillis() : 0
  const endTime = end ? getUTCDateTime(end).toMillis() : Infinity

  const visibleSublayers = dataview.config?.sublayers?.filter((sublayer) => sublayer?.visible)
  console.log('🚀 ~ dataview:', dataview)
  const sublayers: FourwingsDeckSublayer[] = (visibleSublayers || []).map((sublayer) => {
    const units = uniq(sublayer.datasets?.map((dataset) => dataset.unit))

    if (units.length > 0 && units.length !== 1) {
      console.warn('Shouldnt have distinct units for the same heatmap layer')
    }

    return {
      id: sublayer.id,
      visible: sublayer?.visible ?? true,
      datasets: sublayer?.datasets.map((dataset) => dataset.id),
      config: {
        color: (sublayer?.color || dataview.config?.color) as string,
        colorRamp: sublayer?.colorRamp as ColorRampId,
        visible: sublayer?.visible,
        unit: sublayer?.legend?.unit,
      },
      legend: {
        label: sublayer?.datasets?.[0]?.name!,
        unit: units[0]!,
        color: dataview?.config?.color!,
      },
    }
  })

  const maxZoomLevels = dataview.config?.sublayers?.flatMap(({ maxZoom }) =>
    maxZoom !== undefined ? (maxZoom as number) : []
  )

  const availableIntervals = getDataviewAvailableIntervals(dataview)

  // TODO: get this from the dataset config
  const aggregationOperation =
    dataview.category === DataviewCategory.Environment
      ? FourwingsAggregationOperation.Avg
      : FourwingsAggregationOperation.Sum

  const { url } = resolveDataviewDatasetResource(
    visibleSublayers?.[0] as UrlDataviewInstance,
    DatasetTypes.Fourwings
  )

  return {
    id: dataview.id,
    hoveredFeatures: interactions,
    minFrame: startTime,
    maxFrame: endTime,
    resolution,
    sublayers,
    tilesUrl: url,
    aggregationOperation,
    debug: dataview.config?.debug ?? false,
    visible: dataview.config?.visible ?? true,
    comparisonMode: dataview.config?.comparisonMode as FourwingsComparisonMode,
    visualizationMode: dataview.config?.visualizationMode as FourwingsVisualizationMode,
    colorRampWhiteEnd: dataview.config?.colorRampWhiteEnd,
    availableIntervals,
    // if any of the activity dataviews has a max zoom level defined
    // apply the minimum max zoom level (the most restrictive approach)
    ...(maxZoomLevels &&
      maxZoomLevels.length > 0 && {
        maxZoom: Math.min(...maxZoomLevels),
      }),
  }
}
