import { applyMiddleware, createStore } from "redux"
import { createLogger } from "redux-logger"
import { ActionType, getType } from "typesafe-actions"

import * as actions from "./actions"
import { TailPart } from "./shared"

export type GameAction = ActionType<typeof actions>

type ServerTail = {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  parts: TailPart[]
  vertices: number[][]
}

type State = {
  players: number[]
  tails: { [owner: number]: ServerTail }
}

const initialState: State = {
  players: [],
  tails: [],
}

const reducer = (state: State = initialState, action: GameAction) => {
  if (action.type === getType(actions.playerJoin)) {
    const { id } = action.payload
    return { ...state, players: state.players.concat([id]) }
  }

  if (action.type === getType(actions.addTail)) {
    const { owner, vertices } = action.payload

    let { xMin, xMax, yMin, yMax } = state.tails[owner]

    for (let i = 0; i < 4; i += 2) {
      const x = vertices[i]
      const y = vertices[i + 1]

      xMin = Math.min(x, xMin)
      xMax = Math.max(x, xMax)
      yMin = Math.min(y, yMin)
      yMax = Math.max(y, yMax)
    }

    const newParts = state.tails[owner].parts.concat([action.payload])
    const newVertices = state.tails[owner].vertices.concat([vertices])

    return {
      ...state,
      tails: { ...state.tails, [owner]: { xMin, xMax, yMin, yMax, parts: newParts, vertices: newVertices } },
    }
  }

  return state
}

export const store = createStore(reducer, applyMiddleware(createLogger({ collapsed: true })))
