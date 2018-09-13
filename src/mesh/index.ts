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
    message$.next([id, data])
    onMessage && onMessage.call(webGroup, id, data)
  }

  const onStateChange = webGroup.onStateChange
  webGroup.onStateChange = (state) => {
    state$.next(state)
    onStateChange && onStateChange.call(webGroup, state)
  }

  const onMemberJoin = webGroup.onMemberJoin
  webGroup.onMemberJoin = (id) => {
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
    onMemberJoin && onMemberJoin.call(webGroup, id)
  }

  const onMemberLeave = webGroup.onMemberLeave
  webGroup.onMemberLeave = (id) => {
    dataStreams[id].close()
    delete dataStreams[id]

    onMemberLeave && onMemberLeave.call(webGroup, id)
  }

  return model
}
