import { useCallback } from 'react'
import { Dataset, DatasetTypes } from '@globalfishingwatch/api-types'
import { getRelatedDatasetByType, getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'

export type VesselDataviewInstanceParams = { id: string; dataset: Dataset }

const useAddVesselDataviewInstance = () => {
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const addVesselDataviewInstance = useCallback(
    (vessel: VesselDataviewInstanceParams) => {
      const vesselTrackDataset = getRelatedDatasetByType(vessel.dataset, DatasetTypes.Tracks)
      const vesselEventsDatasets = getRelatedDatasetsByType(vessel.dataset, DatasetTypes.Events)
      const eventsDatasetsId =
        vesselEventsDatasets && vesselEventsDatasets?.length
          ? vesselEventsDatasets.map((d) => d.id)
          : []

      const vesselDataviewInstance = getVesselDataviewInstance(vessel, {
        info: vessel.dataset.id,
        track: vesselTrackDataset?.id,
        ...(eventsDatasetsId.length > 0 && { events: eventsDatasetsId }),
      })
      upsertDataviewInstance(vesselDataviewInstance)
    },
    [upsertDataviewInstance]
  )

  return addVesselDataviewInstance
}

export default useAddVesselDataviewInstance
