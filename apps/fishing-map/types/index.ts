import type { BaseUrlWorkspace, UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { EventType } from '@globalfishingwatch/api-types'
import type {
  DrawFeatureType,
  FourwingsVisualizationMode,
  HEATMAP_ID,
  HEATMAP_LOW_RES_ID,
  RulerData,
} from '@globalfishingwatch/deck-layers'
import type { MapAnnotation } from 'features/map/overlays/annotations/annotations.types'
import type { AreaReportState, AreaReportStateProperty } from 'features/reports/areas/area-reports.types'
import type { VesselProfileState, VesselProfileStateProperty } from 'features/vessel/vessel.types'
import type {
  VesselGroupReportState,
  VesselGroupReportStateProperty,
} from 'features/vessel-groups/vessel-groups.types'
import type { VesselSearchState, VesselSearchStateProperty } from 'features/search/search.types'
import type {
  PortsReportState,
  PortsReportStateProperty,
} from 'features/reports/ports/ports-report.types'
export { Locale } from '@globalfishingwatch/api-types'

type WorkspaceViewportParam = 'latitude' | 'longitude' | 'zoom'
type WorkspaceTimeRangeParam = 'start' | 'end'
export type BufferUnit = 'nauticalmiles' | 'kilometers'
export type BufferOperation = 'dissolve' | 'difference'

export type WorkspaceStateProperty = keyof WorkspaceState
type AppStateProperty = keyof AppState

type AnyStateProperty = WorkspaceStateProperty | AppStateProperty

export type WorkspaceParam =
  | WorkspaceViewportParam
  | WorkspaceTimeRangeParam
  | AnyStateProperty
  | AreaReportStateProperty
  | VesselProfileStateProperty
  | VesselGroupReportStateProperty
  | PortsReportStateProperty
  | VesselSearchStateProperty

export type WorkspaceViewport = Record<WorkspaceViewportParam, number>
type WorkspaceTimeRange = Record<WorkspaceTimeRangeParam, string>

type BivariateDataviews = [string, string]

export interface WorkspaceState extends BaseUrlWorkspace {
  activityVisualizationMode?: FourwingsVisualizationMode
  detectionsVisualizationMode?: FourwingsVisualizationMode
  environmentVisualizationMode?: typeof HEATMAP_ID | typeof HEATMAP_LOW_RES_ID
  dataviewInstances?: UrlDataviewInstance[]
  bivariateDataviews?: BivariateDataviews
  mapAnnotations?: MapAnnotation[]
  mapAnnotationsVisible?: boolean
  mapRulers?: RulerData[]
  mapRulersVisible?: boolean
  daysFromLatest?: number // use latest day as endAt minus the number of days set here
  readOnly?: boolean
  sidebarOpen?: boolean
  timebarGraph?: TimebarGraphs
  timebarSelectedEnvId?: string
  timebarSelectedVGId?: string
  timebarVisualisation?: TimebarVisualisations
  visibleEvents?: VisibleEvents
}

export type AnyWorkspaceState = Partial<
  WorkspaceState & AreaReportState & VesselProfileState & VesselGroupReportState & PortsReportState
>

type RedirectParam = {
  'access-token'?: string
}

export enum UserTab {
  Info = 'info',
  Workspaces = 'workspaces',
  Datasets = 'datasets',
  Reports = 'reports',
  VesselGroups = 'vesselGroups',
}

export type AppState = {
  userTab?: UserTab
  mapDrawing?: DrawFeatureType | boolean
  mapDrawingEditId?: string
}

export type QueryParams = Partial<WorkspaceViewport> &
  WorkspaceState &
  Partial<WorkspaceTimeRange> &
  Partial<VesselProfileState> &
  Partial<AreaReportState> &
  Partial<VesselGroupReportState> &
  Partial<PortsReportState> &
  AppState &
  RedirectParam &
  VesselSearchState

export type QueryParam = keyof QueryParams

export enum TimebarVisualisations {
  HeatmapActivity = 'heatmap',
  HeatmapDetections = 'heatmapDetections',
  Vessel = 'vessel',
  VesselGroup = 'vesselGroup',
  Environment = 'environment',
}

type VisibleEvents = EventType[] | 'all' | 'none'

export enum TimebarGraphs {
  Speed = 'speed',
  Depth = 'elevation',
  None = 'none',
}

// minX, minY, maxX, maxY
export type Bbox = [number, number, number, number]

export type MapCoordinates = {
  latitude: number
  longitude: number
  zoom: number
  transitionDuration?: number
}
