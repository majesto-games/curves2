import { WebGroup, WebGroupOptions } from "netflux"
import webrtcsupport from "webrtcsupport"

export type PlayerID = number
export type VerticeGroup = [number, number, number, number, number, number, number, number]

export type TailPart = {
  vertices: VerticeGroup
  owner: PlayerID
}

export function mergeFloat32(a: Float32Array, b: Float32Array): Float32Array {
  const c = new Float32Array(a.length + b.length)
  c.set(a)
  c.set(b, a.length)

  return c
}

export function mergeUint16(a: Uint16Array, b: Uint16Array): Uint16Array {
  const c = new Uint16Array(a.length + b.length)
  c.set(a)
  c.set(b, a.length)

  return c
}

type HandlerName = "onMemberJoin" | "onMemberLeave" | "onMessage" | "onStateChange" | "onSignalingStateChange"
type Handlers = { [N in HandlerName]?: NonNullable<typeof WebGroup.prototype[N]> | undefined }

/**
 * Set event handlers for a group instance
 * @param instance WebGroup instance to apply handlers to
 * @param handlers Map of event handlers
 */
const setWebGroupEventHandlers = (instance: WebGroup, handlers?: Handlers) => {
  if (handlers) {
    for (const name in handlers) {
      if (handlers[name]) {
        instance[name] = handlers[name]
      }
    }
  }

  return instance
}

export const configureWebGroup = (handlers?: Handlers, options?: WebGroupOptions) =>
  setWebGroupEventHandlers(new WebGroup({ signalingServer: "wss://sigver.app.sodapop.se", ...options }), handlers)

export function supportsWebRTC() {
  return webrtcsupport.supportDataChannel
}

export function debounce(func: (...args: any[]) => any, wait: number, immediate = false) {
  let timeout: number | null
  let args: IArguments | null
  let context: any
  let timestamp: number
  let result: any

  if (null == wait) wait = 100

  function later() {
    var last = Date.now() - timestamp

    if (last < wait && last >= 0) {
      timeout = window.setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args)
        context = args = null
      }
    }
  }

  var debounced = function(this: any) {
    context = this
    args = arguments
    timestamp = Date.now()
    var callNow = immediate && !timeout
    if (!timeout) timeout = window.setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }

  // debounced.clear = function() {
  //   if (timeout) {
  //     clearTimeout(timeout);
  //     timeout = null;
  //   }
  // };

  // debounced.flush = function() {
  //   if (timeout) {
  //     result = func.apply(context, args);
  //     context = args = null;

  //     clearTimeout(timeout);
  //     timeout = null;
  //   }
  // };

  return debounced
}
