import { CompoundButton } from "office-ui-fabric-react"
import * as React from "react"
import { connect } from "react-redux"

import * as actions from "../../actions"
import { ClientState } from "../../stores/client"

export const ButtonsAtom: React.SFC<Props> = ({ leaveRoom, isHost, roomName }) => (
  <div className="GameButtons">
    <CompoundButton iconProps={{ iconName: "Settings" }} text="Settings" secondaryText="Configure game settings" />
    <CompoundButton
      iconProps={{ iconName: "Leave" }}
      text="Leave game"
      secondaryText="Leave game"
      onClick={() => leaveRoom(roomName!, isHost)}
    />
  </div>
)

type Props = OwnProps & StateProps & DispatchProps

type StateProps = {
  roomName: string | null
  isHost: boolean
}
type DispatchProps = {
  leaveRoom: typeof actions.leaveRoom
}
type OwnProps = {}

export const Buttons = connect(
  (state: ClientState) => ({ isHost: state.room.isHost, roomName: state.room.name }),
  {
    leaveRoom: actions.leaveRoom,
  },
)(ButtonsAtom)
