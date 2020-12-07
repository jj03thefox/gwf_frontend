import React, { useCallback } from 'react'
import Link from 'redux-first-router-link'
import { fitBounds } from 'viewport-mercator-project'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Button from '@globalfishingwatch/ui-components/dist/button'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { AOI } from '@globalfishingwatch/api-types'
import { useModalConnect } from 'features/modal/modal.hooks'
import { WORKSPACE_EDITOR } from 'routes/routes'
import { useMapboxRef } from 'features/map/map.context'
import styles from './Workspaces.module.css'
import { useWorkspacesConnect, useWorkspacesAPI } from './workspaces.hook'
import { WorkpaceExtended } from './workspaces.slice'

function Workspaces(): React.ReactElement {
  const mapRef = useMapboxRef()
  const { showModal } = useModalConnect()
  const { deleteWorkspace } = useWorkspacesAPI()
  const {
    workspaceStatus,
    workspaceStatusId,
    workspacesList,
    workspacesSharedList,
  } = useWorkspacesConnect()

  const onDeleteClick = useCallback(
    (workspace: WorkpaceExtended) => {
      const confirmation = window.confirm(
        `Are you sure you want to permanently delete this workspace?\n${workspace.name}`
      )
      if (confirmation) {
        deleteWorkspace(workspace.id)
      }
    },
    [deleteWorkspace]
  )

  if (workspaceStatus === 'loading') {
    return <Spinner />
  }

  return (
    <div className={styles.container}>
      <h1 className="screen-reader-only">Workspaces</h1>
      <label>Your workspaces</label>
      <ul>
        {workspacesList && workspacesList.length ? (
          workspacesList.map((workspace) => {
            if (!(workspace.aoi as AOI)?.bbox) return null
            const [minLng, minLat, maxLng, maxLat] = (workspace.aoi as AOI).bbox
            let query = {}
            if (minLng && minLat && maxLng && maxLat) {
              try {
                const { latitude, longitude, zoom } = fitBounds({
                  bounds: [
                    [minLng, minLat],
                    [maxLng, maxLat],
                  ],
                  width: mapRef.current?._width,
                  height: mapRef.current?._height,
                  padding: 60,
                })
                if (latitude && longitude && zoom) {
                  query = { latitude, longitude, zoom }
                }
              } catch (e) {
                console.warn(e)
              }
            }
            return (
              <li className={styles.listItem} key={workspace.id}>
                <Link
                  className={styles.titleLink}
                  to={{
                    type: WORKSPACE_EDITOR,
                    payload: { workspaceId: workspace.id },
                    query,
                  }}
                >
                  <span className={styles.colorBar} style={{ backgroundColor: workspace.color }} />
                  {workspace.name}
                </Link>
                {workspace.description && (
                  <IconButton icon="info" tooltip={workspace.description} />
                )}
                <Link to={{ type: WORKSPACE_EDITOR, payload: { workspaceId: workspace.id } }}>
                  <IconButton icon="edit" tooltip="Edit Workspace" />
                </Link>
                {/* <IconButton icon="publish" tooltip="Publish workspace" /> */}
                <IconButton
                  icon="share"
                  tooltip="Share Workspace"
                  onClick={() => {
                    showModal('shareWorkspace')
                  }}
                />
                <IconButton
                  icon="delete"
                  type="warning"
                  loading={
                    workspaceStatus === 'loading.delete' && workspaceStatusId === workspace.id
                  }
                  onClick={() => onDeleteClick(workspace)}
                />
              </li>
            )
          })
        ) : (
          <li className={styles.listPlaceholder}>There are no workspaces yet</li>
        )}
      </ul>
      <Button
        onClick={() => {
          showModal('newWorkspace')
        }}
        className={styles.rightSide}
      >
        Create new workspace
      </Button>
      <label>Workspaces shared with you</label>
      {workspacesSharedList.map((workspace) => (
        <div className={styles.listItem} key={workspace.id}>
          <button className={styles.titleLink}>{workspace.name}</button>
          <IconButton icon="edit" tooltip="Edit Workspace" />
        </div>
      ))}
    </div>
  )
}

export default Workspaces
