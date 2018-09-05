import { CompoundButton } from "office-ui-fabric-react"
import * as React from "react"
import { connect } from "react-redux"
import { randomAdjective, randomNoun } from "sillyname"

import * as actions from "../actions"
import { ClientState } from "../client"

export const HeaderButtonsAtom: React.SFC<Props> = ({ createLocalRoom, createOnlineRoom, joinRoom }) => (
  <div className="HeaderButtons">
    <CompoundButton
      primary
      iconProps={{ iconName: "Globe" }}
      text="Create room"
      secondaryText="Start an online game"
      onClick={() => createOnlineRoom((randomAdjective() + randomNoun() + "-" + randomNoun()).toLowerCase())}
    />
    <CompoundButton
      iconProps={{ iconName: "DoubleChevronRight8" }}
      text="Join room"
      secondaryText="Join an online game"
      onClick={() => {
        const name = prompt("Enter room name:")

        if (name) {
          joinRoom(name)
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

type StateProps = {}
type DispatchProps = {
  createLocalRoom: typeof actions.createLocalRoom
  createOnlineRoom: typeof actions.createOnlineRoom
  joinRoom: typeof actions.joinOnlineRoom
}
type OwnProps = {}

export const HeaderButtons = connect<StateProps, DispatchProps, OwnProps>(
  (state: ClientState) => ({
    messages: state.messages,
  }),
  {
    createLocalRoom: actions.createLocalRoom,
    createOnlineRoom: actions.createOnlineRoom,
    joinRoom: actions.joinOnlineRoom,
  },
)(HeaderButtonsAtom)
