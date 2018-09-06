import * as React from "react"
import { Route, RouteComponentProps, Switch, withRouter } from "react-router"

import { Footer, Frontpage, Header, Ingame, Messages, Room } from "."

type Props = {} & RouteComponentProps<{}>

export const AppAtom: React.SFC<Props> = () => (
  <div className="App">
    <Messages />
    <Header />
    <Switch>
      <Route exact path="/" component={Frontpage} />
      <Route path="/room/:roomName" component={Room} />
      <Route path="/game/:roomName" component={Ingame} />
    </Switch>
    <Footer />
  </div>
)

export const App = withRouter(AppAtom)
