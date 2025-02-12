import { createSelector } from '@reduxjs/toolkit'
import { groupBy, sum, uniq } from 'es-toolkit'

import type { Dataset, IdentityVessel } from '@globalfishingwatch/api-types'
import { DatasetTypes, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import {
  getResponsiveVisualizationItemValue,
  type ResponsiveVisualizationData,
} from '@globalfishingwatch/responsive-visualizations'

import { selectVesselsDatasets } from 'features/datasets/datasets.selectors'
import { getRelatedDatasetByType } from 'features/datasets/datasets.utils'
import { selectVGRFootprintDataview } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { t } from 'features/i18n/i18n'
import {
  type ReportVesselWithDatasets,
  selectReportDataviewsWithPermissions,
} from 'features/reports/report-area/area-reports.selectors'
import { getVesselsFiltered } from 'features/reports/report-area/area-reports.utils'
import {
  EMPTY_API_VALUES,
  MAX_CATEGORIES,
  OTHERS_CATEGORY_LABEL,
} from 'features/reports/reports.config'
import {
  selectReportVesselFilter,
  selectReportVesselPage,
  selectReportVesselResultsPerPage,
  selectReportVesselsOrderDirection,
  selectReportVesselsOrderProperty,
  selectReportVesselsSubCategory,
} from 'features/reports/reports.config.selectors'
import { selectReportCategory, selectReportVesselGraph } from 'features/reports/reports.selectors'
import { ReportCategory } from 'features/reports/reports.types'
import { getVesselIndividualGroupedData } from 'features/reports/shared/utils/reports.utils'
import { REPORT_FILTER_PROPERTIES } from 'features/reports/shared/vessels/report-vessels.config'
import { selectReportVesselsList } from 'features/reports/tabs/activity/vessels/report-activity-vessels.selectors'
import { getSearchIdentityResolved, getVesselProperty } from 'features/vessel/vessel.utils'
import { getVesselGroupUniqVessels } from 'features/vessel-groups/vessel-groups.utils'
import type { VesselGroupVesselIdentity } from 'features/vessel-groups/vessel-groups-modal.slice'
import { cleanFlagState } from 'utils/flags'
import {
  EMPTY_FIELD_PLACEHOLDER,
  formatInfoField,
  getVesselGearTypeLabel,
  getVesselShipTypeLabel,
} from 'utils/info'

import { selectVGRVessels } from '../../report-vessel-group/vessel-group-report.slice'
import { selectEventsVessels } from '../../tabs/events/events-report.selectors'

import type { ReportTableVessel } from './report-vessels.types'

const getVesselSource = (vessel: IdentityVessel) => {
  let source = ''
  if (vessel.registryInfo?.length && vessel.selfReportedInfo?.length) {
    source = 'both'
  } else if (vessel.registryInfo?.length) {
    source = 'registry'
  } else if (vessel.selfReportedInfo?.length) {
    source = vessel.selfReportedInfo[0].sourceCode.join(', ')
  }
  return source
}

const selectVesselGroupVessels = createSelector(
  [selectVGRVessels, selectVGRFootprintDataview],
  (vGRVessels, vesselsDataview) => {
    if (!vGRVessels?.length) {
      return []
    }
    return getVesselGroupUniqVessels(vGRVessels)
      .filter((v) => v.identity)
      .map((vessel) => ({ ...vessel, dataviewId: vesselsDataview?.id }))
  }
)

export const selectReportVesselsByCategory = createSelector(
  [selectReportCategory, selectReportVesselsList, selectVesselGroupVessels, selectEventsVessels],
  (reportCategory, reportVesselsList, vesselGroupVessels, eventsVessels) => {
    if (!reportCategory) {
      return []
    }
    if (
      reportCategory === ReportCategory.Activity ||
      reportCategory === ReportCategory.Detections
    ) {
      return reportVesselsList
    }
    if (reportCategory === ReportCategory.VesselGroup) {
      return vesselGroupVessels
    }
    if (reportCategory === ReportCategory.Events) {
      return eventsVessels
    }
    return []
  }
)

export const selectReportVessels = createSelector(
  [selectReportVesselsByCategory],
  (vessels): ReportTableVessel[] | null => {
    if (!vessels?.length) {
      return null
    }
    return vessels.flatMap((vessel) => {
      const identity = (vessel as VesselGroupVesselIdentity)?.identity
      // Vessels have identity when coming from events or vessel groups
      if (identity) {
        const { shipname, ...vesselData } = getSearchIdentityResolved(identity!)
        const source = getVesselSource(identity)
        const vesselType = getVesselShipTypeLabel(vesselData) as string
        const geartype = getVesselGearTypeLabel(vesselData) as string
        const flag = getVesselProperty(identity, 'flag', {
          identitySource: VesselIdentitySourceEnum.SelfReported,
        })

        const tableVessel: ReportTableVessel = {
          id: vessel.vesselId,
          datasetId: vesselData.dataset as string,
          dataviewId: vessel.dataviewId,
          // TODO:CVP add tracks for vessel group vessels if want to pin them
          // trackDatasetId: '',
          shipName: formatInfoField(shipname, 'shipname') as string,
          vesselType,
          geartype,
          ssvid: getVesselProperty(identity, 'ssvid', {
            identitySource: VesselIdentitySourceEnum.SelfReported,
          }),
          flag: flag,
          flagTranslated: flag ? t(`flags:${flag}` as any) : EMPTY_FIELD_PLACEHOLDER,
          flagTranslatedClean: flag
            ? cleanFlagState(t(`flags:${flag}` as any))
            : EMPTY_FIELD_PLACEHOLDER,
          source: t(`common.sourceOptions.${source}`, source),
        }
        return tableVessel
      } else {
        // Don't have identity when coming from activity or detections reports
        const reportVessel = vessel as ReportVesselWithDatasets
        const tableVessel: ReportTableVessel = {
          id: reportVessel.vesselId,
          datasetId: (reportVessel.infoDataset?.id || reportVessel.dataset) as string,
          dataviewId: reportVessel.dataviewId,
          trackDatasetId: reportVessel.trackDataset?.id,
          shipName: formatInfoField(reportVessel.shipName, 'shipname') as string,
          vesselType: formatInfoField(reportVessel.vesselType, 'vesselType') as string,
          geartype: formatInfoField(reportVessel.geartype, 'geartypes') as string,
          ssvid: reportVessel.mmsi || EMPTY_FIELD_PLACEHOLDER,
          flag: reportVessel.flag || EMPTY_FIELD_PLACEHOLDER,
          value: reportVessel.value as number,
          color: reportVessel.color,
          flagTranslated: reportVessel.flag
            ? t(`flags:${reportVessel.flag}` as any)
            : EMPTY_FIELD_PLACEHOLDER,
          flagTranslatedClean: reportVessel.flag
            ? cleanFlagState(t(`flags:${reportVessel.flag}` as any))
            : EMPTY_FIELD_PLACEHOLDER,
          // TODO:CVP add the needed values of identity here
        }
        return tableVessel
      }
    })
  }
)

export const selectReportVesselsTimeRange = createSelector([selectReportVessels], (vessels) => {
  if (!vessels?.length) return null
  let start: string = ''
  let end: string = ''
  vessels.forEach((vessel) => {
    const { transmissionDateFrom, transmissionDateTo } = vessel
    if (transmissionDateFrom && transmissionDateTo) {
      if (!start || transmissionDateFrom < start) {
        start = transmissionDateFrom
      }
      if (!end || transmissionDateTo > end) {
        end = transmissionDateTo
      }
    }
  })
  return { start, end }
})

export const selectReportVesselGroupTimeRange = createSelector([selectVGRVessels], (vessels) => {
  if (!vessels?.length) return null
  let start: string = ''
  let end: string = ''
  vessels.forEach((vessel) => {
    if (vessel.identity) {
      const { transmissionDateFrom, transmissionDateTo } = getSearchIdentityResolved(
        vessel.identity
      )
      if (transmissionDateFrom && transmissionDateTo) {
        if (!start || transmissionDateFrom < start) {
          start = transmissionDateFrom
        }
        if (!end || transmissionDateTo > end) {
          end = transmissionDateTo
        }
      }
    }
  })
  return { start, end }
})

export const selectReportVesselsFlags = createSelector([selectReportVessels], (vessels) => {
  if (!vessels?.length) return null
  const flags = new Set<string>()
  vessels.forEach((vessel) => {
    if (vessel.flagTranslated && vessel.flagTranslated !== 'null') {
      flags.add(vessel.flagTranslated)
    }
  })
  return flags
})

export const selectReportVesselGroupFlags = createSelector([selectVGRVessels], (vessels) => {
  if (!vessels?.length) return null
  const flags = new Set<string>()
  vessels.forEach((vessel) => {
    if (vessel.identity) {
      const { flag } = getSearchIdentityResolved(vessel.identity)
      if (flag && flag !== 'null') {
        flags.add(flag)
      }
    }
  })
  return flags
})

export const selectReportVesselsFiltered = createSelector(
  [selectReportVessels, selectReportVesselFilter],
  (vessels, filter) => {
    if (!vessels?.length) return null
    if (!filter) return vessels
    return getVesselsFiltered<ReportTableVessel>(vessels, filter, REPORT_FILTER_PROPERTIES)
  }
)

export const selectReportVesselsOrdered = createSelector(
  [
    selectReportVesselsFiltered,
    selectReportVesselsOrderProperty,
    selectReportVesselsOrderDirection,
  ],
  (vessels, property, direction) => {
    if (!vessels?.length) return []

    return vessels.toSorted((a, b) => {
      // First compare by value
      const valueA = a.value || 0
      const valueB = b.value || 0
      if (valueA !== valueB) {
        return valueB - valueA
      }

      if (!property || !direction) {
        return 0
      }
      // If values are equal, compare by property
      let propA = ''
      let propB = ''
      if (property === 'flag') {
        propA = a.flagTranslated
        propB = b.flagTranslated
      } else if (property === 'shiptype') {
        propA = a.vesselType
        propB = b.vesselType
      } else if (property === 'shipname') {
        propA = a.shipName
        propB = b.shipName
      }

      if (direction === 'asc') {
        return propA.localeCompare(propB)
      }
      return propB.localeCompare(propA)
    })
  }
)

// TODO:CVP rename all of this prefixed with VGR
export const selectReportVesselsPaginated = createSelector(
  [selectReportVesselsOrdered, selectReportVesselPage, selectReportVesselResultsPerPage],
  (vessels, page, resultsPerPage) => {
    if (!vessels?.length) return []
    return vessels.slice(resultsPerPage * page, resultsPerPage * (page + 1))
  }
)

export const selectReportVesselsPagination = createSelector(
  [
    selectReportVesselsPaginated,
    selectReportVesselsByCategory,
    selectReportVesselsFiltered,
    selectReportVesselPage,
    selectReportVesselResultsPerPage,
  ],
  (vessels, allVessels, allVesselsFiltered, page = 0, resultsPerPage) => {
    return {
      page,
      offset: resultsPerPage * page,
      resultsPerPage:
        typeof resultsPerPage === 'number' ? resultsPerPage : parseInt(resultsPerPage),
      resultsNumber: vessels?.length,
      totalFiltered: allVesselsFiltered?.length || 0,
      total: allVessels?.length || 0,
    }
  }
)

export const selectReportVesselsGraphDataKeys = createSelector(
  [selectReportDataviewsWithPermissions],
  (dataviews) => dataviews.map((dataview) => dataview.id).reverse()
)

export const selectReportVesselsGraphAggregatedData = createSelector(
  [selectReportVesselsFiltered, selectReportVesselGraph, selectReportDataviewsWithPermissions],
  (vessels, subsection, dataviews) => {
    if (!vessels) return []
    const reportData = groupBy(vessels, (v) => v.dataviewId || '')

    const dataByDataview = dataviews.map((dataview) => {
      const dataviewData = reportData[dataview.id]
        ? Object.values(reportData[dataview.id]).flatMap((v) => v || [])
        : []

      let dataByKey = {} as Record<any, ReportTableVessel[]>
      switch (subsection) {
        case 'flag':
          dataByKey = groupBy(dataviewData, (vessel) => vessel.flagTranslatedClean)
          break
        case 'vesselType':
          dataByKey = groupBy(dataviewData, (vessel) => vessel.vesselType.split(', ')[0])
          break
        case 'geartype':
          dataByKey = groupBy(dataviewData, (vessel) => vessel.geartype.split(', ')[0])
          break
        case 'source':
          dataByKey = groupBy(dataviewData, (vessel) => vessel.source as string)
      }
      // const dataByKey = groupBy(dataviewData, (d) => d[reportGraph] || '')
      return {
        id: dataview.id,
        color: dataview.config?.color,
        data: dataByKey,
      }
    })
    const allDistributionKeys = uniq(dataByDataview.flatMap(({ data }) => Object.keys(data)))

    const dataviewIds = dataviews.map((d) => d.id)
    const data: ResponsiveVisualizationData<'aggregated'> = allDistributionKeys
      .flatMap((key) => {
        const distributionData: Record<any, any> = { name: key }
        dataByDataview.forEach(({ id, color, data }) => {
          distributionData[id] = { color, value: (data?.[key] || []).length }
        })
        if (sum(dataviewIds.map((d) => distributionData[d])) === 0) return []
        return distributionData as ResponsiveVisualizationData<'aggregated'>
      })
      .sort((a, b) => {
        if (EMPTY_API_VALUES.includes(a.name as string)) return 1
        if (EMPTY_API_VALUES.includes(b.name as string)) return -1
        return (
          sum(dataviewIds.map((d) => getResponsiveVisualizationItemValue(b[d]))) -
          sum(dataviewIds.map((d) => getResponsiveVisualizationItemValue(a[d])))
        )
      })

    const distributionKeys = data.map((d) => d.name)

    if (!data?.length) return null
    if (distributionKeys.length <= MAX_CATEGORIES) return data

    const top = data.slice(0, MAX_CATEGORIES)
    const rest = data.slice(MAX_CATEGORIES)
    const others = {
      name: OTHERS_CATEGORY_LABEL,
      ...Object.fromEntries(
        dataviewIds.map((valueKey) => [
          valueKey,
          { value: sum(rest.map((key: any) => key[valueKey]?.value)) },
        ])
      ),
    }
    return [...top, others] as ResponsiveVisualizationData<'aggregated'>

    // const orderedGroups = Object.entries(vesselsGrouped)
    //   .map(([key, value]) => ({
    //     name: key,
    //     value: (value as any[]).length,
    //     color: (value as any[])[0]?.color,
    //   }))
    //   .sort((a, b) => {
    //     return b.value - a.value
    //   })
    // const groupsWithoutOther: GraphDataGroup[] = []
    // const otherGroups: GraphDataGroup[] = []
    // orderedGroups.forEach((group) => {
    //   if (
    //     group.name === 'null' ||
    //     group.name.toLowerCase() === OTHERS_CATEGORY_LABEL.toLowerCase() ||
    //     group.name === EMPTY_FIELD_PLACEHOLDER
    //   ) {
    //     otherGroups.push(group)
    //   } else {
    //     groupsWithoutOther.push(group)
    //   }
    // })
    // const allGroups =
    //   otherGroups.length > 0
    //     ? [
    //         ...groupsWithoutOther,
    //         {
    //           name: OTHERS_CATEGORY_LABEL,
    //           value: otherGroups.reduce((acc, group) => acc + group.value, 0),
    //         },
    //       ]
    //     : groupsWithoutOther
    // if (allGroups.length <= MAX_CATEGORIES) {
    //   return allGroups
    // }
    // const firstGroups = allGroups.slice(0, MAX_CATEGORIES)
    // const restOfGroups = allGroups.slice(MAX_CATEGORIES)

    // return [
    //   ...firstGroups,
    //   {
    //     name: OTHERS_CATEGORY_LABEL,
    //     value: restOfGroups.reduce((acc, group) => acc + group.value, 0),
    //   },
    // ] as ResponsiveVisualizationData<'aggregated'>
  }
)

export const REPORT_GRAPH_LABEL_KEY = 'name'
const defaultOthersLabel: ResponsiveVisualizationData<'aggregated'> = []
// export const selectReportVesselsGraphDataOthers = createSelector(
//   [selectReportVesselsGraphAggregatedData],
//   (reportGraph): ResponsiveVisualizationData<'aggregated'> | null => {
//     if (!reportGraph?.data?.length) return null
//     if (reportGraph?.distributionKeys.length <= MAX_CATEGORIES) return defaultOthersLabel
//     const others = reportGraph.data.slice(MAX_CATEGORIES)

//     return reportGraph.distributionKeys
//       .flatMap((key) => {
//         const other = others.find((o) => o.name === key)
//         if (!other) return EMPTY_ARRAY
//         const { name, ...rest } = other
//         return {
//           name,
//           value: {
//             value: sum(Object.values(rest).map((v) => (v as any).value)),
//           },
//         }
//       })
//       .sort((a, b) => {
//         if (EMPTY_API_VALUES.includes(a.name as string)) return 1
//         if (EMPTY_API_VALUES.includes(b.name as string)) return -1
//         return b.value?.value - a.value?.value
//       })
//   }
// )

export const selectReportVesselsGraphIndividualData = createSelector(
  [selectReportVesselsFiltered, selectReportVesselsSubCategory],
  (vessels, groupBy) => {
    if (!vessels || !groupBy) return []
    return getVesselIndividualGroupedData(vessels, groupBy)
  }
)

export function getVesselDatasetsWithoutEventsRelated(
  vessels: VesselGroupVesselIdentity[] | null,
  vesselDatasets: Dataset[]
) {
  if (!vessels?.length) {
    return []
  }
  const datasets = new Set<Dataset>()
  vessels?.forEach((vessel) => {
    const infoDataset = vesselDatasets?.find((dataset) => dataset.id === vessel.dataset)
    if (!infoDataset || datasets.has(infoDataset)) return
    const eventsDataset = getRelatedDatasetByType(infoDataset, DatasetTypes.Events)
    if (!eventsDataset) {
      datasets.add(infoDataset)
    }
  })
  return Array.from(datasets)
}

export const selectVGRVesselDatasetsWithoutEventsRelated = createSelector(
  [selectVGRVessels, selectVesselsDatasets],
  (vessels = [], vesselDatasets) => {
    return getVesselDatasetsWithoutEventsRelated(vessels, vesselDatasets)
  }
)
