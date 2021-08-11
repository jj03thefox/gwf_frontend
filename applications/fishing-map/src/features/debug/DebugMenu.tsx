import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch } from '@globalfishingwatch/ui-components'
import { selectLocationQuery } from 'routes/routes.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectBasemapDataviewInstance } from 'features/dataviews/dataviews.selectors'
import { DebugOption, selectDebugOptions, toggleOption } from './debug.slice'
import styles from './DebugMenu.module.css'

const DebugMenu: React.FC = () => {
  const dispatch = useDispatch()
  const debugOptions = useSelector(selectDebugOptions)
  const locationQuery = useSelector(selectLocationQuery)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const basemapDataviewInstance = useSelector(selectBasemapDataviewInstance)

  useEffect(() => {
    if (basemapDataviewInstance.config?.labels === true && debugOptions.basemapLabels === false) {
      dispatch(toggleOption(DebugOption.BasemapLabels))
    }
  }, [basemapDataviewInstance, debugOptions, dispatch])

  return (
    <div className={styles.row}>
      <section>
        <div className={styles.header}>
          <Switch
            active={debugOptions.blob}
            onClick={() => dispatch(toggleOption(DebugOption.Blob))}
          />
          <label htmlFor="option_blob">[experimental] Smooth heatmap style</label>
        </div>
        <p>
          Render fishing layer with a smoother rendering style. Only works when a single fishing
          layer is shown. Will disable interaction on this layer.
        </p>
        <div className={styles.header}>
          <Switch
            active={debugOptions.extruded}
            onClick={() => dispatch(toggleOption(DebugOption.Extruded))}
          />
          <label htmlFor="option_extruded">[experimental] Stacked 3D bars</label>
        </div>
        <p>Renders fishing activity as stacked 3D bars. Will disable interaction on this layer.</p>
        <div className={styles.header}>
          <Switch
            active={debugOptions.debug}
            onClick={() => dispatch(toggleOption(DebugOption.Debug))}
          />
          <label htmlFor="option_debug">Debug tiles</label>
        </div>
        <p>Displays info on tiles useful for debugging.</p>
        <div className={styles.header}>
          <Switch
            active={debugOptions.thinning}
            onClick={() => dispatch(toggleOption(DebugOption.Thinning))}
          />
          <label htmlFor="option_debug">Track thinning</label>
        </div>
        <p>Don't send any thinning param to tracks API to debug original resolution</p>
        <div className={styles.header}>
          <Switch
            active={debugOptions.basemapLabels}
            onClick={() => {
              if (basemapDataviewInstance?.id) {
                upsertDataviewInstance({
                  id: basemapDataviewInstance.id as string,
                  config: {
                    labels: !debugOptions.basemapLabels,
                  },
                })
              }
              dispatch(toggleOption(DebugOption.BasemapLabels))
            }}
          />
          <label htmlFor="option_debug">Basemap labels</label>
        </div>
        <p>Show or hide basemap labels</p>
      </section>
      <hr className={styles.separation} />
      <section>
        <div className={styles.header}>
          <label>Current URL workspace settings</label>
        </div>
        <textarea
          className={styles.editor}
          defaultValue={JSON.stringify(locationQuery, undefined, 2)}
        />
      </section>
    </div>
  )
}

export default DebugMenu
