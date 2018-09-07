import { WebGroup, WebGroupState } from "netflux"
import { Dispatch } from "redux"
import { randomAdjective, randomNoun } from "sillyname"
import { ActionType } from "typesafe-actions"

import * as actions from "./actions"
import { configureWebGroup } from "./utils"

type GroupAction = ActionType<typeof actions> // TODO: Should not include all actions

export class LocalGroup {
  members: number[] = []

  constructor(private dispatch: Dispatch) {}

  send = (action: GroupAction) => {
    if (action.type === "playerJoin") {
      console.log("playerJoin", action.payload.id)
      this.dispatch(actions.playerJoin(action.payload.id))
    }

    if (action.type === "playerLeave") {
      console.log("playerLeave", action.payload.id)
      this.dispatch(actions.playerLeave(action.payload.id))
    }
  }

  host = () => this.join()

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

export class OnlineGroup {
  private group: WebGroup
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
    this.group = configureWebGroup({
      onMemberJoin: (id) => {
        if (this.isHost()) {
          this.group.sendTo(id, JSON.stringify(actions.isHost()))

          this.group.members
            .filter((m) => m !== id)
            .forEach((m) => this.group.sendTo(id, JSON.stringify(actions.playerJoin(m))))
          this.group.send(JSON.stringify(actions.playerJoin(id)))

          this.dispatch(actions.playerJoin(id))
        }
      },
      onMemberLeave: (id) => {
        if (id !== this.group.myId) {
          this.dispatch(actions.playerLeave(id))
        }

        if (this.isHost()) {
          this.group.send(JSON.stringify(actions.playerLeave(id)))
        } else {
          // Host has left the room, disconnect
          if (id === this.hostId && !this.leaving) {
            this.dispatch(actions.disconnect("hostDisconnect"))
          }
        }
      },
      onMessage: (id, data: string) => {
        const msg: GroupAction = JSON.parse(data)

        if (msg.type === "isHost") {
          this.hostId = id
        }

        if (msg.type === "playerLeave") {
          this.dispatch(actions.playerLeave(msg.payload.id))
          if (this.isHost()) {
            this.group.send(JSON.stringify(actions.playerLeave(msg.payload.id)))
          }
        }

        // Ignore messages not coming from the host
        if (id !== this.hostId) return

        if (msg.type === "playerJoin") {
          this.dispatch(actions.playerJoin(msg.payload.id))
        }
      },
      onStateChange: (state) => {
        if (state === WebGroupState.JOINED) {
          if (this.isHost()) {
            this.dispatch(actions.createdOnlineRoom(this.group.key))
            this.dispatch(actions.playerJoin(this.group.myId))
          }
        }
        if (state === WebGroupState.LEFT) {
          // TODO: Should handle this case
        }
      },
    })
  }

  host = () => {
    this.initialize()
    this.group.onMyId = (id) => (this.hostId = id)

    const name = (randomAdjective() + randomNoun() + "-" + randomNoun()).toLowerCase()

    this.group.join(name)
  }

  join = (room: string) => {
    this.initialize()
    this.group.join(room)
  }

  send = (action: GroupAction) => {
    if (this.isHost()) {
      this.group.send(JSON.stringify(action))
    } else {
      this.group.sendTo(this.hostId, JSON.stringify(action))
    }
  }

  leave = () => {
    this.leaving = true
    if (this.group) {
      this.group.sendTo(this.hostId, JSON.stringify(actions.playerLeave(this.group.myId)))
      this.group.leave()
      delete this.group
    }
  }

  private isHost = () => this.group.myId === this.hostId
}
