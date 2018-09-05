import { WebGroup, WebGroupState } from "netflux"
import { Dispatch } from "redux"
import { ActionType } from "typesafe-actions"

import * as actions from "./actions"

type ConnectionAction = ActionType<typeof actions>

export interface ConnectionGroup {
  send: (action: ConnectionAction) => void
  host: (room?: string) => void
  join: (room?: string) => void
  leave: () => void
}

export type ConnectionGroupConstructor = {
  new (dispatch: Dispatch<ConnectionAction>): ConnectionGroup
}

export class LocalGroup implements ConnectionGroup {
  members: number[] = []

  constructor(private dispatch: Dispatch) {}

  send = (action: ConnectionAction) => {
    if (action.type === "playerJoin") {
      console.log("playerJoin", action.payload.id)
      this.dispatch(actions.playerJoin(action.payload.id))
    }

    if (action.type === "playerLeave") {
      console.log("playerLeave", action.payload.id)
      this.dispatch(actions.playerLeave(action.payload.id))
    }
  }

  host = () => {
    this.join()
  }

  join = () => {
    const r = crypto.getRandomValues(new Uint32Array(1))
    const id = r[0] > 2147483648 ? r[0] : r[0] + 2147483648
    this.members.push(id)

    this.dispatch(actions.playerJoin(id))
  }

  leave = () => {
    const id = this.members.pop()
    if (id) {
      this.dispatch(actions.playerLeave(id))
    }
  }
}

export class OnlineGroup implements ConnectionGroup {
  private wg: WebGroup
  private hostId: number
  private leaving = false

  constructor(private dispatch: Dispatch) {}

  initialize = () => {
    this.leaving = false
    // setLogLevel(
    //   LogLevel.DEBUG,
    //   LogLevel.WEB_GROUP,
    //   LogLevel.WEBRTC,
    //   LogLevel.CHANNEL,
    //   LogLevel.TOPOLOGY,
    //   LogLevel.SIGNALING,
    //   LogLevel.CHANNEL_BUILDER,
    // )
    this.wg = new WebGroup()
    this.wg.onMemberJoin = (id) => {
      if (this.isHost()) {
        this.wg.sendTo(id, JSON.stringify(actions.isHost()))

        this.wg.members
          .filter((m) => m !== id)
          .forEach((m) => this.wg.sendTo(id, JSON.stringify(actions.playerJoin(m))))
        this.wg.send(JSON.stringify(actions.playerJoin(id)))

        this.dispatch(actions.playerJoin(id))
      }
    }

    this.wg.onMemberLeave = (id) => {
      if (this.isHost()) {
        this.wg.send(JSON.stringify(actions.playerLeave(id)))
        this.dispatch(actions.playerLeave(id))
      } else {
        // Host has left the room, disconnect
        if (id === this.hostId && !this.leaving) {
          this.dispatch(actions.disconnect("hostDisconnect"))
        }
      }
    }

    this.wg.onMessage = (id, data: string) => {
      const msg: ConnectionAction = JSON.parse(data)

      if (msg.type === "isHost") {
        this.hostId = id
      }

      if (msg.type === "playerLeave") {
        this.dispatch(actions.playerLeave(msg.payload.id))
        if (this.isHost()) {
          this.wg.send(JSON.stringify(actions.playerLeave(msg.payload.id)))
        }
      }

      // Ignore messages not coming from the host
      if (id !== this.hostId) return

      if (msg.type === "playerJoin") {
        this.dispatch(actions.playerJoin(msg.payload.id))
      }
    }

    this.wg.onStateChange = (state) => {
      if (state === WebGroupState.JOINED) {
        if (this.isHost()) {
          this.dispatch(actions.playerJoin(this.wg.myId))
        }
      }
      if (state === WebGroupState.LEFT) {
      }
    }
  }

  host = (room: string) => {
    this.initialize()
    this.wg.onMyId = (id) => (this.hostId = id)
    this.wg.join(room)
  }

  join = (room: string) => {
    this.initialize()
    this.wg.join(room)
  }

  send = (action: ConnectionAction) => {
    if (this.isHost()) {
      this.wg.send(JSON.stringify(action))
    } else {
      this.wg.sendTo(this.hostId, JSON.stringify(action))
    }
  }

  leave = () => {
    this.leaving = true
    if (this.wg) {
      this.wg.sendTo(this.hostId, JSON.stringify(actions.playerLeave(this.wg.myId)))
      this.wg.leave()
    }
  }

  private isHost = () => this.wg.myId === this.hostId
}
