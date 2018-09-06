import { ColumnActionsMode, DefaultButton, DetailsList, SelectionMode } from "office-ui-fabric-react"
import * as React from "react"
import { connect } from "react-redux"

import * as actions from "../../actions"

export const RoomListAtom: React.SFC<Props> = ({ joinOnlineRoom }) => (
  <DetailsList
    selectionMode={SelectionMode.none}
    items={[
      {
        name: "room-1",
        playerCount: 0,
      },
      {
        name: "room-2",
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
        onRender: (item) => (
          <DefaultButton
            primary
            text="Join"
            size={20}
            iconProps={{ iconName: "DoubleChevronRight8" }}
            onClick={() => joinOnlineRoom(item.name)}
          />
        ),
      },
    ]}
  />
)

type Props = OwnProps & StateProps & DispatchProps

type StateProps = {}
type DispatchProps = {
  joinOnlineRoom: typeof actions.joinOnlineRoom
}
type OwnProps = {}

export const RoomList = connect<StateProps, DispatchProps, OwnProps>(
  undefined,
  { joinOnlineRoom: actions.joinOnlineRoom },
)(RoomListAtom)
