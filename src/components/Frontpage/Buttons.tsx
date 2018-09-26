import { CompoundButton } from "office-ui-fabric-react"
import * as React from "react"
import { connect } from "react-redux"

import * as actions from "../../actions"
import { ClientState, isLoading } from "../../stores/client"

export const ButtonsAtom: React.SFC<Props> = ({
  createLocalRoom,
  createOnlineRoom,
  joinOnlineRoom,
  isLoading,
  isOffline,
}) => (
  <div className="HeaderButtons">
    <CompoundButton
      disabled={isOffline}
      primary
      className={isLoading ? "loading" : ""}
      iconProps={{ iconName: "Globe" }}
      text="Create room"
      secondaryText="Start an online game"
      onClick={() => {
        if (!isLoading) {
          createOnlineRoom()
        }
      }}
    />
    <CompoundButton
      disabled={isOffline}
      iconProps={{ iconName: "DoubleChevronRight8" }}
      text="Join room"
      secondaryText="Join an online game"
      onClick={() => {
        const name = prompt("Enter room name:")

        if (name) {
          joinOnlineRoom(name)
        }
      }}
    />
    <CompoundButton
      iconProps={{ iconName: "PlugDisconnected" }}
      text="Play offline"
      secondaryText="Play offline with friends or bots"
      onClick={() => createLocalRoom()}
    />
  </div>
)

type Props = OwnProps & StateProps & DispatchProps

type StateProps = {
  isLoading: boolean
  isOffline: boolean
}
type DispatchProps = {
  createOnlineRoom: typeof actions.createOnlineRoom
  createLocalRoom: typeof actions.createLocalRoom
  joinOnlineRoom: typeof actions.joinOnlineRoom
}
type OwnProps = {}

export const Buttons = connect<StateProps, DispatchProps, OwnProps>(
  (state: ClientState) => ({
    isLoading: isLoading(state),
    isOffline: !state.online,
  }),
  {
    createOnlineRoom: actions.createOnlineRoom,
    createLocalRoom: actions.createLocalRoom,
    joinOnlineRoom: actions.joinOnlineRoom,
  },
)(ButtonsAtom)
