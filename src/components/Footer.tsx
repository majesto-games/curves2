import * as React from "react"

export const Footer: React.SFC = () => (
  <div className="Footer">Version {process.env.REACT_APP_BUILD_VERSION || "dev"} &copy; Majesto Games</div>
)
