import React from 'react'
// import { ClickToComponent } from 'click-to-react-component'
import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { RecoilRoot } from 'recoil'
import Head from 'next/head'
import { wrapper } from '../store'

import 'features/i18n/i18n'
import './styles.css'
import '../../../libs/ui-components/src/base.css'
import '../../../libs/timebar/src/timebar-settings.css'
import '@globalfishingwatch/maplibre-gl/dist/maplibre-gl.css'

function CustomApp({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest)

  return (
    <React.StrictMode>
      <Head>
        <title>GFW | Map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <RecoilRoot>
        <Provider store={store}>
          {/* <ClickToComponent /> */}
          <Component {...props.pageProps} />
        </Provider>
      </RecoilRoot>
    </React.StrictMode>
  )
}

export default CustomApp
