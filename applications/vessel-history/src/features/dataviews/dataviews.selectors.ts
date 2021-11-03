import { createSelector } from '@reduxjs/toolkit'
import { DatasetTypes, DataviewCategory, DataviewInstance } from '@globalfishingwatch/api-types'
import {
  resolveDataviews,
  UrlDataviewInstance,
  getGeneratorConfig,
  mergeWorkspaceUrlDataviewInstances,
  DatasetConfigsTransforms,
  getDataviewsForResourceQuerying,
  resolveResourcesFromDatasetConfigs,
} from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { GeneratorType } from '@globalfishingwatch/layer-composer/dist/generators'
import { Type } from '@globalfishingwatch/layer-composer/dist/generators/types'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectDatasets, selectDatasetsStatus } from 'features/datasets/datasets.slice'
import { selectVesselDataview } from 'features/vessels/vessels.slice'
import { selectUrlDataviewInstances } from 'routes/routes.selectors'
import { selectWorkspaceDataviewInstances } from 'features/workspace/workspace.selectors'
import { selectAllDataviews, selectDataviewsStatus } from './dataviews.slice'
import { BACKGROUND_LAYER, OFFLINE_LAYERS, APP_THINNING, THINNING_LEVELS } from './dataviews.config'

const defaultBasemapDataview = {
  id: 'basemap',
  config: {
    type: Generators.Type.Basemap,
    basemap: Generators.BasemapType.Default,
  },
}

export const selectDefaultOfflineDataviewsGenerators = createSelector([], () => {
  return BACKGROUND_LAYER.concat(OFFLINE_LAYERS)
})

export const selectBasemapDataview = createSelector([selectAllDataviews], (dataviews) => {
  const basemapDataview = dataviews.find((d) => d.config.type === GeneratorType.Basemap)
  return basemapDataview || defaultBasemapDataview
})

export const selectDefaultBasemapGenerator = createSelector(
  [selectBasemapDataview],
  (basemapDataview) => {
    const basemapGenerator = getGeneratorConfig(
      basemapDataview as UrlDataviewInstance<Type>
    ) as Generators.BasemapGeneratorConfig
    return basemapGenerator
  }
)

export const selectDataviewInstancesMerged = createSelector(
  [selectVesselDataview, selectWorkspaceDataviewInstances, selectUrlDataviewInstances],
  (vesselDataview, dataviews, urlDataviewInstances) => {
    console.log(5)
    const dataviewsToMerge: DataviewInstance<any>[] = vesselDataview
      ? [...dataviews, vesselDataview]
      : dataviews
    return mergeWorkspaceUrlDataviewInstances(dataviewsToMerge, urlDataviewInstances)
  }
)

export const selectDataviewInstancesResolved = createSelector(
  [
    selectDataviewsStatus,
    selectAllDataviews,
    selectDatasets,
    selectDatasetsStatus,
    selectDataviewInstancesMerged,
  ],
  (
    dataviewsStatus,
    dataviews,
    datasets,
    datasetsStatus,
    dataviewInstances
  ): UrlDataviewInstance[] => {

    console.log('EEEEEEEEEEEEEEEEEEEEE Maradona')
    /*if (
      dataviewsStatus !== AsyncReducerStatus.Finished ||
      datasetsStatus !== AsyncReducerStatus.Finished
    ) {
      return []
    }*/
    const dataviewInstancesResolved = resolveDataviews(
      dataviewInstances as UrlDataviewInstance[],
      dataviews,
      datasets
    )
    return dataviewInstancesResolved
  }
)

/**
 * Calls getDataviewsForResourceQuerying to prepare track dataviews' datasetConfigs.
 * Injects app-specific logic by using getDataviewsForResourceQuerying's callback
 */
export const selectDataviewsForResourceQuerying = createSelector(
  [selectDataviewInstancesResolved],
  (dataviewInstances) => {
    console.log('DDDDDDDDDDDDDD')
    console.log(dataviewInstances)
    const thinningConfig = THINNING_LEVELS[APP_THINNING]
    const datasetConfigsTransforms: DatasetConfigsTransforms = {
      [Generators.Type.Track]: ([info, track, ...events]) => {
        const trackWithThinning = track
        const thinningQuery = Object.entries(thinningConfig).map(([id, value]) => ({
          id,
          value,
        }))
        trackWithThinning.query = [...(track.query || []), ...thinningQuery]
        return [trackWithThinning, info, ...events]
      },
    }
    return getDataviewsForResourceQuerying(dataviewInstances || [], datasetConfigsTransforms)
  }
)

export const selectDataviewsResourceQueries = createSelector(
  [selectDataviewsForResourceQuerying],
  (dataviews) => {
    return resolveResourcesFromDatasetConfigs(dataviews)
  }
)

export const selectDataviewInstancesByType = (type: Generators.Type) => {
  return createSelector([selectDataviewsForResourceQuerying], (dataviews) => {
    return dataviews?.filter((dataview) => dataview.config?.type === type)
  })
}

export const selectTrackDataviewInstances = createSelector([selectDataviewsForResourceQuerying], (dataviews) => {
  console.log('CCCCCCCCCCCCCCCCCC')
  return dataviews?.filter((dataview) => dataview.config?.type === Generators.Type.Track)
}
)


export const selectDataviewInstancesByCategory = (category: DataviewCategory) => {
  return createSelector([selectDataviewInstancesResolved], (dataviews) => {
    return dataviews?.filter((dataview) => dataview.category === category)
  })
}

export const selectDataviewInstancesByIds = (ids: string[]) => {
  return createSelector([selectDataviewInstancesResolved], (dataviews) => {
    return dataviews?.filter((dataview) => ids.includes(dataview.id))
  })
}

export const selectTrackDataviews = createSelector(
  [selectDataviewInstancesByType(Generators.Type.Track)],
  (dataviews) => dataviews
)

export const selectVesselsDataviews = createSelector([selectTrackDataviewInstances], (dataviews) => {
  return dataviews?.filter(
    (dataview) => !dataview.datasets || dataview.datasets?.[0]?.type !== DatasetTypes.UserTracks
  )
})

export const selectActiveVesselsDataviews = createSelector([selectVesselsDataviews], (dataviews) =>
  dataviews?.filter((d) => d.config?.visible)
)

export const selectActiveTrackDataviews = createSelector([selectTrackDataviewInstances], (dataviews) => {
  console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB')
  return dataviews?.filter((d) => d.config?.visible)
}
)
// export const selectEventsDataviews = createSelector(
//   [selectDataviewInstancesByCategory(DataviewCategory.Events)],
//   (dataviews) => dataviews
// )
