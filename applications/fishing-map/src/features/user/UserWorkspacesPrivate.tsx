import React, { useCallback } from 'react'
import Link from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Icon from '@globalfishingwatch/ui-components/dist/icon'
import { Workspace } from '@globalfishingwatch/api-types/dist'
import { WORKSPACE } from 'routes/routes'
import { WorkspaceCategories } from 'data/workspaces'
import { selectWorkspaceListStatus } from 'features/workspaces-list/workspaces-list.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import useViewport from 'features/map/map-viewport.hooks'
import { selectUserWorkspacesPrivate } from './user.selectors'
import styles from './User.module.css'

function UserWorkspacesPrivate() {
  const { t } = useTranslation()
  const { setMapCoordinates } = useViewport()
  const workspaces = useSelector(selectUserWorkspacesPrivate)
  const workspacesStatus = useSelector(selectWorkspaceListStatus)

  const onWorkspaceClick = useCallback(
    (workspace: Workspace) => {
      if (workspace.viewport) {
        setMapCoordinates(workspace.viewport)
      }
    },
    [setMapCoordinates]
  )

  const loading =
    workspacesStatus === AsyncReducerStatus.Loading ||
    workspacesStatus === AsyncReducerStatus.LoadingItem

  if (loading || !workspaces || workspaces.length === 0) {
    return null
  }

  return (
    <div className={styles.views}>
      <div className={styles.viewsHeader}>
        <label>{t('workspace.privateTitle_plural', 'Private workspaces')}</label>
      </div>
      <ul>
        {workspaces.map((workspace) => {
          return (
            <li className={styles.workspace} key={workspace.id}>
              <Link
                className={styles.workspaceLink}
                to={{
                  type: WORKSPACE,
                  payload: {
                    category: workspace.category || WorkspaceCategories.FishingActivity,
                    workspaceId: workspace.id,
                  },
                  query: {},
                }}
                onClick={() => onWorkspaceClick(workspace)}
              >
                <Icon icon="private" />
                <span className={styles.workspaceTitle}>{workspace.name}</span>
                <IconButton icon="arrow-right" />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default UserWorkspacesPrivate
