import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import {
  SearchFilter,
  selectSearchFilters,
  selectSearchFiltersOpen,
  setFilters,
  setFiltersOpen,
} from './search.slice'

export const useSearchFiltersConnect = () => {
  const searchFiltersOpen = useSelector(selectSearchFiltersOpen)
  const searchFilters = useSelector(selectSearchFilters)
  const hasSearchFilters = Object.values(searchFilters).length > 0
  const dispatch = useDispatch()

  const setSearchFiltersOpen = useCallback(
    (open: boolean) => {
      dispatch(setFiltersOpen(open))
    },
    [dispatch]
  )

  const setSearchFilters = useCallback(
    (filter: SearchFilter) => {
      dispatch(setFilters(filter))
    },
    [dispatch]
  )

  return {
    searchFilters,
    searchFiltersOpen,
    hasSearchFilters,
    setSearchFiltersOpen,
    setSearchFilters,
  }
}
