import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { MultiSelectOption } from '@globalfishingwatch/ui-components'
import { VesselGroup } from '@globalfishingwatch/api-types'
import { selectAllVisibleVesselGroups } from 'features/user/selectors/user.permissions.selectors'
import { getVesselGroupLabel } from 'features/vessel-groups/vessel-groups.utils'
import { IdentityVesselData } from 'features/vessel/vessel.slice'
import { getCurrentIdentityVessel } from 'features/vessel/vessel.utils'
import { VesselLastIdentity } from 'features/search/search.slice'
import { ReportVesselWithDatasets } from 'features/area-report/reports.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectVesselGroupsStatusId,
  setNewVesselGroupSearchVessels,
  setVesselGroupEditId,
  setVesselGroupsModalOpen,
  UpdateVesselGroupThunkParams,
  updateVesselGroupVesselsThunk,
} from './vessel-groups.slice'
import { NEW_VESSEL_GROUP_ID } from './VesselGroupListTooltip'

export type AddVesselGroupVessel =
  | VesselLastIdentity
  | ReportVesselWithDatasets
  | IdentityVesselData

export const useVesselGroupsOptions = () => {
  const { t } = useTranslation()
  const vesselGroups = useSelector(selectAllVisibleVesselGroups)
  const vesselGroupsStatusId = useSelector(selectVesselGroupsStatusId)

  return useMemo(() => {
    const vesselGroupsOptions: (MultiSelectOption & { loading?: boolean })[] = vesselGroups.map(
      (vesselGroup) => ({
        id: vesselGroup.id.toString(),
        label: t('vesselGroup.label', `{{name}} ({{count}} IDs)`, {
          name: getVesselGroupLabel(vesselGroup),
          count: vesselGroup.vessels.length,
        }),
        loading: vesselGroup.id === vesselGroupsStatusId,
      })
    )
    return vesselGroupsOptions
  }, [t, vesselGroups, vesselGroupsStatusId])
}

export const useVesselGroupsUpdate = () => {
  const dispatch = useAppDispatch()
  const addVesselsToVesselGroup = useCallback(
    async (vesselGroupId: string, vessels: AddVesselGroupVessel[]) => {
      const vesselGroup: UpdateVesselGroupThunkParams = {
        id: vesselGroupId,
        vessels: vessels.flatMap((vessel) => {
          const { id, dataset } = getCurrentIdentityVessel(vessel as IdentityVesselData)
          if (!id || !dataset) {
            return []
          }
          return {
            vesselId: id,
            dataset: typeof dataset === 'string' ? dataset : dataset.id,
          }
        }),
      }
      const dispatchedAction = await dispatch(updateVesselGroupVesselsThunk(vesselGroup))
      if (updateVesselGroupVesselsThunk.fulfilled.match(dispatchedAction)) {
        return dispatchedAction.payload?.payload as VesselGroup
      } else {
        return undefined
      }
    },
    [dispatch]
  )

  return addVesselsToVesselGroup
}

export const useVesselGroupsModal = () => {
  const dispatch = useAppDispatch()
  const createVesselGroupWithVessels = useCallback(
    async (vesselGroupId: string, vessels: AddVesselGroupVessel[]) => {
      const vesselsWithDataset = vessels.map((vessel) => ({
        ...vessel,
        id: (vessel as VesselLastIdentity)?.id || (vessel as ReportVesselWithDatasets)?.vesselId,
        dataset:
          typeof vessel?.dataset === 'string'
            ? vessel.dataset
            : vessel.dataset?.id || (vessel as ReportVesselWithDatasets)?.infoDataset?.id,
      }))
      if (vesselsWithDataset?.length) {
        if (vesselGroupId && vesselGroupId !== NEW_VESSEL_GROUP_ID) {
          dispatch(setVesselGroupEditId(vesselGroupId))
        }
        dispatch(setNewVesselGroupSearchVessels(vesselsWithDataset))
        dispatch(setVesselGroupsModalOpen(true))
      } else {
        console.warn('No related activity datasets founds for', vesselsWithDataset)
      }
    },
    [dispatch]
  )

  return createVesselGroupWithVessels
}
