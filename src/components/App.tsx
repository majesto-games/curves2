import { MessageBar, MessageBarType } from "office-ui-fabric-react"
import * as React from "react"
import { Route, RouteComponentProps, Switch, withRouter } from "react-router"

import { Footer, Frontpage, Header, Ingame, Messages, Room } from "."
import { supportsWebRTC } from "../utils"
import { Deferred } from "./Deferred"

type Props = {} & RouteComponentProps<{}>

export const AppAtom: React.SFC<Props> = () => (
  <div className="App">
    <Messages />
    <Header />
    <Deferred<boolean>
      promise={supportsWebRTC()}
      then={(supported) =>
        supported ? (
          <Switch>
            <Route exact path="/" component={Frontpage} />
            <Route path="/room/:roomName" component={Room} />
            <Route path="/game/:roomName" component={Ingame} />
          </Switch>
        ) : (
          <MessageBar messageBarType={MessageBarType.error}>Unsupported browser 😢</MessageBar>
        )
      }
    />
    <Footer />
  </div>
)

export const App = withRouter(AppAtom)
