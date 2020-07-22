import { createSelector } from '@reduxjs/toolkit'
import { Generators } from '@globalfishingwatch/layer-composer'
import { selectAll, selectById } from 'features/areas-of-interest/areas-of-interest.slice'
import { selectCurrentWorkspace } from 'features/workspaces/workspaces.slice'

export const getCurrentAOI = createSelector(
  [(state) => state, selectCurrentWorkspace],
  (state, currentWorkspace) => {
    if (!currentWorkspace) return
    return selectById(state, currentWorkspace.aoiId)
  }
)

export const getAOIGeneratorsConfig = createSelector(
  [selectAll, selectCurrentWorkspace],
  (aoiList, currentWorkspace) => {
    if (!aoiList) return
    return aoiList
      .filter((aoi) => !currentWorkspace || currentWorkspace.aoiId === aoi.id)
      .map((aoi) => {
        return {
          type: Generators.Type.GL,
          id: `aoi-${aoi.id}`,
          sources: [
            {
              type: 'geojson',
              data: aoi.geometry,
            },
          ],
          layers: [
            {
              type: 'line',
              paint: {
                'line-color': 'red',
              },
            },
          ],
        }
      }) as Generators.GlGeneratorConfig[]
  }
)
