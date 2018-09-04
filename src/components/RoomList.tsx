import { ColumnActionsMode, DefaultButton, DetailsList, SelectionMode } from "office-ui-fabric-react"
import * as React from "react"

import { group, history } from ".."

export const RoomList: React.SFC = () => (
  <DetailsList
    selectionMode={SelectionMode.none}
    items={[
      {
        name: "Room 1",
        playerCount: 3,
      },
      {
        name: "Room 2",
        playerCount: 0,
      },
    ]}
    columns={[
      {
        key: "c1",
        name: "Room name",
        fieldName: "name",
        isResizable: false,
        columnActionsMode: ColumnActionsMode.disabled,
        minWidth: 120,
      },
      {
        key: "c2",
        name: "Players",
        fieldName: "playerCount",
        isResizable: false,
        columnActionsMode: ColumnActionsMode.disabled,
        minWidth: 60,
      },
      {
        key: "c3",
        name: "Action",
        isResizable: false,
        columnActionsMode: ColumnActionsMode.disabled,
        minWidth: 80,
        onRender: () => (
          <DefaultButton
            primary
            text="Join"
            size={20}
            iconProps={{ iconName: "DoubleChevronRight8" }}
            onClick={() => {
              group.join("test")
              history.push("/room/test")
            }}
          />
        ),
      },
    ]}
  />
)
