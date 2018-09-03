import * as PIXI from "pixi.js"
import { Behavior, CustomPIXIComponent } from "react-pixi-fiber"

export type MeshProps = {
  vertices: Float32Array
  uvs: Float32Array
  indices: Uint16Array
}

export const behavior: Behavior<MeshProps, PIXI.mesh.Mesh> = {
  customDisplayObject: ({ vertices, uvs, indices }) => new PIXI.mesh.Mesh(PIXI.Texture.WHITE, vertices, uvs, indices),
  customApplyProps: function(mesh, oldProps, newProps) {
    const { vertices, uvs, indices } = newProps

    // mesh.texture = getTexture(texture)
    mesh.vertices = vertices
    mesh.uvs = uvs
    mesh.indices = indices
    mesh.dirty += 1
    mesh.indexDirty += 1
    mesh.refresh()
    // mesh.updateTransform()
  },
}

export const Mesh = CustomPIXIComponent(behavior, "Mesh")
