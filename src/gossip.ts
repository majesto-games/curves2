import Doc from "crdt"
import { AnyAction, Dispatch } from "redux"
import { ActionType } from "typesafe-actions"

import * as actions from "./actions"
import { configureMesh } from "./mesh"
import { configureWebGroup, debounce } from "./utils"

const gossipActions = {
  createdOnlineRoom: actions.createdOnlineRoom,
  leaveRoom: actions.leaveRoom,
  joinOnlineRoom: actions.joinOnlineRoom,
  rooms: actions.rooms,
}
export type GossipAction = ActionType<typeof gossipActions>

export const configureGossip = (dispatch: Dispatch<AnyAction>) => {
  const gossipGroup = configureWebGroup()

  const gossipDocument = configureMesh(gossipGroup, new Doc())

  const rooms = gossipDocument.createSeq("type", "room")

  const debouncedUpdate = debounce(() => dispatch(actions.rooms(rooms.toJSON())), 200)

  gossipDocument.on("update", () => {
    debouncedUpdate()
  })

  gossipGroup.join("gossip")

  return (action: GossipAction) => {
    if (action.type === "leaveRoom") {
      const { name, isHost } = action.payload

      if (isHost) {
        const room = rooms.asArray().find((room: any) => room.state.name === name)

        if (room) {
          rooms.remove(room)
        }
      }
    }

    if (action.type === "createdOnlineRoom") {
      const { name } = action.payload

      rooms.push(gossipDocument.add({ name, players: 0 }))
    }
  }
}
