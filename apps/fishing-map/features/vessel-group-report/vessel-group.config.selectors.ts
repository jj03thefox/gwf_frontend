import { createSelector } from '@reduxjs/toolkit'
import { selectQueryParam } from 'routes/routes.selectors'
import {
  VesselGroupReportState,
  VesselGroupReportStateProperty,
} from 'features/vessel-groups/vessel-groups.types'
import { DEFAULT_VESSEL_GROUP_REPORT_STATE } from './vessel-group-report.config'

type VesselGroupReportProperty<P extends VesselGroupReportStateProperty> =
  Required<VesselGroupReportState>[P]
function selectVGRStateProperty<P extends VesselGroupReportStateProperty>(property: P) {
  return createSelector(
    [selectQueryParam(property)],
    (urlProperty): VesselGroupReportProperty<P> => {
      if (urlProperty !== undefined) return urlProperty
      return DEFAULT_VESSEL_GROUP_REPORT_STATE[property] as VesselGroupReportProperty<P>
    }
  )
}

export const selectViewOnlyVesselGroup = selectVGRStateProperty('viewOnlyVesselGroup')
export const selectVGRSection = selectVGRStateProperty('vGRSection')
export const selectVGRVesselsSubsection = selectVGRStateProperty('vGRVesselsSubsection')
export const selectVGRActivitySubsection = selectVGRStateProperty('vGRActivitySubsection')
export const selectVGREventsSubsection = selectVGRStateProperty('vGREventsSubsection')
export const selectVGREventsVesselsProperty = selectVGRStateProperty('vGREventsVesselsProperty')

export const selectVGRVesselFilter = selectVGRStateProperty('vGRVesselFilter')
export const selectVGRVesselPage = selectVGRStateProperty('vGRVesselPage')
export const selectVGRResultsPerPage = selectVGRStateProperty('vGRResultsPerPage')
export const selectVGRVesselsOrderProperty = selectVGRStateProperty('vGRVesselsOrderProperty')
export const selectVGRVesselsOrderDirection = selectVGRStateProperty('vGRVesselsOrderDirection')

export const selectVGREventsVesselFilter = selectVGRStateProperty('vGREventsVesselFilter')
export const selectVGREventsVesselPage = selectVGRStateProperty('vGREventsVesselPage')
export const selectVGREventsResultsPerPage = selectVGRStateProperty('vGREventsResultsPerPage')
