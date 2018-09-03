import "./index.css"

import createHistory from "history/createHashHistory"
import { Fabric, loadTheme } from "office-ui-fabric-react"
import { initializeIcons } from "office-ui-fabric-react/lib/Icons"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { Router } from "react-router-dom"

import * as actions from "./actions"
import { store as clientStore } from "./client"
import { App } from "./components/App"
import { store as serverStore } from "./server"
import { theme } from "./theme"

serverStore.dispatch(actions.playerJoin(0))

export const history = createHistory({ basename: process.env.PUBLIC_URL })

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
