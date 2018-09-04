import "./index.css"

import createHistory from "history/createMemoryHistory"
import { Fabric, loadTheme } from "office-ui-fabric-react"
import { initializeIcons } from "office-ui-fabric-react/lib/Icons"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { Router } from "react-router-dom"
import { AnyAction } from "redux"

import * as actions from "./actions"
import { store as clientStore } from "./client"
import { App } from "./components/App"
import { OnlineGroup } from "./connection"
import { theme } from "./theme"

// serverStore.dispatch(actions.playerJoin(0))

export const group = new OnlineGroup(<T extends AnyAction>(action: T) => {
  clientStore.dispatch(action)
  // serverStore.dispatch(action)
  return action
})

window.addEventListener("offline", () => clientStore.dispatch(actions.disconnected("offline")))

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
