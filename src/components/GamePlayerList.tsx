import { ColumnActionsMode, DetailsList, SelectionMode } from "office-ui-fabric-react"
import * as React from "react"

export const GamePlayerList: React.SFC = () => (
  <div className="GamePlayerList">
    <DetailsList
      selectionMode={SelectionMode.none}
      items={[
        {
          name: "Player 1",
          color: "rgb(238, 255, 65)",
          score: 0,
        },
        {
          name: "Player 2",
          color: "rgb(124, 77, 255)",
          score: 0,
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
          name: "Score",
          fieldName: "score",
          isResizable: false,
          columnActionsMode: ColumnActionsMode.disabled,
          minWidth: 30,
          maxWidth: 30,
        },
      ]}
    />
  </div>
)
