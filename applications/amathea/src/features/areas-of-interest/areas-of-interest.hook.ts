import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { selectAllAOI, fetchAOIThunk } from './areas-of-interest.slice'
import { getCurrentAOI } from './areas-of-interest.selectors'

export const useAOIConnect = () => {
  const aoiList = useSelector(selectAllAOI)
  const currentAOI = useSelector(getCurrentAOI)
  return { aoiList, currentAOI }
}

export const useAOIAPI = () => {
  const dispatch = useDispatch()
  const fetchAOI = useCallback(() => {
    dispatch(fetchAOIThunk())
  }, [dispatch])
  return { fetchAOI }
}
