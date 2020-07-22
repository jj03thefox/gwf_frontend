import React, { useEffect } from 'react'
import Button from '@globalfishingwatch/ui-components/dist/button'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { useLocationConnect } from 'routes/routes.hook'
import { useWorkspacesConnect } from 'features/workspaces/workspaces.hook'
import { useModalConnect } from 'features/modal/modal.hooks'
import DataviewGraphPanel from 'features/dataviews/DataviewGraphPanel'
import { TEST_WORSPACE_DATAVIEWS } from 'data/data'
import ResumeColumn from './ResumeColumn'
import styles from './WorkspaceEditor.module.css'

export default function WorkspaceEditor(): React.ReactElement | null {
  const { workspace, fetchWorkspaceById } = useWorkspacesConnect()
  const { showModal } = useModalConnect()
  const { payload } = useLocationConnect()

  useEffect(() => {
    if (payload && payload.workspaceId) {
      fetchWorkspaceById(payload.workspaceId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.container}>
      <ResumeColumn />
      <div className={styles.content}>
        <div className={styles.infoPanel}>
          <div className={styles.title}>
            <h1>{workspace ? workspace.label : 'loading'}</h1>
            <IconButton icon="edit" />
          </div>
          <div className={styles.area}>
            <label>Area</label>
            <p>xxx km2</p>
          </div>
          <div className={styles.description}>
            <div>
              <label>Description</label>
              <p>{workspace ? workspace.description : 'loading'}</p>
            </div>
            <IconButton icon="edit" />
          </div>
        </div>
        {TEST_WORSPACE_DATAVIEWS.map((dataview) => (
          <DataviewGraphPanel dataview={dataview} key={dataview.id} />
        ))}
        <div className={styles.footer}>
          <Button onClick={() => showModal('newDataview')}>Add new dataview</Button>
        </div>
      </div>
    </div>
  )
}
