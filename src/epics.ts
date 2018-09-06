import { MessageBarType } from "office-ui-fabric-react"
import { combineEpics, Epic } from "redux-observable"
import { filter, ignoreElements, map, tap } from "rxjs/operators"
import { ActionType, isActionOf } from "typesafe-actions"

import { history } from "."
import * as actions from "./actions"
import { ClientState, store as clientStore } from "./client"
import { LocalGroup, OnlineGroup } from "./groups"

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
    filter(() => state$.value.room.players.length > 0),
    map(({ payload: { id } }) =>
      actions.showMessage({
        type: MessageBarType.info,
        text: id + " left the room.",
      }),
    ),
  )

const notifyWhenCreatedOnlineRoom: Epic<RootAction, RootAction, ClientState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.createdOnlineRoom)),
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
    map(() => {
      const group = new OnlineGroup(clientStore.dispatch)

      group.host()

      return group
    }),
    map((group) => actions.createOnlineGroup(group)),
  )

const redirectWhenCreatedOnlineRoom: Epic<RootAction, RootAction, ClientState> = (action$) =>
  action$.pipe(
    filter(isActionOf(actions.createdOnlineRoom)),
    tap(({ payload: { name } }) => history.push("/room/" + name)),
    ignoreElements(),
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
    map((group) => actions.createLocalGroup(group)),
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

      return actions.createOnlineGroup(group)
    }),
  )

const removeGroupWhenLeavingRoom: Epic<RootAction, RootAction, ClientState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.leaveRoom)),
    tap(() => {
      // Tell the group instance that it should leave the group
      state$.value.room.group && state$.value.room.group.instance.leave()

      history.push("/")
    }),
    map(() => actions.removeGroup()),
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
    tap(() => {
      if (state$.value.room.group && !state$.value.room.group.online) {
        state$.value.room.group.instance.join()
      }
    }),
    ignoreElements(),
  )

export const rootEpic = combineEpics(
  notifyWhenDisconnected,
  notifyWhenPlayerJoins,
  notifyWhenPlayerLeaves,
  notifyWhenCreatedOnlineRoom,
  createGroupWhenCreatingOnlineRoom,
  createGroupWhenCreatingLocalRoom,
  createGroupWhenJoiningRoom,
  addLocalPlayerToOnlineRoom,
  addLocalPlayerToLocalRoom,
  redirectWhenCreatedOnlineRoom,
  removeGroupWhenLeavingRoom,
)
