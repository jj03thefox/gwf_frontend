// import { useEffect, useState, useCallback } from 'react'
// import { useDebounce, useSmallScreen } from '@globalfishingwatch/react-hooks'
// import { Timeseries, ActivityTimeseriesFrame } from '@globalfishingwatch/timebar'
// import { GeoJSONFeature } from '@globalfishingwatch/maplibre-gl'
// import { TimeseriesFeatureProps } from '@globalfishingwatch/fourwings-aggregate'
// import { getDatasetsExtent, UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

// import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
// import { getTimeseriesFromFeatures } from '@globalfishingwatch/features-aggregate'
// import { checkEqualBounds, useMapBounds } from 'features/map/map-viewport.hooks'
// import { getActiveActivityDatasetsInDataviews } from 'features/datasets/datasets.utils'
// import {
//   areDataviewsFeatureLoaded,
//   DataviewFeature,
//   hasDataviewsFeatureError,
//   useMapDataviewFeatures,
// } from 'features/map/map-sources.hooks'
import {
  useFourwingsActivityLayer,
  useFourwingsLayersLoaded,
} from '@globalfishingwatch/deck-layers'
import { getGraphFromGridCellsData } from './timebar.utils'

export const useHeatmapActivityGraph = () => {
  const fourwingsLayersLoaded = useFourwingsLayersLoaded()
  const loading = !fourwingsLayersLoaded.find((l) => l.id === 'activity')?.loaded
  const fourwingsActivityLayer = useFourwingsActivityLayer()
  const activityData = fourwingsActivityLayer?.instance?.getData()

  const heatmapActivity = activityData?.length ? getGraphFromGridCellsData(activityData) || [] : []
  return { loading, heatmapActivity }
}

// export const useStackedActivity = (dataviews: UrlDataviewInstance[]) => {
//   const [generatingStackedActivity, setGeneratingStackedActivity] = useState(false)
//   const [stackedActivity, setStackedActivity] = useState<Timeseries>()
//   const isSmallScreen = useSmallScreen()
//   const { bounds } = useMapBounds()
//   const debouncedBounds = useDebounce(bounds, 400)
//   const dataviewFeatures = useMapDataviewFeatures(dataviews)
//   const error = hasDataviewsFeatureError(dataviewFeatures)
//   const boundsChanged = !checkEqualBounds(bounds, debouncedBounds)
//   const layersFilterHash = dataviewFeatures
//     .flatMap(({ metadata }) => `${metadata?.minVisibleValue}-${metadata?.maxVisibleValue}`)
//     .join(',')
//   const loading =
//     boundsChanged || !areDataviewsFeatureLoaded(dataviewFeatures) || generatingStackedActivity

//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   const debouncedSetStackedActivity = useCallback(
//     (dataviewFeatures: DataviewFeature[], bounds) => {
//       const dataviewFeaturesFiltered = dataviewFeatures.map((dataviewFeature) => {
//         const activeDataviewDatasets = getActiveActivityDatasetsInDataviews(dataviews)
//         const dataviewExtents = activeDataviewDatasets.map((dataviewDatasets) =>
//           getDatasetsExtent(dataviewDatasets, {
//             format: 'timestamp',
//           })
//         )
//         return {
//           ...dataviewFeature,
//           chunksFeatures: dataviewFeature.chunksFeatures?.map((chunk) => {
//             return {
//               ...chunk,
//               startDataTimestamps: dataviewExtents.map((d) => d.extentStart),
//               endDataTimestamps: dataviewExtents.map((d) => d.extentEnd),
//               features: chunk.features
//                 ? (filterFeaturesByBounds(
//                     chunk.features,
//                     bounds
//                   ) as GeoJSONFeature<TimeseriesFeatureProps>[])
//                 : [],
//             }
//           }),
//         }
//       })
//       const stackedActivity = getTimeseriesFromFeatures(dataviewFeaturesFiltered)
//       setStackedActivity(stackedActivity)
//       setGeneratingStackedActivity(false)
//     },
//     [dataviews, setStackedActivity]
//   )

//   const dataviewFeaturesLoaded = areDataviewsFeatureLoaded(dataviewFeatures)
//   useEffect(() => {
//     if (!isSmallScreen && dataviewFeaturesLoaded && !error) {
//       setGeneratingStackedActivity(true)
//       debouncedSetStackedActivity(dataviewFeatures, debouncedBounds)
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dataviewFeaturesLoaded, debouncedBounds, isSmallScreen, layersFilterHash])

//   return { loading, error, stackedActivity }
// }
