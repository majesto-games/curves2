declare module "webrtcsupport" {
  const supportObject: {
    support: boolean
    browserVersion: number
    supportRTCPeerConnection: boolean
    supportVp8: boolean
    supportGetUserMedia: boolean
    supportDataChannel: boolean
    supportWebAudio: boolean
    supportMediaStream: boolean
    supportScreenSharing: boolean
    prefix: "moz" | "webkit"
    // AudioContext: // the audio context constructor from the web audio API
    // PeerConnection: // constructor for creating a peer connection
    // SessionDescription: // constructor for RTCSessionDescriptions
    // IceCandidate: // constructor for ice candidate
    // MediaStream: // constructor for MediaStreams
    // getUserMedia: // getUserMedia function
  }
  export default supportObject
}
