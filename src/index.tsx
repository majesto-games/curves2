import "./index.css"

import createHistory from "history/createMemoryHistory"
import { Fabric, loadTheme } from "office-ui-fabric-react"
import { initializeIcons } from "office-ui-fabric-react/lib/Icons"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { Router } from "react-router-dom"

import { App } from "./components"
import { configureGossip } from "./gossip"
import { configureStore as configureClientStore } from "./stores/client"
import { theme } from "./theme"

export const history = createHistory()

initializeIcons()

loadTheme(theme)

export const clientStore = configureClientStore()
export const gossip = configureGossip(clientStore.dispatch)

ReactDOM.render(
  <Fabric>
    <Provider store={clientStore}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  </Fabric>,
  document.getElementById("root") as HTMLElement,
)
