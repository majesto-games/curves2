import { AnyAction, Dispatch } from "redux"
import { ActionType } from "typesafe-actions"

import * as actions from "./actions"
import { configureMesh } from "./mesh"
import { configureWebGroup } from "./utils"

const gossipActions = {
  createdOnlineRoom: actions.createdOnlineRoom,
  leaveRoom: actions.leaveRoom,
  joinOnlineRoom: actions.joinOnlineRoom,
  rooms: actions.rooms,
}
export type GossipAction = ActionType<typeof gossipActions>

export const configureGossip = (dispatch: Dispatch<AnyAction>) => {
  const gossipGroup = configureWebGroup()

  const roomListModel = configureMesh(gossipGroup)

  roomListModel.on("update", () => {
    dispatch(actions.rooms(roomListModel.toJSON()))
  })

  gossipGroup.join("gossip")

  return (action: GossipAction) => {
    if (action.type === "leaveRoom") {
      const { name, isHost } = action.payload

      if (isHost) {
        const index = roomListModel.indexOf(name)
        roomListModel.splice(Number(index), 1) // I have no idea why i need to force the index to be a number
      }
    }

    if (action.type === "createdOnlineRoom") {
      const { name } = action.payload

      roomListModel.push(name)
    }
  }
}
