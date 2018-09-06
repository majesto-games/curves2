import { CompoundButton } from "office-ui-fabric-react"
import * as React from "react"
import { connect } from "react-redux"

import { history } from "../.."
import * as actions from "../../actions"
import { ClientState } from "../../stores/client"

export const RoomButtonsAtom: React.SFC<Props> = ({ isHost, leaveRoom, addLocalPlayer }) => (
  <div className="HeaderButtons">
    <CompoundButton
      disabled={!isHost}
      primary
      iconProps={{ iconName: "DoubleChevronRight8" }}
      text="Start game"
      secondaryText="Start game"
      onClick={() => history.push("/game/test")}
    />
    <CompoundButton
      iconProps={{ iconName: "Add" }}
      text="Add player"
      secondaryText="Add local player"
      onClick={() => addLocalPlayer()}
    />
    <CompoundButton
      disabled={!isHost}
      iconProps={{ iconName: "Settings" }}
      text="Settings"
      secondaryText="Configure game settings"
    />
    <CompoundButton
      iconProps={{ iconName: "Leave" }}
      text="Leave room"
      secondaryText="Leave room"
      onClick={() => leaveRoom()}
    />
  </div>
)

type Props = OwnProps & StateProps & DispatchProps

type StateProps = {
  isHost: boolean
}
type DispatchProps = {
  leaveRoom: typeof actions.leaveRoom
  addLocalPlayer: typeof actions.addLocalPlayer
}
type OwnProps = {}

export const RoomButtons = connect<StateProps, DispatchProps, OwnProps>(
  (state: ClientState) => ({ isHost: state.room.isHost }),
  { leaveRoom: actions.leaveRoom, addLocalPlayer: actions.addLocalPlayer },
)(RoomButtonsAtom)
