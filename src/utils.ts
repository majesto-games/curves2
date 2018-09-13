import { WebGroup, WebGroupOptions } from "netflux"

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

export const supportsWebRTC = (): Promise<boolean> =>
  new Promise((resolve) => {
    var pc = new RTCPeerConnection({ iceServers: [] })
    pc.createDataChannel("") //create a bogus data channel
    pc.onicecandidate = (ice) => {
      //listen for candidate events
      resolve(ice.candidate !== null)
      // if (!ice || !ice.candidate || !ice.candidate.candidate) return
      // var myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
      // pc.onicecandidate = function() {}
    }
    //@ts-ignore
    pc.createOffer(pc.setLocalDescription.bind(pc), function() {}) // create offer and set local description
  })
