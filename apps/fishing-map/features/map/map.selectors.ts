import { createSelector } from '@reduxjs/toolkit'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import { selectCurrentWorkspacesList } from 'features/workspaces-list/workspaces-list.selectors'
import {
  selectIsAnyAreaReportLocation,
  selectIsWorkspaceLocation,
  selectIsWorkspaceVesselLocation,
  selectMapDrawingEditId,
} from 'routes/routes.selectors'
import {
  selectReportPreviewBufferFeature,
  selectReportBufferFeature,
} from 'features/reports/areas/area-reports.selectors'
import { WorkspaceCategory } from 'data/workspaces'
import { BUFFER_PREVIEW_COLOR } from 'data/config'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import {
  PREVIEW_BUFFER_GENERATOR_ID,
  REPORT_BUFFER_GENERATOR_ID,
  WORKSPACES_POINTS_TYPE,
  WORKSPACE_GENERATOR_ID,
} from './map.config'

const EMPTY_ARRAY: [] = []

const selectWorkspacesListFeatures = createSelector([selectCurrentWorkspacesList], (workspaces) => {
  if (!workspaces?.length) return []
  return workspaces.flatMap((workspace) => {
    if (!workspace.viewport) {
      return EMPTY_ARRAY
    }

    const { latitude, longitude, zoom } = workspace.viewport
    return {
      type: 'Feature',
      properties: {
        id: workspace.id,
        label: workspace.name,
        type: WORKSPACES_POINTS_TYPE,
        category: workspace.category || WorkspaceCategory.FishingActivity,
        viewAccess: workspace.viewAccess,
        latitude,
        longitude,
        zoom,
      },
      geometry: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    }
  })
})
export const selectWorkspacesListDataview = createSelector(
  [selectWorkspacesListFeatures],
  (workspaceListFeatures) => {
    if (!workspaceListFeatures?.length) return
    const dataview: UrlDataviewInstance<DataviewType> = {
      id: WORKSPACE_GENERATOR_ID,
      category: DataviewCategory.Workspaces,
      config: {
        type: DataviewType.Workspaces,
        color: '#ffffff',
        data: {
          type: 'FeatureCollection',
          features: workspaceListFeatures,
        },
      },
    }

    return dataview
  }
)

export const selectShowWorkspaceDetail = createSelector(
  [selectIsWorkspaceLocation, selectIsAnyAreaReportLocation, selectIsWorkspaceVesselLocation],
  (isWorkspacelLocation, isAreaReportLocation, isVesselLocation) => {
    return isWorkspacelLocation || isAreaReportLocation || isVesselLocation
  }
)

export const selectMapReportBufferDataviews = createSelector(
  [selectReportBufferFeature, selectReportPreviewBufferFeature],
  (reportBufferFeature, reportPreviewBufferFeature) => {
    const dataviews = [] as UrlDataviewInstance<DataviewType>[]
    if (reportBufferFeature?.geometry) {
      dataviews.push({
        id: REPORT_BUFFER_GENERATOR_ID,
        category: DataviewCategory.Buffer,
        config: {
          type: DataviewType.Polygons,
          data: { type: 'FeatureCollection', features: [reportBufferFeature] },
          color: '#ffffff',
          visible: true,
        },
      })
    }
    if (reportPreviewBufferFeature?.geometry) {
      dataviews.push({
        id: PREVIEW_BUFFER_GENERATOR_ID,
        category: DataviewCategory.Buffer,
        config: {
          type: DataviewType.Polygons,
          data: { type: 'FeatureCollection', features: [reportPreviewBufferFeature] },
          color: BUFFER_PREVIEW_COLOR,
          visible: true,
        },
      })
    }
    return dataviews
  }
)

export const selectDrawEditDataset = createSelector(
  [selectAllDatasets, selectMapDrawingEditId],
  (datasets, datasetId) => {
    return datasets.find((dataset) => dataset.id === datasetId)
  }
)
