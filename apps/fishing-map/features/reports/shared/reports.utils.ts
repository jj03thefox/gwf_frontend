import { groupBy } from 'lodash'
import type { ResponsiveVisualizationData } from '@globalfishingwatch/responsive-visualizations'
import type {
  VGRSubsection,
  VGREventsVesselsProperty,
} from 'features/vessel-groups/vessel-groups.types'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import { MAX_CATEGORIES } from '../areas/area-reports.config'
import type { ReportVesselWithDatasets } from '../areas/area-reports.selectors'
import type { EventsStatsVessel } from '../ports/ports-report.slice'
import { OTHER_CATEGORY_LABEL } from '../vessel-groups/vessel-group-report.config'
import type { VesselGroupVesselTableParsed } from '../vessel-groups/vessels/vessel-group-report-vessels.selectors'
import type { ReportVesselGraph } from '../areas/area-reports.types'

type VesselVisualizationData = ResponsiveVisualizationData<
  'individual',
  { name: string; values: any[] }
>

export function getVesselIndividualGroupedData(
  vessels: (EventsStatsVessel | VesselGroupVesselTableParsed | ReportVesselWithDatasets)[],
  groupByProperty: VGRSubsection | VGREventsVesselsProperty | ReportVesselGraph
) {
  if (!vessels?.length) {
    return []
  }
  let vesselsGrouped = {}
  switch (groupByProperty) {
    case 'flag': {
      vesselsGrouped = groupBy(
        vessels,
        (vessel) =>
          (vessel as VesselGroupVesselTableParsed).flagTranslatedClean ||
          (vessel as EventsStatsVessel).flagTranslated ||
          (vessel as EventsStatsVessel).flag
      )
      break
    }
    case 'shiptype':
    case 'shiptypes': {
      vesselsGrouped = groupBy(vessels, (vessel) =>
        (vessel as VesselGroupVesselTableParsed).vesselType
          ? (vessel as VesselGroupVesselTableParsed).vesselType.split(', ')[0]
          : (vessel as EventsStatsVessel).shiptypes[0]
      )
      break
    }
    case 'geartype':
    case 'geartypes': {
      vesselsGrouped = groupBy(vessels, (vessel) => vessel.geartype?.split(', ')[0])
      break
    }
    case 'source': {
      vesselsGrouped = groupBy(vessels, (vessel) => (vessel as VesselGroupVesselTableParsed).source)
      break
    }
  }
  const orderedGroups: VesselVisualizationData = Object.entries(vesselsGrouped)
    .map(([key, value]) => ({
      name: key,
      values: value as any[],
    }))
    .sort((a, b) => {
      return b.values.length - a.values.length
    })
  const groupsWithoutOther: VesselVisualizationData = []
  const otherGroups: VesselVisualizationData = []
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
            values: otherGroups.flatMap((group) => group.values),
          },
        ]
      : groupsWithoutOther
  if (allGroups.length <= MAX_CATEGORIES) {
    return allGroups as VesselVisualizationData
  }
  const firstGroups = allGroups.slice(0, MAX_CATEGORIES)
  const restOfGroups = allGroups.slice(MAX_CATEGORIES)

  return [
    ...firstGroups,
    {
      name: OTHER_CATEGORY_LABEL,
      values: restOfGroups.flatMap((group) => group.values),
    },
  ] as VesselVisualizationData
}
