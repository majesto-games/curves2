import { AnyAction, Dispatch } from "redux"
import { ActionType } from "typesafe-actions"

import * as actions from "./actions"
import { configureWebGroup } from "./utils"

const gossipActions = {
  createdOnlineRoom: actions.createdOnlineRoom,
  leaveRoom: actions.leaveRoom,
  joinOnlineRoom: actions.joinOnlineRoom,
  rooms: actions.rooms,
}
export type GossipAction = ActionType<typeof gossipActions>

export const configureGossip = (dispatch: Dispatch<AnyAction>) => {
  let rooms = new Map<string, Set<number>>()
  let players = new Map<number, string>()

  function serializeRooms(): Record<string, number[]> {
    const obj = {}

    rooms.forEach((v, k) => {
      obj[k] = [...v.values()]
    })

    return obj
  }

  function mergeRooms(obj: Record<string, number[]>) {
    Object.keys(obj).forEach((k) => {
      rooms.set(k, new Set([...rooms.get(k)!, ...obj[k]]))
    })

    rooms.forEach((v, k) => v.forEach((id) => players.set(id, k)))
  }

  function addPlayer(id: number, room: string) {
    if (rooms.get(room)) {
      rooms.get(room)!.add(id)
    } else {
      rooms.set(room, new Set([id]))
    }

    players.set(id, room)
  }

  function removePlayer(id: number) {
    if (players.get(id)) {
      dispatch(actions.removeRoomPlayer(players.get(id)!, id))
      rooms.get(players.get(id)!)!.delete(id)

      if (rooms.get(players.get(id)!)!.size === 0) {
        dispatch(actions.removeRoom(players.get(id)!))
      }

      players.delete(id)
    }
  }

  const gossipGroup = configureWebGroup({
    onMessage: (id, data: string) => {
      const action: GossipAction = JSON.parse(data)

      // Someone has hosted a room
      if (action.type === "createdOnlineRoom") {
        const { name } = action.payload

        addPlayer(id, name)

        dispatch(actions.addRoom(name, id))
      }

      // Someone has left a room
      if (action.type === "leaveRoom") {
        removePlayer(id)
      }

      // Somone has joined an online game
      if (action.type === "joinOnlineRoom") {
        const { name } = action.payload

        addPlayer(id, name)

        dispatch(actions.addRoomPlayer(name, id))
      }

      // Someone sent a batch of rooms
      if (action.type === "rooms") {
        // Merge rooms and their players

        mergeRooms(action.payload.rooms)

        dispatch(actions.rooms(serializeRooms()))
      }
    },
    onMemberJoin: (id) => {
      gossipGroup.sendTo(id, JSON.stringify(actions.rooms(serializeRooms())))
    },
    onMemberLeave: (id) => {
      removePlayer(id)
    },
  })

  gossipGroup.join("gossip")

  return (action: GossipAction) => {
    if (action.type === "leaveRoom") {
      // removePlayer(gossipGroup.myId)
    }

    if (action.type === "createdOnlineRoom") {
      const { name } = action.payload

      // addPlayer(gossipGroup.myId, name)
    }

    gossipGroup.send(JSON.stringify(action))

    return actions.gossip(action)
  }
}
