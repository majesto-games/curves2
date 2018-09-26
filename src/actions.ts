import { AnyAction } from "redux"
import { createAction } from "typesafe-actions"

import { LocalGroup, OnlineGroup } from "./groups"
import { Message } from "./stores/client"
import { PlayerID, TailPart, VerticeGroup } from "./utils"

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
export const leaveRoom = createAction("leaveRoom", (resolve) => (name: string, isHost: boolean) =>
  resolve({ name, isHost }),
)
export const rooms = createAction("rooms", (resolve) => (rooms: string[]) => resolve({ rooms }))
// export const rooms = createAction("rooms", (resolve) => (rooms: string[]) => resolve({ rooms }))
export const gossip = createAction("gossip", (resolve) => (action: AnyAction) => resolve({ action }))
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

export const onlineStatus = createAction("onlineStatus", (resolve) => (online: boolean) => resolve(online))
