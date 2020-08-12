import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { Dataview } from '@globalfishingwatch/dataviews-client/dist/types'
import {
  selectAllDataviews,
  fetchDataviewsThunk,
  createDataviewThunk,
  deleteDataviewThunk,
  DataviewDraft,
  setDraftDataview as setDraftDataviewAction,
  selectDraftDataview,
} from './dataviews.slice'

export const useDraftDataviewConnect = () => {
  const dispatch = useDispatch()
  const draftDataview = useSelector(selectDraftDataview)
  const setDraftDataview = useCallback(
    (draftDataview: Partial<DataviewDraft>) => {
      dispatch(setDraftDataviewAction(draftDataview))
    },
    [dispatch]
  )
  return { draftDataview, setDraftDataview }
}

export const useDataviewsConnect = () => {
  const dispatch = useDispatch()
  const dataviewsList = useSelector(selectAllDataviews)
  const fetchDataviews = useCallback(() => {
    dispatch(fetchDataviewsThunk())
  }, [dispatch])
  const createDataview = useCallback(
    async (dataview: DataviewDraft): Promise<Dataview> => {
      const { payload }: any = await dispatch(createDataviewThunk(dataview))
      return payload
    },
    [dispatch]
  )
  const deleteDataview = useCallback(
    (id: number) => {
      dispatch(deleteDataviewThunk(id))
    },
    [dispatch]
  )
  return { dataviewsList, fetchDataviews, createDataview, deleteDataview }
}
