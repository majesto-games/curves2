import "./index.css"

import createHistory from "history/createHashHistory"
import { Fabric, loadTheme } from "office-ui-fabric-react"
import { initializeIcons } from "office-ui-fabric-react/lib/Icons"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { Router } from "react-router-dom"

import { App } from "./components/App"
import { theme } from "./theme"

export const history = createHistory({ basename: process.env.PUBLIC_URL })

initializeIcons()

loadTheme(theme)

ReactDOM.render(
  <Fabric>
    <Router history={history}>
      <App />
    </Router>
  </Fabric>,
  document.getElementById("root") as HTMLElement,
)
