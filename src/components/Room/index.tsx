import * as React from "react"

import { RoomButtons as Buttons, RoomHeader as Header, RoomPlayerList as PlayerList } from ".."

export const Room: React.SFC = () => (
  <>
    <div className="RoomHeader">
      <Header />
      <Buttons />
    </div>
    <PlayerList />
  </>
)
