import { createAction } from "typesafe-actions"

import { PlayerID, TailPart, VerticeGroup } from "./shared"

export const playerJoin = createAction("playerJoin", (resolve) => (id: number) => resolve({ id }))
export const addTail = createAction("addTail", (resolve) => (vertices: VerticeGroup, owner: PlayerID) =>
  resolve({ vertices, owner } as TailPart),
)
