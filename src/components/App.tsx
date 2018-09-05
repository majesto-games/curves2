import { MessageBar } from "office-ui-fabric-react"
import * as React from "react"
import { connect } from "react-redux"
import { Route, RouteComponentProps, Switch, withRouter } from "react-router"
import { CSSTransition, TransitionGroup } from "react-transition-group"

import * as actions from "../actions"
import { ClientState, Message } from "../client"
import { Footer } from "./Footer"
import { GameButtons } from "./GameButtons"
import { GameContainer } from "./GameContainer"
import { GamePlayerList } from "./GamePlayerList"
import { HeaderButtons } from "./HeaderButtons"
import { RoomButtons } from "./RoomButtons"
import { RoomList } from "./RoomList"
import { RoomPlayerList } from "./RoomPlayerList"
import { RoomTitle } from "./RoomTitle"
import { StatsTitle } from "./StatsTitle"
import { Title } from "./Title"

export const AppAtom: React.SFC<Props> = ({ messages, dismissMessage }) => (
  <div className="App">
    <div className="Messages">
      <TransitionGroup component={null}>
        {messages.map((message) => (
          <CSSTransition key={message.text} classNames="fade" timeout={4000} onEntered={() => dismissMessage()}>
            <MessageBar messageBarType={message.type} isMultiline={false}>
              {message.text}
            </MessageBar>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
    <Title />
    <Switch>
      <Route
        exact
        path="/"
        render={() => (
          <>
            <div className="RoomHeader">
              <StatsTitle />
              <HeaderButtons />
            </div>
            <RoomList />
          </>
        )}
      />
      <Route
        path="/room/:roomName"
        render={() => (
          <>
            <div className="RoomHeader">
              <RoomTitle />
              <RoomButtons />
            </div>
            <RoomPlayerList />
          </>
        )}
      />
      <Route
        path="/game/:roomName"
        render={() => (
          <div className="Game">
            <GameContainer />
            <div className="GameSidebar">
              <GameButtons />
              <GamePlayerList />
            </div>
          </div>
        )}
      />
    </Switch>
    <Footer />
  </div>
)

type Props = OwnProps & StateProps & DispatchProps

type StateProps = {
  messages: Message[]
}
type DispatchProps = {
  dismissMessage: typeof actions.dismissMessage
}
type OwnProps = {} & RouteComponentProps<{}>

export const App = withRouter(
  connect<StateProps, DispatchProps, OwnProps>(
    (state: ClientState) => ({
      messages: state.messages,
    }),
    { dismissMessage: actions.dismissMessage },
  )(AppAtom),
)
