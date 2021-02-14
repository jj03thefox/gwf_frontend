// import { bindActionCreators } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { Dataset } from '@globalfishingwatch/api-types/dist'
import { AsyncError } from 'utils/async-slice'
import {
  selectContextAreasDataviews,
  selectEnvironmentalDataviews,
} from 'features/workspace/workspace.selectors'
import {
  getContextDataviewInstance,
  getEnvironmentalDataviewInstance,
} from 'features/dataviews/dataviews.utils'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import {
  CreateDataset,
  createDatasetThunk,
  DatasetModals,
  deleteDatasetThunk,
  fetchDatasetByIdThunk,
  selectDatasetModal,
  selectEditingDatasetId,
  setDatasetModal,
  setEditingDatasetId,
  updateDatasetThunk,
} from './datasets.slice'

export const useNewDatasetConnect = () => {
  const contextDataviews = useSelector(selectContextAreasDataviews)
  const enviromentalDataviews = useSelector(selectEnvironmentalDataviews)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const addNewDatasetToWorkspace = useCallback(
    (dataset: Dataset) => {
      let dataviewInstance
      const layerType =
        dataset.configuration?.propertyToInclude && dataset.configuration?.propertyToIncludeRange
          ? 'enviromental'
          : 'context'

      if (layerType === 'context') {
        const usedColors = contextDataviews?.flatMap((dataview) => dataview.config?.color || [])
        dataviewInstance = getContextDataviewInstance(dataset.id, usedColors)
      } else {
        const usedRamps = enviromentalDataviews?.flatMap((dataview) => dataview.config?.color || [])
        dataviewInstance = getEnvironmentalDataviewInstance(dataset.id, usedRamps)
      }
      if (dataviewInstance) {
        upsertDataviewInstance(dataviewInstance)
      }
    },
    [contextDataviews, enviromentalDataviews, upsertDataviewInstance]
  )

  return { addNewDatasetToWorkspace }
}

export const useDatasetModalConnect = () => {
  const dispatch = useDispatch()
  const datasetModal = useSelector(selectDatasetModal)
  const editingDatasetId = useSelector(selectEditingDatasetId)

  const dispatchDatasetModal = useCallback(
    (datasetModal: DatasetModals) => {
      dispatch(setDatasetModal(datasetModal))
    },
    [dispatch]
  )
  const dispatchEditingDatasetId = useCallback(
    (id: string) => {
      dispatch(setEditingDatasetId(id))
    },
    [dispatch]
  )

  return {
    datasetModal,
    dispatchDatasetModal,
    editingDatasetId,
    dispatchEditingDatasetId,
  }
}

export const useDatasetsAPI = () => {
  const dispatch = useDispatch()

  const dispatchFetchDataset = useCallback(
    async (id: string): Promise<{ payload?: Dataset; error?: AsyncError }> => {
      const { payload, error }: any = await dispatch(fetchDatasetByIdThunk(id))
      if (error) {
        return { error: payload }
      }
      return { payload }
    },
    [dispatch]
  )

  const dispatchCreateDataset = useCallback(
    async (createDataset: CreateDataset): Promise<{ payload?: Dataset; error?: AsyncError }> => {
      const { payload, error }: any = await dispatch(createDatasetThunk(createDataset))
      if (error) {
        return { error: payload }
      }
      return { payload }
    },
    [dispatch]
  )

  const dispatchUpdateDataset = useCallback(
    async (
      updatedDataset: Partial<Dataset>
    ): Promise<{ payload?: Dataset; error?: AsyncError }> => {
      const { payload, error }: any = await dispatch(updateDatasetThunk(updatedDataset))
      if (error) {
        return { error: payload }
      }
      return { payload }
    },
    [dispatch]
  )

  const dispatchDeleteDataset = useCallback(
    (id: string) => {
      dispatch(deleteDatasetThunk(id))
    },
    [dispatch]
  )

  return {
    dispatchFetchDataset,
    dispatchCreateDataset,
    dispatchUpdateDataset,
    dispatchDeleteDataset,
  }
}
