import "./index.css"

import createHistory from "history/createMemoryHistory"
import { Fabric, loadTheme } from "office-ui-fabric-react"
import { initializeIcons } from "office-ui-fabric-react/lib/Icons"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { Router } from "react-router-dom"

import { store as clientStore } from "./client"
import { App } from "./components"
import { theme } from "./theme"

export const history = createHistory()

initializeIcons()

loadTheme(theme)

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
