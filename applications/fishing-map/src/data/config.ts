import { SelectOption } from '@globalfishingwatch/ui-components'
import { TimebarEvents, TimebarGraphs, TimebarVisualisations } from 'types'

export const API_GATEWAY = process.env.API_GATEWAY || process.env.REACT_APP_API_GATEWAY || ''

// TODO use it to retrieve it and store in workspace.default in deploy
export const DEFAULT_VERSION = 'v1'
export const APP_NAME = 'fishing-map'
export const PUBLIC_SUFIX = 'public'

// used when no url data and no workspace data
const end = new Date(2019, 11, 31).toISOString()
export const DEFAULT_WORKSPACE = {
  latitude: 7,
  longitude: -75,
  zoom: 3,
  query: undefined,
  sidebarOpen: true,
  start: new Date(2019, 0, 1).toISOString(),
  end: end,
  availableStart: new Date(2012, 0, 1).toISOString(),
  availableEnd: end,
  dataviewInstances: undefined,
  timebarVisualisation: TimebarVisualisations.Heatmap,
  timebarEvents: TimebarEvents.None,
  timebarGraph: TimebarGraphs.None,
  bivariate: false,
  version: DEFAULT_VERSION,
}

// Params to use replace instead of push for router history to make navigation easier
export const REPLACE_URL_PARAMS = ['latitude', 'longitude', 'zoom']

export const sources: SelectOption[] = [
  {
    id: 'ais',
    label: 'AIS',
  },
  {
    id: 'vms-chile',
    label: 'VMS Chile',
  },
  {
    id: 'vms-indonesia',
    label: 'VMS Indonesia',
  },
  {
    id: 'vms-panama',
    label: 'VMS Panama',
  },
]

// TODO translate this
export const TIMEBAR_EVENT_OPTIONS: SelectOption[] = [
  {
    id: 'all',
    label: 'All events',
  },
  {
    id: 'fishing',
    label: 'Fishing',
  },
  {
    id: 'encounters',
    label: 'Encounters',
  },
  {
    id: 'loitering',
    label: 'Loitering',
  },
  {
    id: 'ports',
    label: 'Port visits',
  },
  {
    id: 'none',
    label: 'None',
  },
]

// TODO translate this
export const TIMEBAR_GRAPH_OPTIONS: SelectOption[] = [
  {
    id: 'speed',
    label: 'Speed',
  },
  {
    id: 'depth',
    label: 'Depth (Coming soon)',
    disabled: true,
  },
  {
    id: 'none',
    label: 'None',
  },
]
