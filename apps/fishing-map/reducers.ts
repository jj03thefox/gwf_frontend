import { combineReducers } from '@reduxjs/toolkit'
import { dataviewStatsApi } from 'queries/stats-api'
import { vesselEventsApi } from 'queries/vessel-events-api'
import { vesselInsightApi } from 'queries/vessel-insight-api'
import { vesselSearchApi } from 'queries/search-api'
import { reportEventsStatsApi } from 'queries/report-events-stats-api'
import areasReducer from 'features/areas/areas.slice'
import bigQueryReducer from 'features/bigquery/bigquery.slice'
import connectedRoutes from 'routes/routes'
import datasetsReducer from 'features/datasets/datasets.slice'
import dataviewsReducer from 'features/dataviews/dataviews.slice'
import debugReducer from 'features/debug/debug.slice'
import descriptionReducer from 'routes/description.reducer'
import downloadActivityReducer from 'features/download/downloadActivity.slice'
import downloadTrackReducer from 'features/download/downloadTrack.slice'
import editorReducer from 'features/editor/editor.slice'
import hintsReducer from 'features/help/hints.slice'
import mapControlsReducer from 'features/map/controls/map-controls.slice'
import mapReducer from 'features/map/map.slice'
import modalsReducer from 'features/modals/modals.slice'
import portsReportReducer from 'features/reports/ports/ports-report.slice'
import regionsReducer from 'features/regions/regions.slice'
import reportReducer from 'features/reports/activity/reports-activity.slice'
import reportsReducer from 'features/reports/areas/area-reports.slice'
import resourcesReducer from 'features/resources/resources.slice'
import searchReducer from 'features/search/search.slice'
import timebarReducer from 'features/timebar/timebar.slice'
import titleReducer from 'routes/title.reducer'
import userReducer from 'features/user/user.slice'
import vesselGroupReportReducer from 'features/reports/vessel-groups/vessel-group-report.slice'
import vesselGroupsModalReducer from 'features/vessel-groups/vessel-groups-modal.slice'
import vesselGroupsReducer from 'features/vessel-groups/vessel-groups.slice'
import vesselReducer from 'features/vessel/vessel.slice'
import workspaceReducer from 'features/workspace/workspace.slice'
import workspacesReducer from 'features/workspaces-list/workspaces-list.slice'

export const rootReducer = combineReducers({
  [dataviewStatsApi.reducerPath]: dataviewStatsApi.reducer,
  [vesselSearchApi.reducerPath]: vesselSearchApi.reducer,
  [vesselEventsApi.reducerPath]: vesselEventsApi.reducer,
  [vesselInsightApi.reducerPath]: vesselInsightApi.reducer,
  [reportEventsStatsApi.reducerPath]: reportEventsStatsApi.reducer,
  areas: areasReducer,
  bigQuery: bigQueryReducer,
  datasets: datasetsReducer,
  dataviews: dataviewsReducer,
  debug: debugReducer,
  description: descriptionReducer,
  downloadActivity: downloadActivityReducer,
  downloadTrack: downloadTrackReducer,
  editor: editorReducer,
  hints: hintsReducer,
  location: connectedRoutes.reducer,
  map: mapReducer,
  mapControls: mapControlsReducer,
  modals: modalsReducer,
  portsReport: portsReportReducer,
  regions: regionsReducer,
  report: reportReducer,
  reports: reportsReducer,
  resources: resourcesReducer,
  search: searchReducer,
  timebar: timebarReducer,
  title: titleReducer,
  user: userReducer,
  vessel: vesselReducer,
  vesselGroupReport: vesselGroupReportReducer,
  vesselGroupModal: vesselGroupsModalReducer,
  vesselGroups: vesselGroupsReducer,
  workspace: workspaceReducer,
  workspaces: workspacesReducer,
})

export type RootState = ReturnType<typeof rootReducer>
