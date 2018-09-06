import { ColumnActionsMode, DetailsList, SelectionMode } from "office-ui-fabric-react"
import * as React from "react"
import { connect } from "react-redux"

import { ClientState } from "../../stores/client"

function seededColor(input: number) {
  // Input is a 32 bit uint, apply modulus it to fit 360 degrees
  const hue = input % 360
  return "hsl(" + hue + ", 90%, 65%)"
}

type StateProps = {
  state: ClientState
}

type OwnProps = {}

type Props = StateProps & OwnProps

export const PlayerListAtom: React.SFC<Props> = ({ state }) => (
  <DetailsList
    selectionMode={SelectionMode.none}
    items={state.room.players.map((p) => ({ name: p, keys: 0, color: seededColor(p) }))}
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

export const PlayerList = connect<StateProps, {}, OwnProps>((state: ClientState) => ({ state }))(PlayerListAtom)
