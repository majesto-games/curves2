import { DataType, WebGroupState } from "netflux"
import { Observable } from "rxjs"
import { Duplex } from "stream"
import * as toBuffer from "typedarray-to-buffer"

const END_OF_STREAM = "::endofstream"

export class DataStream extends Duplex {
  private isClosed = false
  private connectionState: WebGroupState = WebGroupState.LEFT
  private readQueue: DataType[] = []
  private writeQueue: [DataType, string, (error?: Error | null) => void][] = []

  constructor(
    message$: Observable<DataType>,
    state$: Observable<WebGroupState>,
    private broadcast: (data: DataType) => void,
  ) {
    super({ decodeStrings: false, objectMode: true })

    state$.subscribe((state) => {
      this.connectionState = state

      if (state === WebGroupState.JOINED) {
        this.open()
      } else if (state === WebGroupState.LEFT) {
        this.close()
      }
    })
    message$.subscribe((data) => this.onMessage(data))

    this.once("finish", this.send.bind(this, END_OF_STREAM))
  }

  _read(size: number) {
    if (this.readQueue.length === 0) {
      return this.once("readable", this._read.bind(this, size))
    }

    while (this.readQueue.length > 0) {
      const next = this.readQueue.shift()

      if (next instanceof ArrayBuffer) {
        this.push(toBuffer(new Uint8Array(next)))
      } else {
        this.push(next)
      }
    }

    return true
  }

  _write(chunk: DataType, encoding: string, callback: (error?: Error | null) => void = function() {}) {
    if (this.isClosed) return false

    const length = this.chunkLength(chunk)

    const maxChunkSize = 1024 * 64
    const chunkCount = Math.ceil(length / maxChunkSize) // Max chunk size = 1024 * 64
    let hasReturned = false

    function progressiveCallback(e: Error) {
      if (hasReturned || !e) return

      hasReturned = true

      return callback(e)
    }

    let result

    for (let i = 0; i < chunkCount; i++) {
      const offset = i * maxChunkSize
      const until = offset + maxChunkSize
      const currentChunk = chunkCount === 1 ? chunk : chunk.slice(offset, until)
      const currentChunkLength = this.chunkLength(currentChunk)

      const currentCallback = chunkCount === i + 1 ? callback : progressiveCallback

      if (this.connectionState === WebGroupState.JOINING) {
        result = this.writeQueue.push([currentChunk, encoding, currentCallback])
      }

      // FIXME: Rest if channel is buffering

      result = this.send(currentChunk, encoding, currentCallback)
    }

    return result
  }

  open() {
    if (this.isClosed) {
      // Clear write queue
      this.writeQueue = []
      return
    }

    while (this.writeQueue.length > 0) {
      this.send.apply(this.writeQueue.shift()!)
    }
  }

  close() {
    this.isClosed = true
    this.emit("close")
    this.emit("end")

    return false
  }

  onMessage(data: DataType) {
    if (typeof data === "string" && data === END_OF_STREAM) {
      this.emit("end")
      return
    }

    this.readQueue.push(data)
    this.emit("readable")
  }

  private send(chunk: DataType, encoding: string, callback: (error?: Error | null) => void = function() {}) {
    if (this.isClosed) return false

    this.broadcast(chunk)

    return callback()
  }

  private chunkLength(chunk: any) {
    return chunk.length || chunk.byteLength || chunk.size
  }
}
