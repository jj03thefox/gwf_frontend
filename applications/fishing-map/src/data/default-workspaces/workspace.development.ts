import { Workspace } from '@globalfishingwatch/api-types'
import { APP_NAME, DEFAULT_TIME_RANGE, DEFAULT_VIEWPORT } from 'data/config'
import {
  WorkspaceCategories,
  DEFAULT_WORKSPACE_ID,
  DEFAULT_EEZ_DATAVIEW_ID,
  DEFAULT_MPA_DATAVIEW_ID,
  DEFAULT_RFMO_DATAVIEW_ID,
  DEFAULT_BASEMAP_DATAVIEW_ID,
  DEFAULT_FISHING_DATAVIEW_ID,
  DEFAULT_PRESENCE_DATAVIEW_ID,
  DEFAULT_VIIRS_DATAVIEW_ID,
  DEFAULT_CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_ID,
  DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID,
} from 'data/workspaces'
import { WorkspaceState } from 'types'

const workspace: Workspace<WorkspaceState> = {
  id: DEFAULT_WORKSPACE_ID,
  app: APP_NAME,
  name: 'Default public Fishing Map workspace',
  description: DEFAULT_WORKSPACE_ID,
  category: WorkspaceCategories.FishingActivity,
  startAt: DEFAULT_TIME_RANGE.start,
  endAt: DEFAULT_TIME_RANGE.end,
  viewport: DEFAULT_VIEWPORT,
  public: true,
  state: {
    // query: 'pepe',
    // bivariate: true,
    // sidebarOpen: false,
    // timebarVisualisation: '',
    // visibleEvents: 'all',
    // timebarGraph: '',
  },
  ownerId: 0,
  dataviews: [],
  dataviewInstances: [
    {
      id: DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID,
      dataviewId: DEFAULT_BASEMAP_DATAVIEW_ID,
    },
    {
      id: 'fishing-ais',
      config: {
        datasets: ['public-global-fishing-effort:v20201001'],
      },
      dataviewId: DEFAULT_FISHING_DATAVIEW_ID,
    },
    {
      // This id is used for highlighting the dataview with a popup on the right
      // update it here if you want to show it again or go to
      // applications/fishing-map/src/features/workspace/highlight-panel/highlight-panel.content.ts
      // and update the `dataviewInstanceId`
      id: 'highlight-vms-with-ecuador',
      config: {
        color: '#FFAA0D',
        colorRamp: 'orange',
        datasets: [
          'public-chile-fishing-effort:v20200331',
          'public-indonesia-fishing-effort:v20200320',
          'public-panama-fishing-effort:v20200331',
          'public-peru-fishing-effort:v20200324',
          'public-ecuador-fishing-effort:v20210612',
        ],
      },
      dataviewId: DEFAULT_FISHING_DATAVIEW_ID,
    },
    {
      id: 'presence',
      config: {
        color: '#FF64CE',
        colorRamp: 'magenta',
      },
      dataviewId: DEFAULT_PRESENCE_DATAVIEW_ID,
    },
    {
      id: 'viirs',
      config: {
        color: '#FFEA00',
        colorRamp: 'yellow',
        visible: false,
      },
      dataviewId: DEFAULT_VIIRS_DATAVIEW_ID,
      datasetsConfig: [],
    },
    {
      id: 'encounter-events',
      dataviewId: DEFAULT_CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_ID,
      config: {
        visible: false,
      },
    },
    {
      id: 'context-layer-eez',
      config: {
        color: '#069688',
        visible: false,
      },
      dataviewId: DEFAULT_EEZ_DATAVIEW_ID,
    },
    // {
    //   id: 'context-layer-mpa-no-take',
    //   config: {
    //     color: '#F4511F',
    //     visible: false,
    //   },
    //   dataviewId: DEFAULT_MPA_NO_TAKE_DATAVIEW_ID,
    // },
    // {
    //   id: 'context-layer-mpa-restricted',
    //   config: {
    //     color: '#F09300',
    //     visible: false,
    //   },
    //   dataviewId: DEFAULT_MPA_RESTRICTED_DATAVIEW_ID,
    // },
    {
      id: 'context-layer-mpa',
      config: {
        color: '#1AFF6B',
        visible: false,
      },
      dataviewId: DEFAULT_MPA_DATAVIEW_ID,
    },
    {
      id: 'context-layer-rfmo',
      config: {
        color: '#6b67e5',
        visible: false,
      },
      dataviewId: DEFAULT_RFMO_DATAVIEW_ID,
    },
    // {
    //   id: 'context-layer-wpp-nri',
    //   config: {
    //     visible: false,
    //   },
    //   dataviewId: 96,
    // },
    // {
    //   id: 'context-layer-high-seas',
    //   config: {
    //     visible: false,
    //   },
    //   dataviewId: 97,
    // },
  ],
}

export default workspace
