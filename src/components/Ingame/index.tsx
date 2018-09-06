import * as React from "react"

import { Canvas, IngameButtons as Buttons, IngamePlayerList as PlayerList } from ".."

export const Ingame: React.SFC = () => (
  <div className="Game">
    <Canvas />
    <div className="GameSidebar">
      <Buttons />
      <PlayerList />
    </div>
  </div>
)
