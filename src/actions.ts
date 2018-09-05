import { createAction } from "typesafe-actions"

import { Message } from "./client"
import { ConnectionGroup } from "./connection"
import { PlayerID, TailPart, VerticeGroup } from "./shared"

export const createOnlineRoom = createAction("createOnlineRoom", (resolve) => (name: string) => resolve({ name }))
export const createLocalRoom = createAction("createLocalRoom", (resolve) => () => resolve())
export const addLocalPlayer = createAction("addLocalPlayer", (resolve) => () => resolve())
export const joinOnlineRoom = createAction("joinOnlineRoom", (resolve) => (name: string) => resolve({ name }))
export const createGroup = createAction("createGroup", (resolve) => (instance: ConnectionGroup) =>
  resolve({ instance }),
)
export const leaveRoom = createAction("leaveRoom", (resolve) => () => resolve())
export const disconnect = createAction("disconnect", (resolve) => (reason: "hostDisconnect" | "offline") =>
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
