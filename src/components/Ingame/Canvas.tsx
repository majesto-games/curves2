import * as PIXI from "pixi.js"
import * as React from "react"
import { Container, Stage } from "react-pixi-fiber"
import { connect } from "react-redux"

import { ClientState, ClientTail } from "../../stores/client"
import { Mesh } from "../pixi"

PIXI.utils.skipHello()

export const CanvasAtom: React.SFC<Props> = ({ tails }) => (
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

export const Canvas = connect((state: ClientState) => ({
  tails: Object.keys(state.tails).map((k) => state.tails[(k as unknown) as number]),
}))(CanvasAtom)
