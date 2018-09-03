import { CompoundButton } from "office-ui-fabric-react"
import * as React from "react"

import { history } from ".."

export const HeaderButtons: React.SFC = () => (
  <div className="HeaderButtons">
    <CompoundButton
      primary
      iconProps={{ iconName: "Globe" }}
      text="Create room"
      secondaryText="Start an online game"
      onClick={() => history.push("/room/test")}
    />
    <CompoundButton
      iconProps={{ iconName: "PlugDisconnected" }}
      text="Play offline"
      secondaryText="Play offline with friends or bots"
      onClick={() => history.push("/room/test")}
    />
  </div>
)
