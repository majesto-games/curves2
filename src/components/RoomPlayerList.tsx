import { ColumnActionsMode, DetailsList, SelectionMode } from "office-ui-fabric-react"
import * as React from "react"

export const RoomPlayerList: React.SFC = () => (
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
