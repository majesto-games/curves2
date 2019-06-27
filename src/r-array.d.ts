import { Readable, Writable } from "stream"

declare module "r-array" {
  type StreamOptions = {
    readable: boolean
    writeable: boolean
  }
  export default class RArray<T> {
    constructor()
    addListener(type: string, listener: any): any
    applyUpdate(update: any): any
    clone(): any
    createReadStream(opts?: StreamOptions): Readable
    createStream(opts?: StreamOptions): any
    createWriteStream(opts?: StreamOptions): Writable
    dispose(): void
    emit(type: string, args?: any): any
    eventNames(): any
    filter(fun: any): any
    first(): any
    forEach(fun: any): any
    get(key: any): any
    getMaxListeners(): any
    history(sources: any): any
    indexOf(val: any): any
    indexOfKey(key: any): any
    insert(before: any, val: any, after: any): any
    last(): any
    listenerCount(type: string): any
    listeners(type: string): any
    localUpdate(trx: any): any
    map(fun: any): any
    off(type: string, listener: any): any
    on(type: string, listener: any): any
    once(type: string, listener: any): any
    pop(): T
    prependListener(type: string, listener: any): any
    prependOnceListener(type: string, listener: any): any
    push(val: T): void
    rawListeners(type: string): any
    reduce(fun: any, initial: any): any
    removeAllListeners(type: string, ...args: any[]): any
    removeListener(type: string, listener: any): any
    set(key: any, val: any): any
    setId(id: any): any
    setMaxListeners(n: any): any
    shift(): TextTrackCue
    splice(i: number, d: number, ...args: T[]): void
    toJSON(): T[]
    unset(key: any): void
    unshift(val: any): void
  }
}
