import React, { useCallback } from 'react'
import Link from 'redux-first-router-link'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { Workspace } from '@globalfishingwatch/dataviews-client'
import { useModalConnect } from 'features/modal/modal.hooks'
import { WORKSPACE_EDITOR } from 'routes/routes'
import styles from './Workspaces.module.css'
import { useWorkspacesConnect, useWorkspacesAPI } from './workspaces.hook'

function Workspaces(): React.ReactElement {
  const { showModal } = useModalConnect()
  const { deleteWorkspace } = useWorkspacesAPI()
  const { workspacesList, workspacesSharedList } = useWorkspacesConnect()

  const onDeleteClick = useCallback(
    (workspace: Workspace) => {
      const confirmation = window.confirm(
        `Are you sure you want to permanently delete this workspace?\n${workspace.label}`
      )
      if (confirmation) {
        deleteWorkspace(workspace.id)
      }
    },
    [deleteWorkspace]
  )

  return (
    <div className={styles.container}>
      <h1 className="screen-reader-only">Workspaces</h1>
      <label>Your workspaces</label>
      {workspacesList &&
        workspacesList.map((workspace) => (
          <div className={styles.listItem} key={workspace.id}>
            <Link
              className={styles.titleLink}
              to={{ type: WORKSPACE_EDITOR, payload: { workspaceId: workspace.id } }}
            >
              <button>{workspace.label}</button>
            </Link>
            {workspace.description && <IconButton icon="info" tooltip={workspace.description} />}
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
              disabled={workspace.id === 5}
              tooltip="Delete Workspace"
              onClick={() => onDeleteClick(workspace)}
            />
          </div>
        ))}
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
          <button className={styles.titleLink}>{workspace.label}</button>
          <IconButton icon="edit" tooltip="Edit Workspace" />
        </div>
      ))}
    </div>
  )
}

export default Workspaces
