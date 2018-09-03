import { CompoundButton } from "office-ui-fabric-react"
import * as React from "react"
import { Route, Switch } from "react-router"

import { history } from ".."
import { Footer } from "./Footer"
import { GameContainer } from "./GameContainer"
import { GamePlayerList } from "./GamePlayerList"
import { HeaderButtons } from "./HeaderButtons"
import { RoomList } from "./RoomList"
import { RoomPlayerList } from "./RoomPlayerList"
import { RoomTitle } from "./RoomTitle"
import { StatsTitle } from "./StatsTitle"
import { Title } from "./Title"

export const App: React.SFC = () => (
  <div className="App">
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
              <div className="HeaderButtons">
                <CompoundButton
                  primary
                  iconProps={{ iconName: "DoubleChevronRight8" }}
                  text="Start game"
                  secondaryText="Start game"
                  onClick={() => history.push("/game/test")}
                />
                <CompoundButton
                  iconProps={{ iconName: "Settings" }}
                  text="Settings"
                  secondaryText="Configure game settings"
                />
                <CompoundButton
                  iconProps={{ iconName: "Leave" }}
                  text="Leave room"
                  secondaryText="Leave room"
                  onClick={() => history.push("/")}
                />
              </div>
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
              <div className="GameButtons">
                <CompoundButton
                  iconProps={{ iconName: "Settings" }}
                  text="Settings"
                  secondaryText="Configure game settings"
                />
                <CompoundButton
                  iconProps={{ iconName: "Leave" }}
                  text="Leave game"
                  secondaryText="Leave game"
                  onClick={() => history.push("/")}
                />
              </div>
              <GamePlayerList />
            </div>
          </div>
        )}
      />
    </Switch>
    <Footer />
  </div>
)
