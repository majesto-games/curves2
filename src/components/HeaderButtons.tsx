import { CompoundButton } from "office-ui-fabric-react"
import * as React from "react"
import { randomAdjective, randomNoun } from "sillyname"

import { group, history } from ".."

function host() {
  const name = (randomAdjective() + randomNoun() + "-" + randomNoun()).toLowerCase()

  group.host(name)
  history.push("/room/" + name)
}

function join() {
  const name = prompt("Enter room name:")

  if (name) {
    group.join(name)
    history.push("/room/" + name)
  }
}

export const HeaderButtons: React.SFC = () => (
  <div className="HeaderButtons">
    <CompoundButton
      primary
      iconProps={{ iconName: "Globe" }}
      text="Create room"
      secondaryText="Start an online game"
      onClick={() => host()}
    />
    <CompoundButton
      iconProps={{ iconName: "DoubleChevronRight8" }}
      text="Join room"
      secondaryText="Join an online game"
      onClick={() => join()}
    />
    <CompoundButton
      iconProps={{ iconName: "PlugDisconnected" }}
      text="Play offline"
      secondaryText="Play offline with friends or bots"
      onClick={() => history.push("/room/test")}
    />
  </div>
)
