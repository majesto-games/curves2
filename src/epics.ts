import { MessageBarType } from "office-ui-fabric-react"
import { combineEpics, Epic } from "redux-observable"
import { filter, ignoreElements, map, tap } from "rxjs/operators"
import { ActionType, isActionOf } from "typesafe-actions"

import { history } from "."
import * as actions from "./actions"
import { ClientState, store as clientStore } from "./client"
import { LocalGroup, OnlineGroup } from "./connection"

export type RootAction = ActionType<typeof actions>

const notifyWhenDisconnected: Epic<RootAction> = (action$) =>
  action$.pipe(
    filter(isActionOf(actions.disconnect)),
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

const notifyWhenPlayerJoins: Epic<RootAction, RootAction, ClientState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.playerJoin)),
    filter(() => state$.value.room.group !== null && state$.value.room.group.online),
    filter(() => state$.value.room.players.length > 1),
    map(({ payload: { id } }) =>
      actions.showMessage({
        type: MessageBarType.info,
        text: id + " joined the room.",
      }),
    ),
  )

const notifyWhenPlayerLeaves: Epic<RootAction, RootAction, ClientState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.playerLeave)),
    filter(() => state$.value.room.group !== null && state$.value.room.group.online),
    map(({ payload: { id } }) =>
      actions.showMessage({
        type: MessageBarType.info,
        text: id + " left the room.",
      }),
    ),
  )

const notifyWhenCreatingOnlineRoom: Epic<RootAction, RootAction, ClientState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.createOnlineRoom)),
    map(({ payload: { name } }) =>
      actions.showMessage({
        type: MessageBarType.success,
        text: "Successfully created room '" + name + "'.",
      }),
    ),
  )

const createGroupWhenCreatingOnlineRoom: Epic<RootAction, RootAction, ClientState> = (action$) =>
  action$.pipe(
    filter(isActionOf(actions.createOnlineRoom)),
    tap(({ payload: { name } }) => {
      history.push("/room/" + name)
    }),
    map(({ payload: { name } }) => {
      const group = new OnlineGroup(clientStore.dispatch)

      group.host(name)

      return group
    }),
    map((group) => actions.createGroup(group)),
  )

const createGroupWhenCreatingLocalRoom: Epic<RootAction, RootAction, ClientState> = (action$) =>
  action$.pipe(
    filter(isActionOf(actions.createLocalRoom)),
    tap(() => {
      history.push("/room/" + "local")
    }),
    map(() => {
      const group = new LocalGroup(clientStore.dispatch)

      group.host()

      return group
    }),
    map((group) => actions.createGroup(group)),
  )

const createGroupWhenJoiningRoom: Epic<RootAction, RootAction, ClientState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.joinOnlineRoom)),
    tap(({ payload: { name } }) => {
      history.push("/room/" + name)
    }),
    map(({ payload: { name } }) => {
      const group = new OnlineGroup(clientStore.dispatch)

      group.join(name)

      return actions.createGroup(group)
    }),
  )

const leaveGroupWhenLeavingRoom: Epic<RootAction, RootAction, ClientState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.leaveRoom)),
    tap(() => {
      if (state$.value.room.group) {
        state$.value.room.group.instance.leave()
      }

      history.push("/")
    }),
    ignoreElements(),
  )

const addLocalPlayerToOnlineRoom: Epic<RootAction, RootAction, ClientState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.addLocalPlayer)),
    filter(() => state$.value.room.group !== null && state$.value.room.group.online),
    tap(() => {
      if (state$.value.room.group) {
        // state$.value.room.group.instance.add()
      }
    }),
    ignoreElements(),
  )

const addLocalPlayerToLocalRoom: Epic<RootAction, RootAction, ClientState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.addLocalPlayer)),
    filter(() => state$.value.room.group !== null && !state$.value.room.group.online),
    tap(() => {
      if (state$.value.room.group) {
        state$.value.room.group.instance.join()
      }
    }),
    ignoreElements(),
  )

export const rootEpic = combineEpics(
  notifyWhenDisconnected,
  notifyWhenPlayerJoins,
  notifyWhenPlayerLeaves,
  notifyWhenCreatingOnlineRoom,
  createGroupWhenCreatingOnlineRoom,
  createGroupWhenCreatingLocalRoom,
  createGroupWhenJoiningRoom,
  leaveGroupWhenLeavingRoom,
  addLocalPlayerToOnlineRoom,
  addLocalPlayerToLocalRoom,
)
