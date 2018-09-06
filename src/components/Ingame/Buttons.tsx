import { CompoundButton } from "office-ui-fabric-react"
import * as React from "react"
import { connect } from "react-redux"

import * as actions from "../../actions"

export const ButtonsAtom: React.SFC<Props> = ({ leaveRoom }) => (
  <div className="GameButtons">
    <CompoundButton iconProps={{ iconName: "Settings" }} text="Settings" secondaryText="Configure game settings" />
    <CompoundButton
      iconProps={{ iconName: "Leave" }}
      text="Leave game"
      secondaryText="Leave game"
      onClick={() => leaveRoom()}
    />
  </div>
)

type Props = OwnProps & StateProps & DispatchProps

type StateProps = {}
type DispatchProps = {
  leaveRoom: typeof actions.leaveRoom
}
type OwnProps = {}

export const Buttons = connect<StateProps, DispatchProps, OwnProps>(
  undefined,
  {
    leaveRoom: actions.leaveRoom,
  },
)(ButtonsAtom)
