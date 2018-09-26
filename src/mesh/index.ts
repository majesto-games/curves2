import { DataType, WebGroup, WebGroupState } from "netflux"
import RArray from "r-array"
import { Subject } from "rxjs"
import { filter, map } from "rxjs/operators"

import { DataStream } from "./datastream"

export const configureMesh = (webGroup: WebGroup, model = new RArray<string>()) => {
  const message$ = new Subject<[number, DataType]>()
  const state$ = new Subject<WebGroupState>()
  const dataStreams: Record<number, DataStream> = {}

  const onMessage = webGroup.onMessage
  webGroup.onMessage = (id, data) => {
    // console.log("mesh", "onMessage", data)
    message$.next([id, data])
    if (onMessage) onMessage.call(webGroup, id, data)
  }

  const onStateChange = webGroup.onStateChange
  webGroup.onStateChange = (state) => {
    // console.log("mesh", "onStateChange", WebGroupState[state])
    state$.next(state)
    if (onStateChange) onStateChange.call(webGroup, state)
  }

  const onSignalingStateChange = webGroup.onSignalingStateChange
  webGroup.onSignalingStateChange = (state) => {
    // console.log("mesh", "onSignalingStateChange", SignalingState[state])
    if (onSignalingStateChange) onSignalingStateChange.call(webGroup, state)
  }

  const onMemberJoin = webGroup.onMemberJoin
  webGroup.onMemberJoin = (id) => {
    // console.log("mesh", "onMemberJoin")
    const reader = model.createReadStream()
    const writer = model.createWriteStream()
    const stream = new DataStream(
      message$.pipe(
        filter(([peer]) => peer === id),
        map(([_, data]) => data),
      ),
      state$,
      (data) => webGroup.sendTo(id, data),
    )

    reader.pipe(stream).pipe(writer)
    writer.on("sync", () => model.emit("sync"))

    dataStreams[id] = stream
    if (onMemberJoin) onMemberJoin.call(webGroup, id)
  }

  const onMemberLeave = webGroup.onMemberLeave
  webGroup.onMemberLeave = (id) => {
    // console.log("mesh", "onMemberLeave")
    dataStreams[id].close()
    delete dataStreams[id]

    if (onMemberLeave) onMemberLeave.call(webGroup, id)
  }

  return model
}
