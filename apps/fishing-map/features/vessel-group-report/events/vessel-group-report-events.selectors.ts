import { createSelector } from '@reduxjs/toolkit'
import {
  selectVesselGroupEventsStatsApiSlice,
  selectVesselGroupEventsVessels,
  VesselGroupEventsVesselsParams,
} from 'queries/vessel-group-events-stats-api'
import { selectVesselGroupReportData } from 'features/vessel-group-report/vessel-group-report.slice'
import { getSearchIdentityResolved, getVesselId } from 'features/vessel/vessel.utils'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectReportVesselGroupId } from 'routes/routes.selectors'
import { selectEventsDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import {
  selectVesselGroupReportEventsResultsPerPage,
  selectVesselGroupReportEventsSubsection,
  selectVesselGroupReportEventsVesselFilter,
  selectVesselGroupReportEventsVesselPage,
} from 'features/vessel-group-report/vessel-group.config.selectors'
import { getVesselsFiltered } from 'features/area-report/reports.utils'
import { REPORT_FILTER_PROPERTIES } from 'features/vessel-group-report/vessels/vessel-group-report-vessels.selectors'

export const selectFetchVesselGroupReportEventsVesselsParams = createSelector(
  [
    selectTimeRange,
    selectReportVesselGroupId,
    selectEventsDataviews,
    selectVesselGroupReportEventsSubsection,
  ],
  ({ start, end }, reportVesselGroupId, eventsDataviews, eventsSubsection) => {
    const eventsDataview = eventsDataviews.find(({ id }) => id === eventsSubsection)
    if (!reportVesselGroupId || !eventsDataview) {
      return
    }
    return {
      datasetId: eventsDataview?.datasets?.[0]?.id as string,
      vesselGroupId: reportVesselGroupId,
      start,
      end,
    } as VesselGroupEventsVesselsParams
  }
)

export const selectVesselGroupReportEventsVesselsData = createSelector(
  [selectVesselGroupEventsStatsApiSlice, selectFetchVesselGroupReportEventsVesselsParams],
  (vesselGroupEventsStatsApi, params) => {
    if (!params) {
      return
    }
    return selectVesselGroupEventsVessels(params)({ vesselGroupEventsStatsApi })?.data
  }
)

export const selectVesselGroupReportEventsVessels = createSelector(
  [selectVesselGroupReportEventsVesselsData, selectVesselGroupReportData],
  (data, vesselGroup) => {
    if (!data || !vesselGroup) {
      return
    }
    const insightVessels = vesselGroup?.vessels?.flatMap((vessel) => {
      const vesselWithEvents = data?.find((v) => v.vesselId === getVesselId(vessel))
      if (!vesselWithEvents) {
        return []
      }
      const identity = getSearchIdentityResolved(vessel)
      return {
        ...vesselWithEvents,
        ...identity,
        geartype: identity.geartypes,
      }
    })
    return insightVessels.sort((a, b) => b.numEvents - a.numEvents)
  }
)

export const selectVesselGroupReportEventsVesselsFiltered = createSelector(
  [selectVesselGroupReportEventsVessels, selectVesselGroupReportEventsVesselFilter],
  (vessels, filter) => {
    if (!vessels?.length) return null
    return getVesselsFiltered(vessels, filter, REPORT_FILTER_PROPERTIES)
  }
)

export const selectVesselGroupReportEventsVesselsPaginated = createSelector(
  [
    selectVesselGroupReportEventsVesselsFiltered,
    selectVesselGroupReportEventsVesselPage,
    selectVesselGroupReportEventsResultsPerPage,
  ],
  (vessels, page, resultsPerPage) => {
    if (!vessels?.length) return []
    return vessels.slice(resultsPerPage * page, resultsPerPage * (page + 1))
  }
)

export const selectVesselGroupReportEventsVesselsPagination = createSelector(
  [
    selectVesselGroupReportEventsVesselsPaginated,
    selectVesselGroupReportEventsVessels,
    selectVesselGroupReportEventsVesselsFiltered,
    selectVesselGroupReportEventsVesselPage,
    selectVesselGroupReportEventsResultsPerPage,
  ],
  (vessels, allVessels, allVesselsFiltered, page = 0, resultsPerPage) => {
    return {
      page,
      offset: resultsPerPage * page,
      resultsPerPage:
        typeof resultsPerPage === 'number' ? resultsPerPage : parseInt(resultsPerPage),
      resultsNumber: vessels!?.length,
      totalFiltered: allVesselsFiltered!?.length,
      total: allVessels!?.length,
    }
  }
)
