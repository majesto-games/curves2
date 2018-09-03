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
