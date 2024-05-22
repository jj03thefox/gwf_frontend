import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { DataviewInstance } from '@globalfishingwatch/api-types'
import {
  useDeckLayerComposer,
  useDeckLayerLoadedState,
} from '@globalfishingwatch/deck-layer-composer'
import { useGlobalConfigConnect } from 'features/map/map.hooks'
import { selectDataviewInstancesResolvedVisible } from 'features/dataviews/selectors/dataviews.selectors'
import { selectIsMarineManagerLocation } from 'routes/routes.selectors'
import { DEFAULT_BASEMAP_DATAVIEW_INSTANCE } from 'data/workspaces'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  selectMapReportBufferDataviews,
  selectShowWorkspaceDetail,
  selectWorkspacesListDataview,
} from './map.selectors'

export const useMapDeckLayers = () => {
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const workspaceDataviews = useSelector(selectDataviewInstancesResolvedVisible)
  const bufferDataviews = useSelector(selectMapReportBufferDataviews)
  const workspacesListDataview = useSelector(selectWorkspacesListDataview)
  const isMarineManagerLocation = useSelector(selectIsMarineManagerLocation)
  const showWorkspaceDetail = useSelector(selectShowWorkspaceDetail)
  const workspaceLoading =
    showWorkspaceDetail &&
    (workspaceStatus === AsyncReducerStatus.Idle || workspaceStatus === AsyncReducerStatus.Loading)
  const globalConfig = useGlobalConfigConnect()

  const dataviews = useMemo(() => {
    if (isMarineManagerLocation) {
      const marineManagerDataviews = [DEFAULT_BASEMAP_DATAVIEW_INSTANCE]
      if (workspacesListDataview) {
        marineManagerDataviews.push(workspacesListDataview as DataviewInstance)
      }
      return marineManagerDataviews
    }
    if (workspaceLoading) {
      return [DEFAULT_BASEMAP_DATAVIEW_INSTANCE]
    }
    return [...(workspaceDataviews || []), ...(bufferDataviews || [])]
  }, [
    bufferDataviews,
    isMarineManagerLocation,
    workspaceDataviews,
    workspaceLoading,
    workspacesListDataview,
  ])

  const { layers } = useDeckLayerComposer({
    dataviews: dataviews as DataviewInstance[],
    globalConfig,
  })

  return layers
}

export const useMapLayersLoaded = () => {
  const layerStatus = useDeckLayerLoadedState()
  return Object.values(layerStatus).every((l) => l.loaded)
}
