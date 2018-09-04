import { applyMiddleware, createStore } from "redux"
import { createLogger } from "redux-logger"
import { ActionType, getType } from "typesafe-actions"

import * as actions from "./actions"
import { mergeFloat32, mergeUint16 } from "./shared"

const state = require("./state.json")

const meshes = state.tails

meshes[0].vertices = new Float32Array(meshes[0].vertices)
meshes[0].uvs = new Float32Array(meshes[0].uvs)
meshes[0].indices = new Uint16Array(meshes[0].indices)
meshes[1].vertices = new Float32Array(meshes[1].vertices)
meshes[1].uvs = new Float32Array(meshes[1].uvs)
meshes[1].indices = new Uint16Array(meshes[1].indices)

console.log(meshes)

export type GameAction = ActionType<typeof actions>

export type ClientMesh = {
  vertices: Float32Array
  uvs: Float32Array
  indices: Uint16Array
}

export type ClientTail = {
  meshes: ClientMesh[]
}

export type ClientState = {
  players: number[]
  tails: { [owner: number]: ClientTail }
}

const initialState: ClientState = {
  players: [],
  tails: [{ meshes }],
}

const reducer = (state: ClientState = initialState, action: GameAction) => {
  if (action.type === getType(actions.playerJoin)) {
    const { id } = action.payload
    return { ...state, players: state.players.concat([id]) }
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

export const store = createStore(reducer, applyMiddleware(createLogger({ collapsed: true })))
