import { get } from 'lodash'
import { VesselRegistryAuthorization, VesselRegistryOwner } from '@globalfishingwatch/api-types'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { getUTCDateTime } from 'utils/dates'
import { VesselLastIdentity } from 'features/search/search.slice'

export type CsvConfig = {
  label: string
  accessor: string
  transform?: (value: any) => any
}

const parseCSVString = (string: string | number) => {
  return string?.toString()?.replaceAll(',', '-')
}
const parseCSVDate = (date: number) => getUTCDateTime(date).toISO()
const parseCSVList = (value: string[]) => value?.join('|')

const parseRegistryOwners = (owners: VesselRegistryOwner[]) => {
  return parseCSVList(
    owners?.map((owner) => {
      return `${owner.name}-${owner.flag} (${owner.dateFrom}-${owner.dateTo})`
    })
  )
}

const parseRegistryAuthorizations = (authorizations: VesselRegistryAuthorization[]) => {
  return parseCSVList(
    authorizations?.map((authorization) => {
      return `${authorization.sourceCode} (${authorization.dateFrom}-${authorization.dateTo})`
    })
  )
}

export const objectArrayToCSV = (
  data: unknown[],
  csvConfig: CsvConfig[],
  getter = get as (any: any, path: string) => any
) => {
  const keys = csvConfig.map((c) => c.label).join(',')
  const values = data.map((d) => {
    return csvConfig
      .map(({ accessor, transform }) => {
        const value = getter(d, accessor)
        const transformedValue = transform ? transform(value) : value
        return transformedValue ? parseCSVString(transformedValue) : ''
      })
      .join(',')
  })
  return [keys, values.join('\n')].join('\n')
}

export const VESSEL_CSV_CONFIG: CsvConfig[] = [
  // TODO translate labels
  { label: 'id', accessor: 'id' },
  { label: 'flag', accessor: 'flag' },
  { label: 'ssvid', accessor: 'imo' },
  { label: 'shipname', accessor: 'nShipname' },
  { label: 'shiptype', accessor: 'shiptype' },
  { label: 'geartype', accessor: 'geartype', transform: parseCSVList },
  { label: 'callsign', accessor: 'callsign' },
  { label: 'lengthM', accessor: 'lengthM' },
  { label: 'tonnageGt', accessor: 'tonnageGt' },
  { label: 'transmissionStart', accessor: 'transmissionDateFrom', transform: parseCSVDate },
  { label: 'transmissionEnd', accessor: 'transmissionDateTo', transform: parseCSVDate },
  { label: 'identitySource', accessor: 'identitySource' },
  { label: 'sourceCode', accessor: 'sourceCode', transform: parseCSVList },
  { label: 'owner', accessor: 'registryOwners', transform: parseRegistryOwners },
  {
    label: 'authorization',
    accessor: 'registryAuthorizations',
    transform: parseRegistryAuthorizations,
  },
]

export const parseVesselToCSV = (vessel: VesselLastIdentity) => {
  return objectArrayToCSV([vessel], VESSEL_CSV_CONFIG)
}

export const EVENTS_CSV_CONFIG: CsvConfig[] = [
  { label: 'type', accessor: 'type' },
  {
    label: 'start',
    accessor: 'start',
    transform: parseCSVDate,
  },
  {
    label: 'end',
    accessor: 'end',
    transform: parseCSVDate,
  },
  { label: 'voyage', accessor: 'voyage' },
  { label: 'latitude', accessor: 'position.lat' },
  { label: 'longitude', accessor: 'position.lon' },
  { label: 'portVisitName', accessor: 'port_visit.intermediateAnchorage.name' },
  { label: 'portVisitFlag', accessor: 'port_visit.intermediateAnchorage.flag' },
  { label: 'encounterAuthorization', accessor: 'encounter.mainVesselAuthorizationStatus' },
  { label: 'encounteredVesselId', accessor: 'encounter.vessel.id' },
  { label: 'encounteredVesselName', accessor: 'encounter.vessel.name' },
  { label: 'encounteredVesselFlag', accessor: 'encounter.vessel.flag' },
  {
    label: 'encounteredVesselAuthorization',
    accessor: 'encounter.encounteredVesselAuthorizationStatus',
  },
]

export const parseEventsToCSV = (events: ActivityEvent[]) => {
  return objectArrayToCSV(events, EVENTS_CSV_CONFIG)
}
