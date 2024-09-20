import { REPORT_VESSELS_PER_PAGE } from 'data/config'
import { VesselGroupReportState } from 'features/vessel-groups/vessel-groups.types'

export const OTHER_CATEGORY_LABEL = 'OTHER'

export const DEFAULT_VESSEL_GROUP_REPORT_STATE: VesselGroupReportState = {
  viewOnlyVesselGroup: true,
  vGRSection: 'vessels',
  vGRVesselsSubsection: 'flag',
  vGRActivitySubsection: 'fishing-effort',
  vGREventsSubsection: 'encounter',
  vGREventsVesselsProperty: 'flag',
  vGRVesselPage: 0,
  vGRVesselsResultsPerPage: REPORT_VESSELS_PER_PAGE,
  vGREventsVesselPage: 0,
  vGREventsResultsPerPage: REPORT_VESSELS_PER_PAGE,
  vGRVesselsOrderProperty: 'shipname',
  vGRVesselsOrderDirection: 'asc',
}
