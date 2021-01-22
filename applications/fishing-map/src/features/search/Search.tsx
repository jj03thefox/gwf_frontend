import React, { useState, useEffect, useCallback, useRef, Fragment } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import { useIntersectionObserver } from '@researchgate/react-intersection-observer'
import cx from 'classnames'
import Downshift from 'downshift'
import { useTranslation } from 'react-i18next'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import useDebounce from '@globalfishingwatch/react-hooks/dist/use-debounce'
import { useLocationConnect } from 'routes/routes.hook'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { selectSearchQuery } from 'features/app/app.selectors'
import I18nDate from 'features/i18n/i18nDate'
import { resetWorkspaceSearchQuery } from 'features/workspace/workspace.slice'
import { AsyncReducerStatus } from 'types'
import { getFlagById } from 'utils/flags'
import { formatInfoField } from 'utils/info'
import {
  fetchVesselSearchThunk,
  selectSearchResults,
  cleanVesselSearchResults,
  selectSearchStatus,
  VesselWithDatasets,
  RESULTS_PER_PAGE,
  checkSearchFiltersEnabled,
  resetFilters,
} from './search.slice'
import styles from './Search.module.css'
import SearchFilters from './SearchFilters'
import { useSearchConnect, useSearchFiltersConnect } from './search.hook'
import SearchPlaceholder, {
  SearchNotAllowed,
  SearchNoResultsState,
  SearchEmptyState,
} from './SearchPlaceholders'
import { isSearchAllowed, selectAllowedVesselsDatasets } from './search.selectors'

function Search() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const urlQuery = useSelector(selectSearchQuery)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const [searchQuery, setSearchQuery] = useState((urlQuery || '') as string)
  const { searchFilters, searchFiltersOpen, setSearchFiltersOpen } = useSearchFiltersConnect()
  const { searchPagination, searchSuggestion } = useSearchConnect()
  const debouncedQuery = useDebounce(searchQuery, 600)
  const { dispatchQueryParams } = useLocationConnect()
  const searchDatasets = useSelector(selectAllowedVesselsDatasets)
  const searchAllowed = useSelector(isSearchAllowed)
  const searchResults = useSelector(selectSearchResults)
  const searchStatus = useSelector(selectSearchStatus)
  const hasSearchFilters = checkSearchFiltersEnabled(searchFilters)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const promiseRef = useRef<any>()

  const fetchResults = useCallback(
    (offset = 0) => {
      if (searchDatasets?.length) {
        const sourceIds = searchFilters?.sources?.map((source) => source.id)
        const sources = sourceIds
          ? searchDatasets.filter(({ id }) => sourceIds.includes(id))
          : searchDatasets

        if (promiseRef.current) {
          promiseRef.current.abort()
        }

        promiseRef.current = dispatch(
          fetchVesselSearchThunk({
            query: debouncedQuery,
            filters: searchFilters,
            datasets: sources,
            offset,
          })
        )
      }
    },
    [debouncedQuery, dispatch, searchDatasets, searchFilters]
  )

  const handleIntersection = useCallback(
    (entry: IntersectionObserverEntry) => {
      const { offset, total } = searchPagination
      if (entry.isIntersecting) {
        if (offset <= total && total > RESULTS_PER_PAGE) {
          fetchResults(offset + RESULTS_PER_PAGE)
        }
      }
    },
    [fetchResults, searchPagination]
  )
  const [ref] = useIntersectionObserver(handleIntersection, { rootMargin: '100px' })

  useEffect(() => {
    if (debouncedQuery === '') {
      batch(() => {
        dispatch(cleanVesselSearchResults())
        dispatch(resetWorkspaceSearchQuery())
      })
    } else {
      fetchResults()
    }
    dispatchQueryParams({ query: debouncedQuery })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, searchFilters, searchDatasets])

  const onCloseClick = () => {
    batch(() => {
      dispatch(resetFilters())
      dispatch(cleanVesselSearchResults())
      dispatch(resetWorkspaceSearchQuery())
      dispatchQueryParams({ query: undefined })
    })
  }

  const onSuggestionClick = () => {
    if (searchSuggestion) {
      setSearchQuery(searchSuggestion)
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const onSelectionChange = (selection: VesselWithDatasets | null) => {
    if (selection && selection.dataset && selection.trackDatasetId) {
      const vesselDataviewInstance = getVesselDataviewInstance(selection, {
        trackDatasetId: selection.trackDatasetId as string,
        infoDatasetId: selection.dataset.id,
      })
      batch(() => {
        upsertDataviewInstance(vesselDataviewInstance)
        onCloseClick()
      })
    }
  }

  if (workspaceStatus !== AsyncReducerStatus.Finished) {
    return (
      <SearchPlaceholder>
        <Spinner />
      </SearchPlaceholder>
    )
  }

  return (
    <Downshift onChange={onSelectionChange} itemToString={(item) => (item ? item.shipname : '')}>
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex, selectedItem }) => (
        <div className={cx(styles.search, { [styles.expandedContainerOpen]: searchFiltersOpen })}>
          <div className={styles.inputContainer}>
            <InputText
              {...getInputProps()}
              onChange={onInputChange}
              value={searchQuery}
              autoFocus
              disabled={!searchAllowed}
              className={styles.input}
              placeholder={t('search.placeholder', 'Type to search vessels')}
            />
            {searchStatus === 'loading' && <Spinner className={styles.textSpinner} size="small" />}
            {searchAllowed && (
              <IconButton
                icon={searchFiltersOpen ? 'close' : hasSearchFilters ? 'filter-on' : 'filter-off'}
                tooltip={
                  searchFiltersOpen
                    ? t('search.filterClose', 'Close search filters')
                    : t('search.filterOpen', 'Open search filters')
                }
                className={cx(styles.expandable, {
                  [styles.expanded]: searchFiltersOpen,
                })}
                onClick={() => setSearchFiltersOpen(!searchFiltersOpen)}
                tooltipPlacement="bottom"
              />
            )}
            {searchFiltersOpen === false && (
              <IconButton
                icon="close"
                onClick={onCloseClick}
                type="border"
                tooltip={t('search.close', 'Close search')}
                tooltipPlacement="bottom"
              />
            )}
          </div>
          {searchAllowed ? (
            <Fragment>
              <SearchFilters className={cx(styles.expandedContainer)} />
              {!searchResults?.length &&
                (searchStatus === AsyncReducerStatus.Finished ? (
                  <SearchNoResultsState />
                ) : searchStatus === AsyncReducerStatus.Idle ? (
                  <SearchEmptyState />
                ) : searchStatus === AsyncReducerStatus.Error ? (
                  <p className={styles.error}>Something went wrong 🙈</p>
                ) : null)}
              {((searchResults && searchResults.length > 0) || searchSuggestion) && (
                <ul {...getMenuProps()} className={styles.searchResults}>
                  {searchSuggestion && searchSuggestion !== searchQuery && (
                    <li className={cx(styles.searchSuggestion)}>
                      {t('search.suggestion', 'Did you mean')}{' '}
                      <button onClick={onSuggestionClick} className={styles.suggestion}>
                        {' '}
                        {searchSuggestion}{' '}
                      </button>{' '}
                      ?
                    </li>
                  )}
                  {searchResults?.map((entry, index: number) => {
                    const {
                      id,
                      shipname,
                      flag,
                      fleet,
                      mmsi,
                      imo,
                      callsign,
                      dataset,
                      firstTransmissionDate,
                      lastTransmissionDate,
                    } = entry
                    const flagLabel = getFlagById(flag)?.label
                    return (
                      <li
                        {...getItemProps({ item: entry, index })}
                        className={cx(styles.searchResult, {
                          [styles.highlighted]: highlightedIndex === index,
                        })}
                        key={id}
                      >
                        <div className={styles.name}>{shipname || '---'}</div>
                        <div className={styles.properties}>
                          {flagLabel && (
                            <div className={styles.property}>
                              <label>{t('vessel.flag', 'Flag')}</label>
                              <span>{flagLabel}</span>
                            </div>
                          )}
                          {mmsi && (
                            <div className={styles.property}>
                              <label>{t('vessel.mmsi', 'MMSI')}</label>
                              <span>{mmsi}</span>
                            </div>
                          )}
                          {imo && (
                            <div className={styles.property}>
                              <label>{t('vessel.imo', 'IMO')}</label>
                              <span>{imo}</span>
                            </div>
                          )}
                          {callsign && (
                            <div className={styles.property}>
                              <label>{t('vessel.callsign', 'Callsign')}</label>
                              <span>{callsign}</span>
                            </div>
                          )}
                          {fleet && (
                            <div className={styles.property}>
                              <label>{t('vessel.fleet', 'Fleet')}</label>
                              <span>{formatInfoField(fleet, 'fleet')}</span>
                            </div>
                          )}
                          {firstTransmissionDate && lastTransmissionDate && (
                            <div className={styles.property}>
                              <label>{t('vessel.transmission_plural', 'Transmissions')}</label>
                              <span>
                                from <I18nDate date={firstTransmissionDate} /> to{' '}
                                <I18nDate date={lastTransmissionDate} />
                              </span>
                            </div>
                          )}

                          {dataset?.name && (
                            <div className={styles.property}>
                              <label>{t('vessel.source', 'Source')}</label>
                              <span>{dataset.name}</span>
                            </div>
                          )}
                        </div>
                      </li>
                    )
                  })}
                  {searchPagination.total !== 0 &&
                  searchPagination.total > RESULTS_PER_PAGE &&
                  searchPagination.offset <= searchPagination.total ? (
                    <li className={styles.spinner} ref={ref}>
                      <Spinner inline size="small" />
                    </li>
                  ) : (
                    <SearchNoResultsState />
                  )}
                </ul>
              )}
            </Fragment>
          ) : (
            <SearchNotAllowed />
          )}
        </div>
      )}
    </Downshift>
  )
}

export default Search
