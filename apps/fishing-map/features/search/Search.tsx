import { useState, useEffect, useCallback, useRef } from 'react'
import { batch, useSelector } from 'react-redux'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { CSVLink } from 'react-csv'
import { Dataset, DatasetTypes } from '@globalfishingwatch/api-types'
import { Spinner, Button, IconButton } from '@globalfishingwatch/ui-components'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import { selectSearchOption, selectSearchQuery } from 'features/app/app.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { isGFWUser } from 'features/user/user.slice'
import VesselGroupAddButton from 'features/vessel-groups/VesselGroupAddButton'
import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
import {
  setVesselGroupConfirmationMode,
  setVesselGroupCurrentDataviewIds,
} from 'features/vessel-groups/vessel-groups.slice'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import SearchBasic from 'features/search/SearchBasic'
import SearchAdvanced from 'features/search/SearchAdvanced'
import SearchPlaceholder from 'features/search/SearchPlaceholders'
import { WORKSPACE } from 'routes/routes'
import I18nNumber from 'features/i18n/i18nNumber'
import {
  fetchVesselSearchThunk,
  cleanVesselSearchResults,
  RESULTS_PER_PAGE,
  setSuggestionClicked,
  SearchFilter,
  selectSearchPagination,
  selectSearchResults,
  selectSelectedVessels,
} from './search.slice'
import { useSearchConnect, useSearchFiltersConnect } from './search.hook'
import {
  selectBasicSearchDatasets,
  selectAdvancedSearchDatasets,
  isBasicSearchAllowed,
  isAdvancedSearchAllowed,
} from './search.selectors'
import styles from './Search.module.css'

const MIN_SEARCH_CHARACTERS = 3
const FIRST_FETCH_FILTERS_TO_IGNORE = ['lastTransmissionDate', 'firstTransmissionDate']

function Search() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const urlQuery = useSelector(selectSearchQuery)
  const { addNewDataviewInstances } = useDataviewInstancesConnect()
  const basicSearchAllowed = useSelector(isBasicSearchAllowed)
  const advancedSearchAllowed = useSelector(isAdvancedSearchAllowed)
  const [searchQuery, setSearchQuery] = useState((urlQuery || '') as string)
  const searchResults = useSelector(selectSearchResults)
  const { searchFilters } = useSearchFiltersConnect()
  const { searchPagination, searchSuggestion } = useSearchConnect()
  const debouncedQuery = useDebounce(searchQuery, 600)
  const { dispatchQueryParams, dispatchLocation } = useLocationConnect()
  const heatmapDataviews = useSelector(selectActiveHeatmapDataviews)
  const gfwUser = useSelector(isGFWUser)
  const activeSearchOption = useSelector(selectSearchOption)
  const searchResultsPagination = useSelector(selectSearchPagination)
  const vesselsSelected = useSelector(selectSelectedVessels)
  const hasFilters =
    Object.entries(searchFilters).filter(([key]) => {
      return !FIRST_FETCH_FILTERS_TO_IGNORE.includes(key) && searchFilters[key] !== undefined
    }).length > 0
  const searchDatasets = useSelector(
    activeSearchOption === 'basic' ? selectBasicSearchDatasets : selectAdvancedSearchDatasets
  )

  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const promiseRef = useRef<any>()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchResults = useCallback(
    debounce(
      ({
        query,
        datasets,
        filters,
        offset = 0,
      }: {
        query: string
        datasets: Dataset[]
        filters: SearchFilter
        offset?: number
      }) => {
        if (
          datasets?.length &&
          (activeSearchOption === 'advanced' || query?.length > MIN_SEARCH_CHARACTERS - 1)
        ) {
          const sourceIds = filters?.sources?.map((source) => source.id)
          const sources = sourceIds ? datasets.filter(({ id }) => sourceIds.includes(id)) : datasets
          if (promiseRef.current) {
            promiseRef.current.abort()
          }
          // To ensure the pending action isn't overwritted by the abort above
          // and we miss the loading intermediate state
          promiseRef.current = dispatch(
            fetchVesselSearchThunk({
              query,
              filters,
              datasets: sources,
              offset,
              gfwUser,
            })
          )
          // TODO: Find a better approach to sync query
          // and searchPagination.total to track the search in google analytics
          promiseRef.current.then((data: any) => {
            const total = data?.payload?.pagination?.total
            if (total >= 0) {
              trackEvent({
                category: TrackCategory.SearchVessel,
                action: 'Search specific vessel',
                label: query,
                value: total,
              })
            }
          })
        }
      },
      100
    ),
    [dispatch]
  )

  const fetchMoreResults = useCallback(() => {
    const { offset, total } = searchPagination
    if (offset && offset <= total && total > RESULTS_PER_PAGE && searchDatasets) {
      fetchResults({
        query: debouncedQuery,
        datasets: searchDatasets,
        filters: searchFilters,
        offset,
      })
    }
  }, [searchPagination, searchDatasets, fetchResults, debouncedQuery, searchFilters])

  useEffect(() => {
    if (
      searchDatasets?.length &&
      ((activeSearchOption === 'basic' && debouncedQuery) ||
        (activeSearchOption === 'advanced' && hasFilters))
    ) {
      fetchResults({
        query: debouncedQuery,
        datasets: searchDatasets,
        filters: activeSearchOption === 'advanced' ? searchFilters : {},
      })
    }
  }, [debouncedQuery, searchFilters, activeSearchOption, searchDatasets, fetchResults, hasFilters])

  useEffect(() => {
    if (debouncedQuery === '') {
      dispatch(cleanVesselSearchResults())
    }
    dispatchQueryParams({ query: debouncedQuery })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  const onSuggestionClick = () => {
    if (searchSuggestion) {
      dispatch(setSuggestionClicked(true))
      setSearchQuery(searchSuggestion)
    }
  }

  const onConfirmSelection = () => {
    const instances = vesselsSelected.map((vessel) => {
      const eventsRelatedDatasets = getRelatedDatasetsByType(vessel.dataset, DatasetTypes.Events)

      const eventsDatasetsId =
        eventsRelatedDatasets && eventsRelatedDatasets?.length
          ? eventsRelatedDatasets.map((d) => d.id)
          : []
      const vesselDataviewInstance = getVesselDataviewInstance(vessel, {
        trackDatasetId: vessel.trackDatasetId as string,
        infoDatasetId: vessel.dataset.id,
        ...(eventsDatasetsId.length > 0 && { eventsDatasetsId }),
      })
      return vesselDataviewInstance
    })
    addNewDataviewInstances(instances)
    batch(() => {
      dispatch(cleanVesselSearchResults())
      dispatchQueryParams({
        query: undefined,
        flag: undefined,
        sources: undefined,
        lastTransmissionDate: undefined,
        firstTransmissionDate: undefined,
        mmsi: undefined,
        imo: undefined,
        callsign: undefined,
        owner: undefined,
        codMarinha: undefined,
        geartype: undefined,
        targetSpecies: undefined,
        fleet: undefined,
        origin: undefined,
      })
    })
    dispatchLocation(WORKSPACE)
  }

  const onAddToVesselGroup = () => {
    const dataviewIds = heatmapDataviews.map(({ id }) => id)
    batch(() => {
      dispatch(setVesselGroupConfirmationMode('saveAndNavigate'))
      if (dataviewIds?.length) {
        dispatch(setVesselGroupCurrentDataviewIds(dataviewIds))
      }
    })
  }

  const onConfirmSearch = useCallback(() => {
    fetchResults({
      query: debouncedQuery,
      datasets: searchDatasets,
      filters: searchFilters,
    })
  }, [debouncedQuery, fetchResults, searchDatasets, searchFilters])

  if (workspaceStatus !== AsyncReducerStatus.Finished) {
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
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        debouncedQuery={debouncedQuery}
        fetchMoreResults={fetchMoreResults}
        onConfirm={onConfirmSearch}
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
        {activeSearchOption === 'advanced' && searchResults && (
          <CSVLink
            filename={`search-results-${debouncedQuery}.csv`}
            asyncOnClick={true}
            data={vesselsSelected.length ? vesselsSelected : searchResults}
          >
            <IconButton
              icon="download"
              type="border"
              size="medium"
              tooltip={
                vesselsSelected.length
                  ? `${t('search.downloadSelected', 'Download CSV of selected vessels')} (${
                      vesselsSelected.length
                    })`
                  : `${t('search.downloadTable', 'Download CSV of vessels on table')} (${
                      searchResults.length
                    })`
              }
              tooltipPlacement="top"
            />
          </CSVLink>
        )}
        <VesselGroupAddButton
          vessels={vesselsSelected}
          onAddToVesselGroup={onAddToVesselGroup}
          showCount={false}
          buttonClassName={cx(styles.footerAction, styles.vesselGroupButton)}
        />
        <Button
          className={styles.footerAction}
          onClick={onConfirmSelection}
          disabled={vesselsSelected.length === 0}
        >
          {vesselsSelected.length > 1
            ? t('search.seeVessels', {
                defaultValue: 'See vessels',
                count: vesselsSelected.length,
              })
            : t('search.seeVessel', 'See vessel')}
        </Button>
      </div>
    </div>
  )
}

export default Search
