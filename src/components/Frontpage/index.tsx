import * as React from "react"

import { FrontpageButtons as Buttons, FrontpageHeader as Header, RoomList } from ".."

export const Frontpage: React.SFC = () => (
  <>
    <div className="RoomHeader">
      <Header />
      <Buttons />
    </div>
    <RoomList />
  </>
)
