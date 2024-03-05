import { useEffect, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { Dataset } from '@globalfishingwatch/api-types'
import { Spinner } from '@globalfishingwatch/ui-components'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import { isAuthError } from '@globalfishingwatch/api-client'
import { useLocationConnect } from 'routes/routes.hook'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import SearchBasic from 'features/search/basic/SearchBasic'
import SearchAdvanced from 'features/search/advanced/SearchAdvanced'
import SearchPlaceholder, { SearchNotAllowed } from 'features/search/SearchPlaceholders'
import I18nNumber from 'features/i18n/i18nNumber'
import { selectWorkspaceId } from 'routes/routes.selectors'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import { selectDatasetsError, selectDatasetsStatus } from 'features/datasets/datasets.slice'
import { WorkspaceLoginError } from 'features/workspace/WorkspaceError'
import { selectSearchOption, selectSearchQuery } from 'features/search/search.config.selectors'
import SearchDownload from 'features/search/SearchDownload'
import SearchActions from 'features/search/SearchActions'
import {
  useFetchSearchResults,
  useSearchConnect,
  useSearchFiltersConnect,
  useSearchFiltersErrors,
} from 'features/search/search.hook'
import {
  cleanVesselSearchResults,
  setSuggestionClicked,
  selectSearchPagination,
  selectSearchResults,
  selectSelectedVessels,
} from 'features/search/search.slice'
import {
  selectBasicSearchDatasets,
  selectAdvancedSearchDatasets,
  isBasicSearchAllowed,
  isAdvancedSearchAllowed,
} from 'features/search/search.selectors'
import { VesselSearchState } from 'types'
import styles from './Search.module.css'

function Search() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const urlWorkspaceId = useSelector(selectWorkspaceId)
  const searchQuery = useSelector(selectSearchQuery)
  const basicSearchAllowed = useSelector(isBasicSearchAllowed)
  const advancedSearchAllowed = useSelector(isAdvancedSearchAllowed)
  const searchResults = useSelector(selectSearchResults)
  const { hasFilters, searchFilters } = useSearchFiltersConnect()
  const { searchSuggestion } = useSearchConnect()
  const debouncedQuery = useDebounce(searchQuery, 600)
  const { dispatchQueryParams } = useLocationConnect()
  const activeSearchOption = useSelector(selectSearchOption)
  const searchResultsPagination = useSelector(selectSearchPagination)
  const vesselsSelected = useSelector(selectSelectedVessels)
  const searchDatasets = useSelector(
    activeSearchOption === 'basic' ? selectBasicSearchDatasets : selectAdvancedSearchDatasets
  ) as Dataset[]
  const [vesselsSelectedDownload, setVesselsSelectedDownload] = useState([])

  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const datasetsStatus = useSelector(selectDatasetsStatus)
  const guestUser = useSelector(selectIsGuestUser)
  const datasetError = useSelector(selectDatasetsError)
  const searchFilterErrors = useSearchFiltersErrors()
  const hasSearchFiltersErrors = Object.values(searchFilterErrors).some((error) => error)
  const { fetchResults, fetchMoreResults } = useFetchSearchResults()

  useEffect(() => {
    dispatch(fetchWorkspaceThunk(urlWorkspaceId))
  }, [dispatch, urlWorkspaceId])

  useEffect(() => {
    if (
      searchDatasets?.length &&
      activeSearchOption === 'basic' &&
      debouncedQuery &&
      !hasSearchFiltersErrors
    ) {
      dispatch(cleanVesselSearchResults())
      fetchResults({
        query: debouncedQuery,
        datasets: searchDatasets,
        filters: {},
      })
    }
  }, [
    debouncedQuery,
    searchFilters,
    activeSearchOption,
    searchDatasets,
    fetchResults,
    hasFilters,
    dispatch,
    hasSearchFiltersErrors,
  ])

  useEffect(() => {
    if (
      activeSearchOption === 'advanced' &&
      (hasFilters || debouncedQuery) &&
      !hasSearchFiltersErrors
    ) {
      fetchResults({
        query: searchQuery,
        datasets: searchDatasets,
        filters: searchFilters,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDatasets])

  useEffect(() => {
    if (debouncedQuery === '') {
      dispatch(cleanVesselSearchResults())
    }
    dispatchQueryParams({ query: debouncedQuery })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  useEffect(() => {
    // State cleanup needed to avoid sluggist renders when there are lots of vessels
    if (vesselsSelectedDownload.length) {
      setVesselsSelectedDownload([])
    }
  }, [vesselsSelectedDownload.length])

  const onSuggestionClick = () => {
    if (searchSuggestion) {
      dispatch(setSuggestionClicked(true))
      dispatchQueryParams({ query: searchSuggestion })
    }
  }

  const onConfirmSearch = useCallback(
    (
      { query = debouncedQuery, filters = searchFilters } = {} as {
        query?: string
        filters?: VesselSearchState
      }
    ) => {
      if (!hasSearchFiltersErrors) {
        dispatch(cleanVesselSearchResults())
        fetchResults({
          query,
          filters,
          datasets: searchDatasets,
        })
      }
    },
    [debouncedQuery, dispatch, fetchResults, hasSearchFiltersErrors, searchDatasets, searchFilters]
  )

  const isWorkspaceError = workspaceStatus === AsyncReducerStatus.Error
  const isDatasetError = datasetsStatus === AsyncReducerStatus.Error

  if (isWorkspaceError || isDatasetError) {
    return isAuthError(datasetError) ? (
      <WorkspaceLoginError
        title={
          guestUser
            ? t('errors.searchLogin', 'Login to search vessels')
            : t(
                'errors.privateSearch',
                "Your account doesn't have permissions to search on these datasets"
              )
        }
        emailSubject={`Requesting access for searching vessels`}
      />
    ) : (
      <SearchNotAllowed />
    )
  }

  const showWorkspaceSpinner = workspaceStatus !== AsyncReducerStatus.Finished
  const showDatasetsSpinner = datasetsStatus !== AsyncReducerStatus.Finished

  if (showWorkspaceSpinner || showDatasetsSpinner) {
    return (
      <SearchPlaceholder>
        <Spinner />
      </SearchPlaceholder>
    )
  }

  const SearchComponent = activeSearchOption === 'basic' ? SearchBasic : SearchAdvanced

  return (
    <div className={styles.search}>
      <SearchComponent
        onSuggestionClick={onSuggestionClick}
        fetchMoreResults={fetchMoreResults}
        fetchResults={onConfirmSearch}
        debouncedQuery={debouncedQuery}
      />
      <div
        className={cx(styles.footer, styles[activeSearchOption], {
          [styles.hidden]:
            !searchResultsPagination ||
            searchResultsPagination.total === 0 ||
            (activeSearchOption === 'basic' && !basicSearchAllowed) ||
            (activeSearchOption === 'advanced' && !advancedSearchAllowed),
        })}
      >
        {searchResults && searchResults.length !== 0 && (
          <label className={styles.results}>
            {`${t('search.seeing', 'seeing')} `}
            <I18nNumber number={searchResults.length} />
            {` ${t('common.of', 'of')} `}
            <I18nNumber number={searchResultsPagination.total} />
            {` ${t('search.result_other', 'results')} ${
              vesselsSelected.length !== 0
                ? `(${vesselsSelected.length} ${t('selects.selected', 'selected')})`
                : ''
            }`}
          </label>
        )}
        {activeSearchOption === 'advanced' && <SearchDownload />}
        <SearchActions />
      </div>
    </div>
  )
}

export default Search
