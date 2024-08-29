import { createSelector } from '@reduxjs/toolkit'
import { VesselGroupReportState, VesselGroupReportStateProperty } from 'types'
import { selectQueryParam } from 'routes/routes.selectors'
import { DEFAULT_VESSEL_GROUP_REPORT_STATE } from 'features/vessel/vessel.config'

type VesselGroupReportProperty<P extends VesselGroupReportStateProperty> =
  Required<VesselGroupReportState>[P]
function selectVesselGroupReportStateProperty<P extends VesselGroupReportStateProperty>(
  property: P
) {
  return createSelector(
    [selectQueryParam(property)],
    (urlProperty): VesselGroupReportProperty<P> => {
      if (urlProperty !== undefined) return urlProperty
      return DEFAULT_VESSEL_GROUP_REPORT_STATE[property] as VesselGroupReportProperty<P>
    }
  )
}

export const selectViewOnlyVesselGroup = selectVesselGroupReportStateProperty('viewOnlyVesselGroup')
export const selectVesselGroupReportSection = selectVesselGroupReportStateProperty(
  'vesselGroupReportSection'
)
export const selectVesselGroupReportVesselsSubsection = selectVesselGroupReportStateProperty(
  'vesselGroupReportVesselsSubsection'
)
export const selectVesselGroupReportActivitySubsection = selectVesselGroupReportStateProperty(
  'vesselGroupReportActivitySubsection'
)
export const selectVesselGroupReportEventsSubsection = selectVesselGroupReportStateProperty(
  'vesselGroupReportEventsSubsection'
)

export const selectVesselGroupReportVesselPage = selectVesselGroupReportStateProperty(
  'vesselGroupReportVesselPage'
)
export const selectVesselGroupReportResultsPerPage = selectVesselGroupReportStateProperty(
  'vesselGroupReportResultsPerPage'
)
export const selectVesselGroupReportVesselsOrderProperty = selectVesselGroupReportStateProperty(
  'vesselGroupReportVesselsOrderProperty'
)
export const selectVesselGroupReportVesselsOrderDirection = selectVesselGroupReportStateProperty(
  'vesselGroupReportVesselsOrderDirection'
)
