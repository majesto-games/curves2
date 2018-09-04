import { CompoundButton } from "office-ui-fabric-react"
import * as React from "react"
import { connect } from "react-redux"

import { group, history } from ".."
import { ClientState } from "../client"

type StateProps = {
  state: ClientState
}

type OwnProps = {}

type Props = StateProps & OwnProps

export const RoomButtonsAtom: React.SFC<Props> = ({ state }) => (
  <div className="HeaderButtons">
    <CompoundButton
      disabled={!state.room.isHost}
      primary
      iconProps={{ iconName: "DoubleChevronRight8" }}
      text="Start game"
      secondaryText="Start game"
      onClick={() => history.push("/game/test")}
    />
    <CompoundButton
      disabled={!state.room.isHost}
      iconProps={{ iconName: "Settings" }}
      text="Settings"
      secondaryText="Configure game settings"
    />
    <CompoundButton
      iconProps={{ iconName: "Leave" }}
      text="Leave room"
      secondaryText="Leave room"
      onClick={() => {
        group.leave()
        history.push("/")
      }}
    />
  </div>
)

export const RoomButtons = connect<StateProps, {}, OwnProps>((state: ClientState) => ({ state }))(RoomButtonsAtom)
