import { ActionButton, TooltipHost } from "office-ui-fabric-react"
import * as React from "react"
import { connect } from "react-redux"
import { Clipboard } from "ts-clipboard"

import { ClientState, RoomState } from "../client"
import { theme } from "../theme"

type StateProps = {
  room: RoomState
}

type OwnProps = {}

type Props = StateProps & OwnProps

type State = {
  clipboardButtonClicked: boolean
}

export class RoomTitleAtom extends React.Component<Props, State> {
  state: State = {
    clipboardButtonClicked: false,
  }

  render() {
    const { room } = this.props

    return (
      <div className="RoomTitle">
        {room.group &&
          room.group.online && (
            <>
              <span>{room.name}</span>
              <TooltipHost
                content={this.state.clipboardButtonClicked ? "Copied to clipboard!" : "Copy to clipboard"}
                onTooltipToggle={(visible) => this.setState({ clipboardButtonClicked: false })}
              >
                <ActionButton
                  iconProps={{ iconName: "Copy", styles: { root: { color: theme.palette.bodyText } } }}
                  onClick={() => {
                    Clipboard.copy(room.name)
                    this.setState({ clipboardButtonClicked: true })
                  }}
                />
              </TooltipHost>
            </>
          )}
      </div>
    )
  }
}

export const RoomTitle = connect<StateProps, {}, OwnProps>((state: ClientState) => ({ room: state.room }))(
  RoomTitleAtom,
)
