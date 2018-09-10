import { DataType, WebGroup, WebGroupState } from "netflux"
import * as RArray from "r-array"
import { Subject } from "rxjs"
import { filter, map } from "rxjs/operators"

import { DataStream } from "./datastream"

export const configureMesh = (webGroup: WebGroup): any => {
  const model = new RArray()

  const message$ = new Subject<[number, DataType]>()
  const state$ = new Subject<WebGroupState>()
  const dataStreams: Record<number, DataStream> = {}

  webGroup.onMessage = (id, data) => message$.next([id, data])
  webGroup.onStateChange = (state) => state$.next(state)
  webGroup.onMemberJoin = (id) => {
    const reader = model.createReadStream()
    const writer = model.createWriteStream()
    const stream = new DataStream(
      message$.pipe(
        filter(([peer]) => peer === id),
        map(([_, data]) => data),
      ),
      state$,
      (data) => webGroup.send(data),
    )

    reader.pipe(stream).pipe(writer)
    writer.on("sync", model.emit.bind(model, "sync"))

    dataStreams[id] = stream
  }
  webGroup.onMemberLeave = (id) => dataStreams[id].close()

  return model
}
