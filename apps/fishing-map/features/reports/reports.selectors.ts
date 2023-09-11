import { createSelector } from '@reduxjs/toolkit'
import { groupBy, sum, sumBy, uniq, uniqBy } from 'lodash'
import { matchSorter } from 'match-sorter'
import { t } from 'i18next'
import { MultiPolygon } from 'geojson'
import { Dataset, DatasetTypes, ReportVessel } from '@globalfishingwatch/api-types'
import { wrapGeometryBbox } from '@globalfishingwatch/data-transforms'
import {
  selectActiveReportDataviews,
  selectReportActivityGraph,
  selectReportCategory,
  selectReportResultsPerPage,
  selectReportTimeComparison,
  selectReportVesselFilter,
  selectReportVesselGraph,
  selectReportVesselPage,
} from 'features/app/app.selectors'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import {
  getDatasetsReportSupported,
  getRelatedDatasetByType,
} from 'features/datasets/datasets.utils'
import { selectReportAreaId, selectReportDatasetId } from 'features/app/app.selectors'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectUserData } from 'features/user/user.slice'
import { getUTCDateTime } from 'utils/dates'
import {
  getBufferedArea,
  getBufferedFeature,
  getReportCategoryFromDataview,
} from 'features/reports/reports.utils'
import { ReportCategory } from 'types'
import { selectContextAreasDataviews } from 'features/dataviews/dataviews.selectors'
import { createDeepEqualSelector } from 'utils/selectors'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import { sortStrings } from 'utils/shared'
import { Area, selectAreas } from 'features/areas/areas.slice'
import { selectUrlBufferUnitQuery, selectUrlBufferValueQuery } from 'routes/routes.selectors'
import { selectReportVesselsData, selectReportPreviewBuffer } from './report.slice'

export const EMPTY_API_VALUES = ['NULL', undefined, '']
export const MAX_CATEGORIES = 5
export const OTHERS_CATEGORY_LABEL = 'OTHERS'

export type ReportVesselWithMeta = ReportVessel & {
  sourceColor: string
  activityDatasetId: string
  category: ReportCategory
  dataviewId: string
  flagTranslated: string
  flagTranslatedClean: string
}
export type ReportVesselWithDatasets = Pick<ReportVessel, 'vesselId' | 'shipName' | 'hours'> &
  Partial<ReportVessel> &
  Pick<ReportVesselWithMeta, 'sourceColor'> & {
    infoDataset?: Dataset
    trackDataset?: Dataset
  }

export const selectReportDataviewsWithPermissions = createDeepEqualSelector(
  [selectActiveReportDataviews, selectUserData],
  (reportDataviews, userData) => {
    return reportDataviews
      .map((dataview) => {
        const supportedDatasets = getDatasetsReportSupported(
          [dataview],
          userData?.permissions || []
        )
        return {
          ...dataview,
          datasets: dataview.datasets?.filter((d) => supportedDatasets.includes(d.id)),
          filter: dataview.config?.filter || [],
          ...(dataview.config?.['vessel-groups']?.length && {
            vesselGroups: dataview.config?.['vessel-groups'],
          }),
        }
      })
      .filter((dataview) => dataview.datasets.length > 0)
  }
)

export const selectReportAreaDataview = createSelector(
  [selectContextAreasDataviews, selectReportDatasetId],
  (contextDataviews, datasetId) => {
    const areaDataview = contextDataviews?.find((dataview) => {
      return dataview.datasets?.some((dataset) => dataset.id === datasetId)
    })
    return areaDataview
  }
)

export const selectReportAreaIds = createSelector(
  [selectReportAreaId, selectReportDatasetId],
  (areaId, datasetId) => {
    return { datasetId, areaId }
  }
)

export const selectReportActivityFlatten = createSelector(
  [selectReportVesselsData, selectReportDataviewsWithPermissions, selectReportCategory],
  (reportDatasets, dataviews, reportCategory) => {
    if (!dataviews?.length || !reportDatasets?.length) return null

    return reportDatasets.flatMap((dataset, index) =>
      Object.entries(dataset).flatMap(([datasetId, vessels]) => {
        const dataview = dataviews[index]
        if (!dataview) {
          console.warn('Missing dataview for report dataset:', dataset)
          return []
        }
        return (vessels || ([] as any)).flatMap((vessel) => {
          if (
            reportCategory !== ReportCategory.Detections &&
            EMPTY_API_VALUES.includes(vessel.flag) &&
            EMPTY_API_VALUES.includes(vessel.shipName) &&
            EMPTY_API_VALUES.includes(vessel.vesselType) &&
            EMPTY_API_VALUES.includes(vessel.geartype)
          ) {
            return []
          }
          return {
            ...vessel,
            shipName: EMPTY_API_VALUES.includes(vessel.shipName)
              ? t('common.unknownVessel', 'Unknown Vessel')
              : vessel.shipName,
            activityDatasetId: datasetId,
            dataviewId: dataview?.id,
            category: getReportCategoryFromDataview(dataview),
            sourceColor: dataview?.config?.color,
          } as ReportVesselWithMeta
        })
      })
    ) as ReportVesselWithMeta[]
  }
)

export const selectReportVesselsNumber = createSelector(
  [selectReportActivityFlatten],
  (vessels) => {
    if (!vessels?.length) return null

    return uniqBy(vessels, 'vesselId').length
  }
)

export const selectReportVesselsHours = createSelector([selectReportActivityFlatten], (vessels) => {
  if (!vessels?.length) return null
  return vessels.map((vessel) => vessel?.hours || 0).reduce((acc, hours) => acc + hours, 0)
})

export const selectReportVesselsList = createSelector(
  [selectReportActivityFlatten, selectAllDatasets, selectReportCategory],
  (vessels, datasets, reportCategory) => {
    if (!vessels?.length) return null
    return Object.values(groupBy(vessels, 'vesselId'))
      .flatMap((vesselActivity) => {
        if (vesselActivity[0]?.category !== reportCategory) return []
        const activityDataset = datasets.find((d) => vesselActivity[0].activityDatasetId === d.id)
        const infoDatasetId = getRelatedDatasetByType(activityDataset, DatasetTypes.Vessels)?.id
        const infoDataset = datasets.find((d) => d.id === infoDatasetId)
        const trackDatasetId = getRelatedDatasetByType(
          infoDataset || activityDataset,
          DatasetTypes.Tracks
        )?.id
        const trackDataset = datasets.find((d) => d.id === trackDatasetId)
        return {
          dataviewId: vesselActivity[0]?.dataviewId,
          vesselId: vesselActivity[0]?.vesselId,
          shipName: vesselActivity[0]?.shipName,
          mmsi: vesselActivity[0]?.mmsi,
          flag: vesselActivity[0]?.flag,
          flagTranslated: t(
            `flags:${vesselActivity[0]?.flag as string}` as any,
            vesselActivity[0]?.flag
          ),
          flagTranslatedClean: cleanFlagState(
            t(`flags:${vesselActivity[0]?.flag as string}` as any, vesselActivity[0]?.flag)
          ),
          geartype: cleanVesselOrGearType({
            value: vesselActivity[0]?.geartype,
            property: 'geartype',
          }),
          vesselType: cleanVesselOrGearType({
            value: vesselActivity[0]?.vesselType,
            property: 'vesselType',
          }),
          hours: vesselActivity[0]?.hours,
          infoDataset,
          trackDataset,
          sourceColor: vesselActivity[0]?.sourceColor,
        } as ReportVesselWithDatasets
      })
      .sort((a, b) => (b.hours as number) - (a.hours as number))
  }
)

export const selectHasReportVessels = createSelector([selectReportVesselsList], (vessels) => {
  return vessels!?.length > 0
})

export const selectReportVesselsListWithAllInfo = createSelector(
  [selectReportActivityFlatten],
  (vessels) => {
    if (!vessels?.length) return null

    return Object.values(groupBy(vessels, 'vesselId'))
      .map((vesselActivity) => {
        return {
          ...vesselActivity[0],
          hours: sumBy(vesselActivity, 'hours'),
          flagTranslated: t(
            `flags:${vesselActivity[0]?.flag as string}` as any,
            vesselActivity[0]?.flag
          ),
          flagTranslatedClean: cleanFlagState(
            t(`flags:${vesselActivity[0]?.flag as string}` as any, vesselActivity[0]?.flag)
          ),
          geartype: t(
            `vessel.gearTypes.${vesselActivity[0]?.geartype}` as any,
            vesselActivity[0]?.geartype
          ),
          vesselType: t(
            `vessel.veeselTypes.${vesselActivity[0]?.vesselType}` as any,
            vesselActivity[0]?.vesselType
          ),
        }
      })
      .sort((a, b) => b.hours - a.hours)
  }
)

type CleanVesselOrGearTypeParams = { value: string; property: 'geartype' | 'vesselType' }
export function cleanVesselOrGearType({ value, property }: CleanVesselOrGearTypeParams) {
  const valuesClean = value ? value?.split(',').filter(Boolean) : [EMPTY_FIELD_PLACEHOLDER]
  const valuesCleanTranslated = valuesClean
    .map((value) => {
      if (property === 'geartype') {
        return t(`vessel.gearTypes.${value}` as any, value)
      }
      return t(`vessel.vesselTypes.${value}` as any, value)
    })
    .sort(sortStrings)
  return valuesCleanTranslated.length > 1
    ? valuesCleanTranslated.join('|')
    : valuesCleanTranslated[0]
}

export function cleanFlagState(flagState: string) {
  return flagState.replace(/,/g, '')
}

const FILTER_PROPERTIES = {
  name: ['shipName'],
  flag: ['flag', 'flagTranslated', 'flagTranslatedClean'],
  mmsi: ['mmsi'],
  gear: ['geartype'],
  type: ['vesselType'],
}

export function getVesselsFiltered(vessels: ReportVesselWithDatasets[], filter: string) {
  if (!filter || !filter.length) {
    return vessels
  }

  const filterBlocks = filter
    .replace(/ ,/g, ',')
    .replace(/ , /g, ',')
    .replace(/, /g, ',')
    .split(',')
    .filter((block) => block.length)

  if (!filterBlocks.length) {
    return vessels
  }

  return filterBlocks
    .reduce((vessels, block) => {
      const propertiesToMatch = block.includes(':') && FILTER_PROPERTIES[block.split(':')[0]]
      const words = (propertiesToMatch ? block.split(':')[1] : block)
        .replace('-', '')
        .split('|')
        .map((word) => word.trim())
        .filter((word) => word.length)
      const matched = words.flatMap((w) =>
        matchSorter(vessels, w, {
          keys: propertiesToMatch || Object.values(FILTER_PROPERTIES).flat(),
          threshold: matchSorter.rankings.CONTAINS,
        })
      )
      const uniqMatched = block.includes('|') ? Array.from(new Set([...matched])) : matched
      if (block.startsWith('-')) {
        const uniqMatchedIds = new Set<string>()
        uniqMatched.forEach(({ vesselId = '' }) => {
          uniqMatchedIds.add(vesselId)
        })
        return vessels.filter(({ vesselId = '' }) => !uniqMatchedIds.has(vesselId))
      } else {
        return uniqMatched
      }
    }, vessels)
    .sort((a, b) => (b.hours as number) - (a.hours as number))
}

export const selectReportVesselsFiltered = createSelector(
  [selectReportVesselsList, selectReportVesselFilter],
  (vessels, filter) => {
    if (!vessels?.length) return null
    return getVesselsFiltered(vessels, filter)
  }
)

const defaultVesselsList = []
export const selectReportVesselsPaginated = createSelector(
  [selectReportVesselsFiltered, selectReportVesselPage, selectReportResultsPerPage],
  (vessels, page = 0, resultsPerPage) => {
    if (!vessels?.length) return defaultVesselsList
    return vessels.slice(resultsPerPage * page, resultsPerPage * (page + 1))
  }
)

export const selectReportVesselsPagination = createSelector(
  [
    selectReportVesselsPaginated,
    selectReportVesselsFiltered,
    selectReportVesselsList,
    selectReportVesselPage,
    selectReportResultsPerPage,
  ],
  (vessels, allVesselsFiltered, allVessels, page = 0, resultsPerPage) => {
    return {
      page,
      offset: resultsPerPage * page,
      resultsPerPage: resultsPerPage,
      resultsNumber: vessels!?.length,
      totalFiltered: allVesselsFiltered!?.length,
      total: allVessels!?.length,
    }
  }
)

export const selectIsReportAllowed = createSelector(
  [selectWorkspaceStatus, selectReportDataviewsWithPermissions],
  (workspaceStatus, reportDataviewsWithPermissions) => {
    if (workspaceStatus !== AsyncReducerStatus.Finished) {
      return false
    }
    const datasetsReportAllowed = uniq(
      reportDataviewsWithPermissions.flatMap((dv) => dv.datasets.flatMap((ds) => ds.id))
    )
    return datasetsReportAllowed?.length > 0
  }
)

export const selectShowTimeComparison = createSelector(
  [selectReportActivityGraph],
  (reportActivityGraph) => {
    return reportActivityGraph === 'beforeAfter' || reportActivityGraph === 'periodComparison'
  }
)

export const selectTimeComparisonValues = createSelector(
  [selectReportTimeComparison],
  (timeComparison) => {
    if (!timeComparison) return null

    const end = getUTCDateTime(timeComparison.start)
      .plus({ [timeComparison.durationType]: timeComparison.duration })
      .toISO()
    const compareEnd = getUTCDateTime(timeComparison.compareStart)
      .plus({ [timeComparison.durationType]: timeComparison.duration })
      .toISO()

    return {
      start: timeComparison.start,
      end,
      compareStart: timeComparison.compareStart,
      compareEnd,
    }
  }
)

export const selectReportVesselsGraphData = createSelector(
  [selectReportVesselGraph, selectReportVesselsFiltered, selectReportDataviewsWithPermissions],
  (reportGraph, vesselsFiltered, dataviews) => {
    if (!vesselsFiltered?.length) return null

    const reportData = groupBy(vesselsFiltered, 'dataviewId')

    const dataByDataview = dataviews.map((dataview) => {
      const dataviewData = reportData[dataview.id]
        ? Object.values(reportData[dataview.id]).flatMap((v) => v || [])
        : []
      const dataByKey = groupBy(dataviewData, reportGraph)
      return { id: dataview.id, data: dataByKey }
    })

    const allDistributionKeys = uniq(dataByDataview.flatMap(({ data }) => Object.keys(data)))

    const dataviewIds = dataviews.map((d) => d.id)
    const data = allDistributionKeys
      .flatMap((key) => {
        const distributionData = { name: key }
        dataByDataview.forEach(({ id, data }) => {
          distributionData[id] = (data?.[key] || []).length
        })
        if (sum(dataviewIds.map((d) => distributionData[d])) === 0) return []
        return distributionData
      })
      .sort((a, b) => {
        if (EMPTY_API_VALUES.includes(a.name)) return 1
        if (EMPTY_API_VALUES.includes(b.name)) return -1
        return sum(dataviewIds.map((d) => b[d])) - sum(dataviewIds.map((d) => a[d]))
      })

    return { distributionKeys: data.map((d) => d.name), data }
  }
)

export const selectReportVesselsGraphDataGrouped = createSelector(
  [selectReportVesselsGraphData, selectReportDataviewsWithPermissions],
  (reportGraph, dataviews) => {
    if (!reportGraph?.data?.length) return null
    if (reportGraph?.distributionKeys.length <= MAX_CATEGORIES) return reportGraph.data
    const dataviewIds = dataviews.map((d) => d.id)
    const top = reportGraph.data.slice(0, MAX_CATEGORIES)
    const rest = reportGraph.data.slice(MAX_CATEGORIES)
    const others = {
      name: OTHERS_CATEGORY_LABEL,
      ...Object.fromEntries(
        dataviewIds.map((dataview) => [dataview, sum(rest.map((key) => key[dataview]))])
      ),
    }
    return [...top, others]
  }
)
const defaultOthersLabel = []
export const selectReportVesselsGraphDataOthers = createSelector(
  [selectReportVesselsGraphData],
  (reportGraph) => {
    if (!reportGraph?.data?.length) return null
    if (reportGraph?.distributionKeys.length <= MAX_CATEGORIES) return defaultOthersLabel
    const others = reportGraph.data.slice(MAX_CATEGORIES)
    return reportGraph.distributionKeys
      .flatMap((key) => {
        const other = others.find((o) => o.name === key)
        if (!other) return []
        const { name, ...rest } = other
        return { name, value: sum(Object.values(rest)) }
      })
      .sort((a, b) => {
        if (EMPTY_API_VALUES.includes(a.name)) return 1
        if (EMPTY_API_VALUES.includes(b.name)) return -1
        return b.value - a.value
      })
  }
)

const selectReportAreaData = createSelector(
  [selectReportAreaIds, selectAreas],
  (areaIds, areas) => {
    if (!areaIds || !areas) return null
    const { datasetId, areaId } = areaIds
    return areas?.[datasetId]?.detail?.[areaId]?.data
  }
)

export const selectReportPreviewBufferFeature = createSelector(
  [selectReportAreaData, selectReportPreviewBuffer],
  (area, buffer) => {
    const { value, unit } = buffer
    if (!area || !unit || !value) return null
    return getBufferedFeature({ area, value, unit })
  }
)

export const selectReportBufferArea = createSelector(
  [selectReportAreaData, selectUrlBufferUnitQuery, selectUrlBufferValueQuery],
  (area, unit, value) => {
    if (!area || !unit || !value) return null
    const bufferedArea = getBufferedArea({ area, value, unit }) as Area
    if (bufferedArea?.geometry) {
      const bounds = wrapGeometryBbox(bufferedArea.geometry as MultiPolygon)
      // bbox is needed inside Area geometry to computeTimeseries
      // fishing-map/features/reports/reports-timeseries.hooks.ts
      bufferedArea.geometry.bbox = bounds
    }
    return bufferedArea
  }
)

export const selectReportBufferFeature = createSelector(
  [selectReportAreaData, selectUrlBufferUnitQuery, selectUrlBufferValueQuery],
  (area, unit, value) => {
    if (!area || !unit || !value) return null
    return getBufferedFeature({ area, value, unit })
  }
)

export const selectReportArea = createSelector(
  [
    selectReportAreaData,
    selectUrlBufferUnitQuery,
    selectUrlBufferValueQuery,
    selectReportBufferArea,
  ],
  (area, unit, value, bufferedArea) => {
    if (!area) return null
    if (!unit || !value) return area
    return bufferedArea
  }
)
