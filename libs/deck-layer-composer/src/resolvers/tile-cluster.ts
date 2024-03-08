import { DatasetTypes, DataviewInstance } from '@globalfishingwatch/api-types'
import { resolveDataviewDatasetResource } from '@globalfishingwatch/dataviews-client'

type TileClusterDeckLayerProps = any

export function resolveDeckTileClusterLayerProps(
  dataview: DataviewInstance
): TileClusterDeckLayerProps {
  const { dataset: tileClusterDataset, url: tileClusterUrl } = resolveDataviewDatasetResource(
    dataview,
    DatasetTypes.Events
  )

  if (!tileClusterDataset || !tileClusterUrl) {
    console.warn('No dataset config for TileCluster generator', dataview)
    return []
  }
  return {
    id: dataview.id,
    tilesUrl: tileClusterUrl,
    // ...(highlightedEvent && { currentEventId: highlightedEvent.id }),
    // ...(highlightedEvents && { currentEventId: highlightedEvents[0] }),
  }
}
