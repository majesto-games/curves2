import {
  CompoundButton,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
  Slider,
} from "office-ui-fabric-react"
import * as React from "react"
import { connect } from "react-redux"

import { history } from "../.."
import * as actions from "../../actions"
import { ClientState } from "../../stores/client"

class SettingsButton extends React.Component<{ disabled?: boolean }, { dialogVisible: boolean }> {
  state: { dialogVisible: boolean } = {
    dialogVisible: false,
  }

  toggleDialog = () => this.setState({ dialogVisible: !this.state.dialogVisible })

  render() {
    return (
      <>
        <CompoundButton
          disabled={this.props.disabled}
          iconProps={{ iconName: "Settings" }}
          text="Settings"
          secondaryText="Configure game settings"
          onClick={this.toggleDialog}
        />
        <Dialog
          hidden={!this.state.dialogVisible}
          onDismiss={this.toggleDialog}
          dialogContentProps={{ type: DialogType.normal, title: "Game settings" }}
          modalProps={{ isDarkOverlay: true }}
        >
          <Slider label="Max rounds" min={1} max={25} step={1} defaultValue={10} />
          <Slider label="Score to reach" min={3} max={40} step={1} defaultValue={20} />
          <DialogFooter>
            <PrimaryButton onClick={this.toggleDialog} text="Save" />
            <DefaultButton onClick={this.toggleDialog} text="Cancel" />
          </DialogFooter>
        </Dialog>
      </>
    )
  }
}

export const RoomButtonsAtom: React.SFC<Props> = ({ isHost, leaveRoom, addLocalPlayer, roomName }) => (
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
    <SettingsButton disabled={!isHost} />
    <CompoundButton
      iconProps={{ iconName: "Leave" }}
      text="Leave room"
      secondaryText="Leave room"
      onClick={() => leaveRoom(roomName!, isHost)}
    />
  </div>
)

type Props = OwnProps & StateProps & DispatchProps

type StateProps = {
  isHost: boolean
  roomName: string | null
}
type DispatchProps = {
  leaveRoom: typeof actions.leaveRoom
  addLocalPlayer: typeof actions.addLocalPlayer
}
type OwnProps = {}

export const RoomButtons = connect<StateProps, DispatchProps, OwnProps>(
  (state: ClientState) => ({ isHost: state.room.isHost, roomName: state.room.name }),
  { leaveRoom: actions.leaveRoom, addLocalPlayer: actions.addLocalPlayer },
)(RoomButtonsAtom)
