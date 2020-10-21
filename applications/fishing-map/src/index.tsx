import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from 'features/app/App'
import store from './store'
import * as serviceWorker from './serviceWorker'

render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
