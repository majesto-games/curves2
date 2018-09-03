import * as PIXI from "pixi.js"
import * as React from "react"
import { Behavior, Container, CustomPIXIComponent, Stage } from "react-pixi-fiber"
import { connect } from "react-redux"

import { ClientState, ClientTail } from "../client"

PIXI.utils.skipHello()

const TYPE = "Mesh"
export const behavior: Behavior<{ vertices: Float32Array; uvs: Float32Array; indices: Uint16Array }, PIXI.mesh.Mesh> = {
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
const Mesh = CustomPIXIComponent(behavior, TYPE)

export const GameContainerAtom: React.SFC<Props> = ({ tails }) => (
  <div className="GameContainer">
    <Stage width={1000} height={1000} options={{ antialias: true, backgroundColor: 0x101010 }}>
      <Container>
        {tails.map((tail, i) => (
          <Container key={i}>
            {tail.meshes.map((mesh, j) => (
              <Mesh key={j} {...mesh} />
            ))}
          </Container>
        ))}
      </Container>
    </Stage>
  </div>
)

type Props = OwnProps & StateProps & DispatchProps

type StateProps = {
  tails: ClientTail[]
}
type DispatchProps = {}
type OwnProps = {}

export const GameContainer = connect<StateProps, DispatchProps, OwnProps>((state: ClientState) => ({
  tails: Object.keys(state.tails).map((k) => state.tails[k]),
}))(GameContainerAtom)
