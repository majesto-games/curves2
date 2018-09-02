import "./index.css"

import createHistory from "history/createBrowserHistory"
import {
  ColumnActionsMode,
  CompoundButton,
  DefaultButton,
  DetailsList,
  Fabric,
  loadTheme,
  SelectionMode,
} from "office-ui-fabric-react"
import { initializeIcons } from "office-ui-fabric-react/lib/Icons"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { Route, Router, Switch } from "react-router-dom"

const history = createHistory({ basename: process.env.PUBLIC_URL })

initializeIcons()

loadTheme({
  palette: {
    themePrimary: "#84dc2c",
    themeLighterAlt: "#050902",
    themeLighter: "#152307",
    themeLight: "#27420d",
    themeTertiary: "#4f841a",
    themeSecondary: "#74c127",
    themeDarkAlt: "#8fdf3e",
    themeDark: "#9fe459",
    themeDarker: "#b6eb82",
    neutralLighterAlt: "#2b2b2b",
    neutralLighter: "#333333",
    neutralLight: "#414141",
    neutralQuaternaryAlt: "#4a4a4a",
    neutralQuaternary: "#515151",
    neutralTertiaryAlt: "#6f6f6f",
    neutralTertiary: "rgba(200, 200, 200, 0.85)",
    neutralSecondary: "rgba(208, 208, 208, 0.85)",
    neutralPrimaryAlt: "rgba(218, 218, 218, 0.85)",
    neutralPrimary: "rgba(255, 255, 255, 0.85)",
    neutralDark: "rgba(244, 244, 244, 0.85)",
    black: "rgba(248, 248, 248, 0.85)",
    white: "#202020",
    bodyBackground: "#202020",
    bodyText: "rgba(255, 255, 255, 0.9)",
  },
})

const RoomList: React.SFC = () => (
  <DetailsList
    selectionMode={SelectionMode.none}
    items={[
      {
        name: "Room 1",
        playerCount: 3,
      },
      {
        name: "Room 2",
        playerCount: 0,
      },
    ]}
    columns={[
      {
        key: "c1",
        name: "Room name",
        fieldName: "name",
        isResizable: false,
        columnActionsMode: ColumnActionsMode.disabled,
        minWidth: 120,
      },
      {
        key: "c2",
        name: "Players",
        fieldName: "playerCount",
        isResizable: false,
        columnActionsMode: ColumnActionsMode.disabled,
        minWidth: 60,
      },
      {
        key: "c3",
        name: "Action",
        isResizable: false,
        columnActionsMode: ColumnActionsMode.disabled,
        minWidth: 80,
        onRender: () => (
          <DefaultButton
            primary
            text="Join"
            size={20}
            iconProps={{ iconName: "DoubleChevronRight8" }}
            onClick={() => history.push("/room/test")}
          />
        ),
      },
    ]}
  />
)

const HeaderButtons: React.SFC = () => (
  <div className="HeaderButtons">
    <CompoundButton
      primary
      iconProps={{ iconName: "Globe" }}
      text="Create room"
      secondaryText="Start an online game"
      onClick={() => history.push("/room/test")}
    />
    <CompoundButton
      iconProps={{ iconName: "PlugDisconnected" }}
      text="Play offline"
      secondaryText="Play offline with friends or bots"
      onClick={() => history.push("/room/test")}
    />
  </div>
)

const Title: React.SFC = () => (
  <div className="Title">
    Curves
    <span>2.0</span>
  </div>
)

const RoomTitle: React.SFC = () => <div className="RoomTitle">Room name goes here</div>

const RoomPlayerList: React.SFC = () => (
  <DetailsList
    selectionMode={SelectionMode.none}
    items={[
      {
        name: "Player 1",
        keys: 0,
        color: "rgb(238, 255, 65)",
      },
      {
        name: "Player 2",
        keys: 1,
        color: "rgb(124, 77, 255)",
      },
    ]}
    columns={[
      {
        key: "c1",
        name: "Color",
        isResizable: false,
        columnActionsMode: ColumnActionsMode.disabled,
        minWidth: 30,
        maxWidth: 30,
        onRender: (item) => <span className="color" style={{ backgroundColor: item.color }} />,
      },
      {
        key: "c2",
        name: "Player name",
        fieldName: "name",
        isResizable: false,
        columnActionsMode: ColumnActionsMode.disabled,
        minWidth: 120,
      },
      {
        key: "c3",
        name: "Keys",
        isResizable: false,
        columnActionsMode: ColumnActionsMode.disabled,
        minWidth: 80,
        onRender: (item) =>
          item.keys === 0 ? (
            <div className="keys">
              <span className="key">Left</span>
              <span className="key">Right</span>
            </div>
          ) : (
            <div className="keys">
              <span className="key">A</span>
              <span className="key">D</span>
            </div>
          ),
      },
    ]}
  />
)

const GamePlayerList: React.SFC = () => (
  <div className="GamePlayerList">
    <DetailsList
      selectionMode={SelectionMode.none}
      items={[
        {
          name: "Player 1",
          color: "rgb(238, 255, 65)",
          score: 0,
        },
        {
          name: "Player 2",
          color: "rgb(124, 77, 255)",
          score: 0,
        },
      ]}
      columns={[
        {
          key: "c1",
          name: "Color",
          isResizable: false,
          columnActionsMode: ColumnActionsMode.disabled,
          minWidth: 30,
          maxWidth: 30,
          onRender: (item) => <span className="color" style={{ backgroundColor: item.color }} />,
        },
        {
          key: "c2",
          name: "Player name",
          fieldName: "name",
          isResizable: false,
          columnActionsMode: ColumnActionsMode.disabled,
          minWidth: 120,
        },
        {
          key: "c3",
          name: "Score",
          fieldName: "score",
          isResizable: false,
          columnActionsMode: ColumnActionsMode.disabled,
          minWidth: 30,
          maxWidth: 30,
        },
      ]}
    />
  </div>
)

const StatsTitle: React.SFC = () => (
  <div className="StatsTitle">
    There are <b>3</b> players online.
    <br />
    <b>48</b> games has been played today.
    <br />
    Longest snake today was <b>452</b> units.
  </div>
)

const Footer: React.SFC = () => <div className="Footer">Version 20180903 &copy; Majesto Games</div>

const App: React.SFC = () => (
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
            <RoomPlayerList />
          </>
        )}
      />
      <Route
        path="/game/:roomName"
        render={() => (
          <div className="Game">
            <div className="GameContainer" />
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

ReactDOM.render(
  <Fabric>
    <Router history={history}>
      <App />
    </Router>
  </Fabric>,
  document.getElementById("root") as HTMLElement,
)
