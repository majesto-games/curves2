import { MessageBarType } from "office-ui-fabric-react"
import { combineEpics, Epic } from "redux-observable"
import { filter, map, tap } from "rxjs/operators"
import { ActionType, isActionOf } from "typesafe-actions"

import { history } from "."
import * as actions from "./actions"
import { ClientState } from "./client"

export type RootAction = ActionType<typeof actions>

const disconnect: Epic<RootAction> = (action$) =>
  action$.pipe(
    filter(isActionOf(actions.disconnected)),
    tap((action) => {
      console.log(action)
      history.replace("/")
    }),
    map(({ payload: { reason } }) => {
      if (reason === "hostDisconnect") {
        return actions.showMessage({
          type: MessageBarType.error,
          text: "The room has been destroyed because of the host disconnecting.",
        })
      }

      return actions.showMessage({
        type: MessageBarType.error,
        text: "Network disconnected.",
      })
    }),
  )

const roomJoined: Epic<RootAction> = (action$) =>
  action$.pipe(
    filter(isActionOf(actions.roomJoin)),
    filter((action) => action.payload.isHost),
    map(({ payload: { name } }) =>
      actions.showMessage({
        type: MessageBarType.success,
        text: "Successfully created room '" + name + "'.",
      }),
    ),
  )

const playerJoined: Epic<RootAction, RootAction, ClientState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.playerJoin)),
    filter(() => state$.value.room.players.length > 1),
    map(({ payload: { id } }) =>
      actions.showMessage({
        type: MessageBarType.info,
        text: id + " joined the room.",
      }),
    ),
  )

const playerLeft: Epic<RootAction, RootAction, ClientState> = (action$) =>
  action$.pipe(
    filter(isActionOf(actions.playerLeave)),
    map(({ payload: { id } }) =>
      actions.showMessage({
        type: MessageBarType.info,
        text: id + " left the room.",
      }),
    ),
  )

export const rootEpic = combineEpics(disconnect, roomJoined, playerJoined, playerLeft)
