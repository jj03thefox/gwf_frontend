import React, { useState, Fragment, useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SplitView from '@globalfishingwatch/ui-components/dist/split-view'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import Menu from '@globalfishingwatch/ui-components/dist/menu'
import Modal from '@globalfishingwatch/ui-components/dist/modal'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { AsyncReducerStatus } from 'types'
import useDebugMenu from 'features/debug/debug.hooks'
import { MapboxRefProvider } from 'features/map/map.context'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { selectLocationType } from 'routes/routes.selectors'
import menuBgImage from 'assets/images/menubg.jpg'
import { useLocationConnect } from 'routes/routes.hook'
import DebugMenu from 'features/debug/DebugMenu'
import Login from 'features/user/Login'
import Map from 'features/map/Map'
import Timebar from 'features/timebar/Timebar'
import Sidebar from 'features/sidebar/Sidebar'
import { logoutUserThunk } from 'features/user/user.slice'
import { isUserAuthorized, isUserLogged } from 'features/user/user.selectors'
import { HOME, WORKSPACE } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import { selectSidebarOpen } from './app.selectors'
import styles from './App.module.css'

import '@globalfishingwatch/ui-components/dist/base.css'

const ErrorPlaceHolder = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.placeholder}>
    <div>{children}</div>
  </div>
)

const Main = () => {
  const locationType = useSelector(selectLocationType)
  return (
    <div className={styles.main}>
      <Map />
      {(locationType === HOME || locationType === WORKSPACE) && <Timebar />}
    </div>
  )
}

function App(): React.ReactElement {
  const dispatch = useDispatch()
  const sidebarOpen = useSelector(selectSidebarOpen)
  const { dispatchQueryParams } = useLocationConnect()
  const [menuOpen, setMenuOpen] = useState(false)
  const userLogged = useSelector(isUserLogged)
  const userAuthorized = useSelector(isUserAuthorized)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const locationType = useSelector(selectLocationType)

  const { debugActive, dispatchToggleDebugMenu } = useDebugMenu()

  const onToggle = useCallback(() => {
    dispatchQueryParams({ sidebarOpen: !sidebarOpen })
  }, [dispatchQueryParams, sidebarOpen])

  const onMenuClick = useCallback(() => {
    setMenuOpen(true)
  }, [])

  const Content = useMemo(() => {
    if (!userLogged) {
      return <Spinner />
    }

    if (!userAuthorized) {
      return (
        <ErrorPlaceHolder>
          <h2>We're sorry but your user is not authorized to use this app yet</h2>
          <Button
            onClick={() => {
              dispatch(logoutUserThunk())
            }}
          >
            Logout
          </Button>
        </ErrorPlaceHolder>
      )
    }

    if (workspaceStatus === AsyncReducerStatus.Error) {
      return (
        <ErrorPlaceHolder>
          <h2>There was an error loading your view</h2>
          <Button
            onClick={() => {
              dispatch(
                updateLocation(HOME, {
                  payload: { workspaceId: undefined },
                  query: {},
                  replaceQuery: true,
                })
              )
            }}
          >
            Load default view
          </Button>
        </ErrorPlaceHolder>
      )
    }

    return (
      <MapboxRefProvider>
        <SplitView
          isOpen={sidebarOpen}
          onToggle={onToggle}
          aside={<Sidebar onMenuClick={onMenuClick} />}
          main={<Main />}
          asideWidth={locationType === WORKSPACE || locationType === HOME ? '37rem' : '50%'}
          className="split-container"
        />
      </MapboxRefProvider>
    )
  }, [
    dispatch,
    locationType,
    onMenuClick,
    onToggle,
    sidebarOpen,
    userAuthorized,
    userLogged,
    workspaceStatus,
  ])

  return (
    <Fragment>
      <Login />
      {Content}
      <Menu
        bgImage={menuBgImage}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeLinkId="map-data"
      />
      <Modal
        title="Secret debug menu 🤖"
        isOpen={debugActive}
        onClose={() => dispatchToggleDebugMenu()}
      >
        <DebugMenu />
      </Modal>
    </Fragment>
  )
}

export default App
