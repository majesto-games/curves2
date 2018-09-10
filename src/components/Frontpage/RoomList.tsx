import { ColumnActionsMode, DefaultButton, DetailsList, SelectionMode } from "office-ui-fabric-react"
import * as React from "react"
import { connect } from "react-redux"

import * as actions from "../../actions"
import { ClientState } from "../../stores/client"

export const RoomListAtom: React.SFC<Props> = ({ rooms, joinOnlineRoom }) => (
  <div className="RoomList">
    {rooms.length > 0 ? (
      <DetailsList
        selectionMode={SelectionMode.none}
        items={rooms.map((name) => ({ name, playerCount: "1+" }))}
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
    ) : (
      <div className="empty">No rooms! Why don't you create one? 😁</div>
    )}
  </div>
)

type Props = OwnProps & StateProps & DispatchProps

type StateProps = {
  rooms: string[]
}
type DispatchProps = {
  joinOnlineRoom: typeof actions.joinOnlineRoom
}
type OwnProps = {}

export const RoomList = connect<StateProps, DispatchProps, OwnProps>(
  (state: ClientState) => ({ rooms: state.rooms }),
  { joinOnlineRoom: actions.joinOnlineRoom },
)(RoomListAtom)
