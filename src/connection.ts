import { WebGroup, WebGroupState } from "netflux"
import { Dispatch } from "redux"
import { ActionType } from "typesafe-actions"

import * as actions from "./actions"

type ConnectionAction = ActionType<typeof actions>

interface ConnectionGroup {
  send(action: ConnectionAction): void
  host(room: string): void
  join(room: string): void
  leave(): void
}

export type ConnectionGroupConstructor = {
  new (dispatch: Dispatch<ConnectionAction>): ConnectionGroup
}

// TODO: Finish this
export class LocalGroup implements ConnectionGroup {
  members: number[] = []

  constructor(private dispatch: Dispatch) {}

  send(action: ConnectionAction) {
    if (action.type === "playerJoin") {
      console.log("playerJoin", action.payload.id)
      this.dispatch(actions.playerJoin(action.payload.id))
    }

    if (action.type === "playerLeave") {
      console.log("playerLeave", action.payload.id)
      this.dispatch(actions.playerLeave(action.payload.id))
    }
  }

  host(room: string) {
    this.dispatch(actions.roomJoin(room))
  }

  join(room: string) {
    this.dispatch(actions.roomJoin(room))
  }

  leave() {
    this.dispatch(actions.roomLeave())
  }
}

export class OnlineGroup implements ConnectionGroup {
  private wg: WebGroup
  private hostId: number

  constructor(private dispatch: Dispatch) {}

  initialize() {
    this.wg = new WebGroup()
    this.wg.onMemberJoin = (id) => {
      if (this.isHost()) {
        this.wg.sendTo(id, JSON.stringify(actions.isHost()))

        // TODO: This should be done more efficiently
        this.wg.members.forEach((m) => this.wg.send(JSON.stringify(actions.playerJoin(m))))
        this.dispatch(actions.playerJoin(id))
      }
    }

    this.wg.onMemberLeave = (id) => {
      if (this.isHost()) {
        this.wg.send(JSON.stringify(actions.playerLeave(id)))
        this.dispatch(actions.playerLeave(id))
      }
    }

    this.wg.onMessage = (id, data: string) => {
      const msg: ConnectionAction = JSON.parse(data)

      if (msg.type === "isHost") {
        console.log("isHost", id)
        this.hostId = id
        // dispatch(actions.playerJoin(id))
      }

      // Ignore messages not coming from the host
      if (id !== this.hostId) return

      if (msg.type === "playerJoin") {
        this.dispatch(actions.playerJoin(msg.payload.id))
      }

      if (msg.type === "playerLeave") {
        this.dispatch(actions.playerLeave(msg.payload.id))
      }
    }

    this.wg.onStateChange = (state) => {
      if (state === WebGroupState.JOINED) {
        this.dispatch(actions.roomJoin(this.wg.key))
        if (this.isHost()) {
          this.dispatch(actions.isHost())
          this.dispatch(actions.playerJoin(this.wg.myId))
        }
      }
      if (state === WebGroupState.LEFT) {
        this.dispatch(actions.roomLeave())
      }
    }
  }

  host(room: string) {
    this.initialize()
    this.wg.onMyId = (id) => (this.hostId = id)
    this.wg.join(room)
  }

  join(room: string) {
    this.initialize()
    this.wg.join(room)
  }

  send(action: ConnectionAction) {
    if (this.isHost()) {
      this.wg.send(JSON.stringify(action))
    } else {
      this.wg.sendTo(this.hostId, JSON.stringify(action))
    }
  }

  leave() {
    this.wg.leave()
    delete this.wg
  }

  private isHost() {
    return this.wg.myId === this.hostId
  }
}
