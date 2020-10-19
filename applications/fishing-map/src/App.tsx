import React, { memo, useState, Fragment, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AsyncReducerStatus } from 'types'
import useDebugMenu from 'hooks/use-debug-menu'
import SplitView from '@globalfishingwatch/ui-components/dist/split-view'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import Menu from '@globalfishingwatch/ui-components/dist/menu'
import { Modal } from '@globalfishingwatch/ui-components'
import { MapboxRefProvider } from 'features/map/map.context'
import { fetchWorkspaceThunk, selectWorkspaceStatus } from 'features/workspace/workspace.slice'
import { selectDataviewsResourceQueries } from 'features/workspace/workspace.selectors'
import { fetchResourceThunk } from 'features/resources/resources.slice'
import { selectWorkspaceId, selectSidebarOpen } from 'routes/routes.selectors'
import menuBgImage from 'assets/images/menubg.jpg'
import { useLocationConnect } from 'routes/routes.hook'
import DebugMenu from './features/debug/DebugMenu'
import Login from './features/user/Login'
import Map from './features/map/Map'
import Timebar from './features/timebar/Timebar'
import Sidebar from './features/sidebar/Sidebar'
import styles from './App.module.css'
import { isUserLogged } from './features/user/user.slice'
import '@globalfishingwatch/ui-components/dist/base.css'

const Main = memo(() => (
  <div className={styles.main}>
    <Map />
    <Timebar />
  </div>
))

function App(): React.ReactElement {
  const dispatch = useDispatch()
  const sidebarOpen = useSelector(selectSidebarOpen)
  const { dispatchQueryParams } = useLocationConnect()
  const [menuOpen, setMenuOpen] = useState(false)
  const logged = useSelector(isUserLogged)
  const workspaceId = useSelector(selectWorkspaceId)
  const workspaceStatus = useSelector(selectWorkspaceStatus)

  const { debugActive, dispatchToggleDebugMenu } = useDebugMenu()

  const onToggle = () => {
    dispatchQueryParams({ sidebarOpen: !sidebarOpen })
  }

  const onMenuClick = useCallback(() => {
    setMenuOpen(true)
  }, [])

  useEffect(() => {
    if (logged) {
      dispatch(fetchWorkspaceThunk(workspaceId))
    }
  }, [dispatch, logged, workspaceId])

  const resourceQueries = useSelector(selectDataviewsResourceQueries)
  useEffect(() => {
    if (resourceQueries) {
      resourceQueries.forEach((resourceQuery) => {
        dispatch(fetchResourceThunk(resourceQuery))
      })
    }
  }, [dispatch, resourceQueries])

  return (
    <Fragment>
      <Login />
      {!logged || workspaceStatus !== AsyncReducerStatus.Finished ? (
        <div className={styles.placeholder}>
          <Spinner />
        </div>
      ) : (
        <MapboxRefProvider>
          <SplitView
            isOpen={sidebarOpen}
            onToggle={onToggle}
            aside={<Sidebar onMenuClick={onMenuClick} />}
            main={<Main />}
            asideWidth="32rem"
            className="split-container"
          />
        </MapboxRefProvider>
      )}
      <Menu
        bgImage={menuBgImage}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeLinkId="map-data"
      />
      <Modal
        header="Secret debug menu 🤖"
        isOpen={debugActive}
        onClose={() => dispatchToggleDebugMenu()}
      >
        <DebugMenu />
      </Modal>
    </Fragment>
  )
}

export default App
