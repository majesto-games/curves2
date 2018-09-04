import { createAction } from "typesafe-actions"

import { PlayerID, TailPart, VerticeGroup } from "./shared"

export const roomJoin = createAction("roomJoin", (resolve) => (name: string) => resolve({ name }))
export const roomLeave = createAction("roomLeave", (resolve) => () => resolve())
export const playerJoin = createAction("playerJoin", (resolve) => (id: number) => resolve({ id }))
export const playerLeave = createAction("playerLeave", (resolve) => (id: number) => resolve({ id }))
export const isHost = createAction("isHost", (resolve) => () => resolve())
export const addTail = createAction("addTail", (resolve) => (vertices: VerticeGroup, owner: PlayerID) =>
  resolve({ vertices, owner } as TailPart),
)
