import { createAction } from "typesafe-actions"

import { Message } from "./client"
import { PlayerID, TailPart, VerticeGroup } from "./shared"

export const roomJoin = createAction("roomJoin", (resolve) => (name: string, isHost = false) =>
  resolve({ name, isHost }),
)
export const roomLeave = createAction("roomLeave", (resolve) => () => resolve())
export const disconnected = createAction("disconnected", (resolve) => (reason: "hostDisconnect" | "offline") =>
  resolve({ reason }),
)
export const playerJoin = createAction("playerJoin", (resolve) => (id: number) => resolve({ id }))
export const playerLeave = createAction("playerLeave", (resolve) => (id: number) => resolve({ id }))
export const isHost = createAction("isHost", (resolve) => () => resolve())
export const addTail = createAction("addTail", (resolve) => (vertices: VerticeGroup, owner: PlayerID) =>
  resolve({ vertices, owner } as TailPart),
)

export const showMessage = createAction("showMessage", (resolve) => (message: Message) => resolve(message))
export const dismissMessage = createAction("dismissMessage", (resolve) => () => resolve())
