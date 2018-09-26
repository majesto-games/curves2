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
  setWebGroupEventHandlers(new WebGroup(options), handlers)

export function supportsWebRTC() {
  return webrtcsupport.supportDataChannel
}
