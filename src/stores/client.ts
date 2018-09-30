import { MessageBarType } from "office-ui-fabric-react"
import { applyMiddleware, createStore } from "redux"
import { createLogger } from "redux-logger"
import { createEpicMiddleware } from "redux-observable"
import { ActionType, getType } from "typesafe-actions"

import * as actions from "../actions"
import { rootEpic } from "../epics"
import { LocalGroup, OnlineGroup } from "../groups"
import { mergeFloat32, mergeUint16 } from "../utils"

// Temporary tail mesh data
const state = require("../state.json")

// Rehydrate temporary tail mesh data
const meshes = state.tails.map(
  ({ vertices, uvs, indices }: { vertices: number[]; uvs: number[]; indices: number[] }) => ({
    vertices: new Float32Array(vertices),
    uvs: new Float32Array(uvs),
    indices: new Uint16Array(indices),
  }),
)

export type GameAction = ActionType<typeof actions>

export type Room = {
  name: string
  players: number
}

export type ClientMesh = {
  vertices: Float32Array
  uvs: Float32Array
  indices: Uint16Array
}

export type ClientTail = {
  meshes: ClientMesh[]
}

export type RoomState = {
  name: string | null
  isHost: boolean
  players: number[]
  group: { online: true; instance: OnlineGroup } | { online: false; instance: LocalGroup } | null
}

export type Message = { id: string; type: MessageBarType; text: string }

export const MESSAGE_TIMEOUT = 5000

export type ClientState = {
  room: RoomState
  tails: { [owner: number]: ClientTail }
  messages: Message[]
  rooms: Room[]
  online: boolean
}

const initialRoomState: RoomState = {
  name: null,
  isHost: false,
  players: [],
  group: null,
}

const initialState: ClientState = {
  room: initialRoomState,
  tails: [{ meshes }],
  messages: [],
  rooms: [],
  online: true,
}

const reducer = (state: ClientState = initialState, action: GameAction): ClientState => {
  if (action.type === getType(actions.playerJoin)) {
    const { id } = action.payload

    // TODO: This should be done more efficiently
    if (state.room.players.indexOf(id) !== -1) {
      return state
    }

    return { ...state, room: { ...state.room, players: state.room.players.concat([id]) } }
  }

  if (action.type === getType(actions.playerLeave)) {
    const { id } = action.payload

    return { ...state, room: { ...state.room, players: state.room.players.filter((pId) => pId !== id) } }
  }

  if (action.type === getType(actions.leaveRoom) || action.type === getType(actions.createOnlineRoom)) {
    // Retain group because we use it's reference to call .leave() at a later stage
    // see removeGroupWhenLeavingRoom in epics.ts
    return { ...state, room: { ...initialRoomState, group: state.room.group } }
  }

  if (action.type === getType(actions.removeGroup)) {
    return { ...state, room: { ...state.room, group: null } }
  }

  if (action.type === getType(actions.joinOnlineRoom)) {
    const { name } = action.payload

    return { ...state, room: { ...state.room, name, players: [] } }
  }

  if (action.type === getType(actions.showMessage)) {
    return { ...state, messages: state.messages.concat([action.payload]) }
  }

  if (action.type === getType(actions.dismissMessage)) {
    return { ...state, messages: state.messages.filter((message) => message.id !== action.payload) }
  }

  if (action.type === getType(actions.createdOnlineRoom)) {
    const { name } = action.payload

    return { ...state, room: { ...state.room, name, isHost: true, players: [] } }
  }

  if (action.type === getType(actions.createLocalRoom)) {
    return { ...state, room: { ...state.room, name: "", isHost: true, players: [] } }
  }

  if (action.type === getType(actions.createOnlineGroup)) {
    const { instance } = action.payload

    return { ...state, room: { ...state.room, group: { online: true, instance } } }
  }

  if (action.type === getType(actions.createLocalGroup)) {
    const { instance } = action.payload

    return { ...state, room: { ...state.room, group: { online: false, instance } } }
  }

  if (action.type === getType(actions.rooms)) {
    const { rooms } = action.payload

    return { ...state, rooms }
  }

  if (action.type === getType(actions.onlineStatus)) {
    return { ...state, online: action.payload }
  }

  if (action.type === getType(actions.addTail)) {
    const { owner, vertices } = action.payload

    const [h1x, h1y, h2x, h2y, l2x, l2y, l1x, l1y] = vertices
    const mid1x = (l1x + h1x) / 2
    const mid1y = (l1y + l1y) / 2
    const mid2x = (l2x + h2x) / 2
    const mid2y = (l2y + l2y) / 2

    // TODO: Used for UVs
    const angle = Math.atan2(mid2y - mid1y, mid2x - mid1x)
    const length = Math.sqrt(Math.pow(mid1x - mid2x, 2) + Math.pow(mid1y - mid2y, 2))
    const width1 = Math.sqrt(Math.pow(h1x - l1x, 2) + Math.pow(h1y - l1y, 2)) / 2
    const width2 = Math.sqrt(Math.pow(h2x - l2x, 2) + Math.pow(h2y - l2y, 2)) / 2

    let lastMesh = state.tails[owner].meshes[state.tails[owner].meshes.length - 1]

    if (!lastMesh) {
      lastMesh = {
        vertices: new Float32Array([l1x, l1y, h1x, h1y]),
        uvs: new Float32Array([]), // TODO: I guess this should not be empty
        indices: new Uint16Array([0, 1]),
      }
    }

    const newVertices = new Float32Array([l2x, l2y, h2x, h2y])
    const newIndices = new Uint16Array([lastMesh.indices.length, lastMesh.indices.length + 1])

    const newMesh: ClientMesh = {
      vertices: mergeFloat32(lastMesh.vertices, newVertices),
      indices: mergeUint16(lastMesh.indices, newIndices),
      uvs: lastMesh.uvs,
    }

    const newMeshes = state.tails[owner].meshes.concat([newMesh])

    return {
      ...state,
      tails: { ...state.tails, [owner]: { meshes: newMeshes } },
    }
  }

  return state
}

export const configureStore = (initialState?: ClientState) => {
  const epicMiddleware = createEpicMiddleware()
  const store = initialState
    ? createStore(reducer, initialState, applyMiddleware(createLogger({ collapsed: true }), epicMiddleware))
    : createStore(reducer, applyMiddleware(createLogger({ collapsed: true }), epicMiddleware))
  epicMiddleware.run(rootEpic)

  return store
}

export const isLoading = (state: ClientState) =>
  state.room.name === null && (state.room.group !== null && state.room.group.online)
