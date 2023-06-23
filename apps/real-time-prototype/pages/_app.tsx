import { useState, useCallback, Component, useEffect } from 'react'
import { AppProps } from 'next/app'
import { FpsView } from 'react-fps'
import MemoryStatsComponent from 'next-react-memory-stats'
import { RecoilURLSyncJSONNext } from 'recoil-sync-next'
import { RecoilRoot } from 'recoil'
import dynamic from 'next/dynamic'
import { SplitView } from '@globalfishingwatch/ui-components'
import { GFWAPI } from '@globalfishingwatch/api-client'
import styles from './App.module.css'

import './styles.css'
import './base.css'
import './timebar-settings.css'

class ErrorBoundary extends Component<{ children: any }, { hasError: boolean }> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.warn(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}

const Map = dynamic(() => import(/* webpackChunkName: "Map" */ 'features/map/Map'), {
  ssr: false,
})

function CustomApp({ Component, pageProps }: AppProps) {
  const [showFps, setShowFps] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  useEffect(() => {
    GFWAPI.login({}).then((r) => {
      debugger
    })
    // fetch(`${API_BASE}/last-update`)
    //   .then((r) => r.json())
    //   .then((d) => console.log(d))

    setShowFps(true)
  }, [])

  const onToggle = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  const asideWidth = '32rem'
  return (
    <RecoilRoot>
      <RecoilURLSyncJSONNext location={{ part: 'queryParams' }}>
        <ErrorBoundary>
          <SplitView
            showToggle
            isOpen={sidebarOpen}
            onToggle={onToggle}
            aside={<Component {...pageProps} />}
            main={
              <div className={styles.main}>
                <div className={styles.mapContainer}>
                  <Map />
                </div>
              </div>
            }
            asideWidth={asideWidth}
            showMainLabel="Map"
            className="split-container"
          />
          {showFps && <FpsView bottom="0" left="0" top="auto" />}
          {showFps && <MemoryStatsComponent />}
        </ErrorBoundary>
      </RecoilURLSyncJSONNext>
    </RecoilRoot>
  )
}

export default CustomApp
