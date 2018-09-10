import { DataType, WebGroupState } from "netflux"
import { Observable } from "rxjs"
import { Duplex } from "stream"

const END_OF_STREAM = "::endofstream"

export class DataStream extends Duplex {
  private isClosed = false
  private connectionState: WebGroupState = WebGroupState.LEFT
  private readQueue: DataType[] = []
  private writeQueue: [DataType, "buffer", (error?: Error | null) => void][] = []

  constructor(
    message$: Observable<DataType>,
    state$: Observable<WebGroupState>,
    private send: (data: DataType) => void,
  ) {
    super({ decodeStrings: false })

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

      if (typeof next === "string") {
        this.push(next)
      }
    }

    return true
  }

  _write(chunk: DataType, encoding: "buffer", callback: (error?: Error | null) => void) {
    if (this.isClosed) return false

    const result =
      this.connectionState === WebGroupState.JOINING
        ? this.writeQueue.push([chunk, encoding, callback])
        : this._send(chunk, encoding, callback)

    return result
  }

  open() {
    if (this.isClosed) {
      this.writeQueue = []

      return
    }

    while (this.writeQueue.length > 0) {
      this._send.apply(this.writeQueue.shift()!)
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
    } else {
      this.readQueue.push(data)
      this.emit("readable")
    }
  }

  private _send(chunk: DataType, encoding: "buffer", callback: (error?: Error | null) => void) {
    if (this.isClosed) return false
    this.send(chunk)
    return callback()
  }
}
