import { createSelector } from '@reduxjs/toolkit'
import {
  selectVesselGroupEventsStatsApiSlice,
  selectVesselGroupEventsVessels,
  VesselGroupEventsVesselsParams,
} from 'queries/vessel-group-events-stats-api'
import { groupBy } from 'es-toolkit'
import { selectVGRData } from 'features/reports/vessel-groups/vessel-group-report.slice'
import { getSearchIdentityResolved } from 'features/vessel/vessel.utils'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectReportVesselGroupId } from 'routes/routes.selectors'
import {
  selectVGREventsResultsPerPage,
  selectVGREventsVesselFilter,
  selectVGREventsVesselPage,
  selectVGREventsVesselsProperty,
} from 'features/reports/vessel-groups/vessel-group.config.selectors'
import { getVesselsFiltered } from 'features/reports/areas/area-reports.utils'
import { REPORT_FILTER_PROPERTIES } from 'features/reports/vessel-groups/vessels/vessel-group-report-vessels.selectors'
import { selectVGREventsSubsectionDataview } from 'features/reports/vessel-groups/vessel-group-report.selectors'
import { OTHER_CATEGORY_LABEL } from 'features/reports/vessel-groups/vessel-group-report.config'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { MAX_CATEGORIES } from 'features/reports/areas/area-reports.config'
import { t } from 'features/i18n/i18n'
import { getVesselsWithoutDuplicates } from 'features/vessel-groups/vessel-groups.utils'

export const selectFetchVGREventsVesselsParams = createSelector(
  [selectTimeRange, selectReportVesselGroupId, selectVGREventsSubsectionDataview],
  ({ start, end }, reportVesselGroupId, eventsDataview) => {
    if (!eventsDataview) {
      return
    }
    return {
      dataview: eventsDataview,
      vesselGroupId: reportVesselGroupId,
      start,
      end,
    } as VesselGroupEventsVesselsParams
  }
)

export const selectVGREventsVesselsData = createSelector(
  [selectVesselGroupEventsStatsApiSlice, selectFetchVGREventsVesselsParams],
  (vesselGroupEventsStatsApi, params) => {
    if (!params) {
      return
    }
    return selectVesselGroupEventsVessels(params)({ vesselGroupEventsStatsApi })?.data
  }
)

export const selectVGREventsVessels = createSelector(
  [selectVGREventsVesselsData, selectVGRData],
  (data, vesselGroup) => {
    if (!data || !vesselGroup) {
      return
    }
    const vesselsWithoutDuplicates = getVesselsWithoutDuplicates(vesselGroup.vessels)
    const insightVessels = vesselsWithoutDuplicates?.flatMap((vessel) => {
      const vesselWithEvents = data?.find((v) => v.vesselId === vessel.vesselId)
      if (!vesselWithEvents) {
        return []
      }
      const identity = getSearchIdentityResolved(vessel.identity!)

      return {
        ...vesselWithEvents,
        ...identity,
        geartype:
          (identity.geartypes || [])
            .sort()
            .map((g) => formatInfoField(g, 'geartypes'))
            .join(', ') || OTHER_CATEGORY_LABEL,
        flagTranslated: t(`flags:${identity.flag as string}` as any),
      }
    })
    return insightVessels.sort((a, b) => b.numEvents - a.numEvents)
  }
)

export const selectVGREventsVesselsFiltered = createSelector(
  [selectVGREventsVessels, selectVGREventsVesselFilter],
  (vessels, filter) => {
    if (!vessels?.length) return null
    return getVesselsFiltered(vessels, filter, REPORT_FILTER_PROPERTIES)
  }
)

export const selectVGREventsVesselsPaginated = createSelector(
  [selectVGREventsVesselsFiltered, selectVGREventsVesselPage, selectVGREventsResultsPerPage],
  (vessels, page, resultsPerPage) => {
    if (!vessels?.length) return []
    return vessels.slice(resultsPerPage * page, resultsPerPage * (page + 1))
  }
)
type GraphDataGroup = {
  name: string
  value: number
}

export const selectVGREventsVesselsGrouped = createSelector(
  [selectVGREventsVesselsFiltered, selectVGREventsVesselsProperty],
  (vessels, property) => {
    if (!vessels?.length) return []
    const orderedGroups: { name: string; value: number }[] = Object.entries(
      groupBy(vessels, (vessel) => {
        return property === 'flag' ? vessel.flagTranslated : (vessel.geartype as string)
      })
    )
      .map(([key, value]) => ({ name: key, property: key, value: value.length }))
      .sort((a, b) => b.value - a.value)

    const groupsWithoutOther: GraphDataGroup[] = []
    const otherGroups: GraphDataGroup[] = []
    orderedGroups.forEach((group) => {
      if (
        group.name === 'null' ||
        group.name.toLowerCase() === OTHER_CATEGORY_LABEL.toLowerCase() ||
        group.name === EMPTY_FIELD_PLACEHOLDER
      ) {
        otherGroups.push(group)
      } else {
        groupsWithoutOther.push(group)
      }
    })
    const allGroups =
      otherGroups.length > 0
        ? [
            ...groupsWithoutOther,
            {
              name: OTHER_CATEGORY_LABEL,
              value: otherGroups.reduce((acc, group) => acc + group.value, 0),
            },
          ]
        : groupsWithoutOther
    if (allGroups.length <= MAX_CATEGORIES) {
      return allGroups
    }
    const firstGroups = allGroups.slice(0, MAX_CATEGORIES)
    const restOfGroups = allGroups.slice(MAX_CATEGORIES)
    return [
      ...firstGroups,
      {
        name: OTHER_CATEGORY_LABEL,
        value: restOfGroups.reduce((acc, group) => acc + group.value, 0),
      },
    ] as GraphDataGroup[]
  }
)
export const selectVGREventsVesselsFlags = createSelector([selectVGREventsVessels], (vessels) => {
  if (!vessels?.length) return null
  let flags = new Set<string>()
  vessels.forEach((vessel) => {
    if (vessel.flagTranslated && vessel.flagTranslated !== 'null') {
      flags.add(vessel.flagTranslated as string)
    }
  })
  return flags
})

export const selectVGREventsVesselsPagination = createSelector(
  [
    selectVGREventsVesselsPaginated,
    selectVGREventsVessels,
    selectVGREventsVesselsFiltered,
    selectVGREventsVesselPage,
    selectVGREventsResultsPerPage,
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
