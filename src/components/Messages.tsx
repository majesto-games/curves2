import { MessageBar } from "office-ui-fabric-react"
import * as React from "react"
import { connect } from "react-redux"
import { CSSTransition, TransitionGroup } from "react-transition-group"

import * as actions from "../actions"
import { ClientState, Message } from "../client"

type StateProps = {
  messages: Message[]
}

type DispatchProps = {
  dismissMessage: typeof actions.dismissMessage
}

type OwnProps = {}

type Props = OwnProps & StateProps & DispatchProps

export const MessagesAtom: React.SFC<Props> = ({ messages, dismissMessage }) => (
  <div className="Messages">
    <TransitionGroup component={null}>
      {messages.map((message) => (
        <CSSTransition key={message.text} classNames="fade" timeout={4000} onEntered={() => dismissMessage()}>
          <MessageBar messageBarType={message.type} isMultiline={false}>
            {message.text}
          </MessageBar>
        </CSSTransition>
      ))}
    </TransitionGroup>
  </div>
)

export const Messages = connect<StateProps, DispatchProps, OwnProps>(
  (state: ClientState) => ({
    messages: state.messages,
  }),
  { dismissMessage: actions.dismissMessage },
)(MessagesAtom)
