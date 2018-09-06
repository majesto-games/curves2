import { createAction } from "typesafe-actions"

import { Message } from "./client"
import { LocalGroup, OnlineGroup } from "./groups"
import { PlayerID, TailPart, VerticeGroup } from "./shared"

export const createOnlineRoom = createAction("createOnlineRoom", (resolve) => () => resolve())
export const createdOnlineRoom = createAction("createdOnlineRoom", (resolve) => (name: string) => resolve({ name }))
export const createLocalRoom = createAction("createLocalRoom", (resolve) => () => resolve())
export const addLocalPlayer = createAction("addLocalPlayer", (resolve) => () => resolve())
export const joinOnlineRoom = createAction("joinOnlineRoom", (resolve) => (name: string) => resolve({ name }))
export const createOnlineGroup = createAction("createOnlineGroup", (resolve) => (instance: OnlineGroup) =>
  resolve({ instance }),
)
export const createLocalGroup = createAction("createLocalGroup", (resolve) => (instance: LocalGroup) =>
  resolve({ instance }),
)
export const leaveRoom = createAction("leaveRoom", (resolve) => () => resolve())
export const removeGroup = createAction("removeGroup", (resolve) => () => resolve())
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
