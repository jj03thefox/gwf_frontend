import { createSelector } from '@reduxjs/toolkit'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { selectQueryParam } from 'routes/routes.selectors'
import { DEFAULT_SEARCH_STATE, SearchType } from 'features/search/search.config'
import { VesselSearchState, VesselSearchStateProperty } from 'types'

export const selectVesselSearchStateProperty = (property: VesselSearchStateProperty) =>
  createSelector([selectQueryParam(property)], (urlProperty) => {
    if (urlProperty !== undefined) return urlProperty
    return DEFAULT_SEARCH_STATE[property]
  })

export const selectSearchQuery = createSelector(
  [selectVesselSearchStateProperty('query')],
  (query): string => {
    return query
  }
)

export const selectSearchOption = createSelector(
  [selectVesselSearchStateProperty('searchOption')],
  (query): SearchType => {
    return query
  }
)

export const selectSearchInfoSource = createSelector(
  [selectVesselSearchStateProperty('infoSource')],
  (infoSource): VesselIdentitySourceEnum => {
    return infoSource
  }
)

export const selectSearchFilters = createSelector(
  [
    selectVesselSearchStateProperty('flag'),
    selectVesselSearchStateProperty('sources'),
    selectVesselSearchStateProperty('transmissionDateFrom'),
    selectVesselSearchStateProperty('transmissionDateTo'),
    selectVesselSearchStateProperty('ssvid'),
    selectVesselSearchStateProperty('imo'),
    selectVesselSearchStateProperty('callsign'),
    selectVesselSearchStateProperty('owner'),
    selectVesselSearchStateProperty('codMarinha'),
    selectVesselSearchStateProperty('geartype'),
    selectVesselSearchStateProperty('shiptype'),
    selectVesselSearchStateProperty('targetSpecies'),
    selectVesselSearchStateProperty('fleet'),
    selectVesselSearchStateProperty('origin'),
    selectSearchInfoSource,
  ],
  (
    flag,
    sources,
    transmissionDateFrom,
    transmissionDateTo,
    ssvid,
    imo,
    callsign,
    owner,
    codMarinha,
    geartype,
    shiptype,
    targetSpecies,
    fleet,
    origin,
    infoSource
  ): VesselSearchState => {
    return {
      flag,
      sources,
      transmissionDateFrom,
      transmissionDateTo,
      ssvid,
      imo,
      callsign,
      owner,
      codMarinha,
      geartype,
      shiptype,
      targetSpecies,
      fleet,
      origin,
      infoSource,
    }
  }
)
