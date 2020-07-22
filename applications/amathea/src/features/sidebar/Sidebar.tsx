import React, { lazy, useMemo, Suspense, useEffect } from 'react'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { useLocationConnect } from 'routes/routes.hook'
import { WORKSPACES, AREAS_OF_INTEREST, DATASETS } from 'routes/routes'
import { useWorkspacesConnect } from 'features/workspaces/workspaces.hook'
import styles from './Sidebar.module.css'

const SidebarComponent = (component: string) => {
  return lazy(() => import(`../${component}`))
}

function Sidebar(): React.ReactElement {
  const { location, dispatchLocation } = useLocationConnect()

  const { fetchWorkspaces } = useWorkspacesConnect()

  useEffect(() => {
    fetchWorkspaces()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ComponentSidebar = useMemo(() => {
    return location.sidebarComponent ? SidebarComponent(location.sidebarComponent) : null
  }, [location.sidebarComponent])

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <Button
          onClick={() => {
            dispatchLocation(WORKSPACES)
          }}
          type="secondary"
          className={location.type === WORKSPACES ? styles.active : ''}
        >
          Workspaces
        </Button>
        <Button
          onClick={() => {
            dispatchLocation(AREAS_OF_INTEREST)
          }}
          type="secondary"
          className={location.type === AREAS_OF_INTEREST ? styles.active : ''}
        >
          Areas of Interest
        </Button>
        <Button
          onClick={() => {
            dispatchLocation(DATASETS)
          }}
          type="secondary"
          className={location.type === DATASETS ? styles.active : ''}
        >
          Datasets
        </Button>
      </div>
      <div className={styles.content}>
        <Suspense fallback={null}>{ComponentSidebar && <ComponentSidebar />}</Suspense>
      </div>
    </div>
  )
}

export default Sidebar
