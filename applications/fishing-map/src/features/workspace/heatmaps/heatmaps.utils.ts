import { DatasetTypes, DataviewCategory } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { DEFAULT_FISHING_DATAVIEW_ID, DEFAULT_PRESENCE_DATAVIEW_ID } from 'data/workspaces'

export const isFishingDataview = (dataview: UrlDataviewInstance) =>
  dataview.dataviewId === DEFAULT_FISHING_DATAVIEW_ID

export const isPresenceDataview = (dataview: UrlDataviewInstance) =>
  dataview.dataviewId === DEFAULT_PRESENCE_DATAVIEW_ID

export const isActivityDataview = (dataview: UrlDataviewInstance) =>
  isFishingDataview(dataview) ||
  isPresenceDataview(dataview) ||
  dataview.category === DataviewCategory.Fishing ||
  dataview.category === DataviewCategory.Presence

export const getSourcesOptionsInDataview = (
  dataview: UrlDataviewInstance,
  datasetType = DatasetTypes.Fourwings
) => {
  const datasets = dataview?.datasets?.filter((d) => d.type === datasetType)
  const sourceOptions = datasets?.map((d) => ({ id: d.id, label: d.name })) || []
  return sourceOptions.sort((a, b) => a.label.localeCompare(b.label))
}

export const getSourcesSelectedInDataview = (
  dataview: UrlDataviewInstance,
  datasetType = DatasetTypes.Fourwings
) => {
  const sourceOptions = getSourcesOptionsInDataview(dataview, datasetType)
  const sourcesSelected = sourceOptions.filter((sourceOption) =>
    dataview.config?.datasets?.includes(sourceOption.id)
  )
  return sourcesSelected
}
