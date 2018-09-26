import { MessageBar } from "office-ui-fabric-react"
import * as React from "react"
import { connect } from "react-redux"
import { CSSTransition, TransitionGroup } from "react-transition-group"

import * as actions from "../actions"
import { ClientState, Message, MESSAGE_TIMEOUT } from "../stores/client"

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
    <TransitionGroup component={null} appear>
      {messages.map((message) => (
        <CSSTransition key={message.text} classNames="fade" timeout={{ enter: MESSAGE_TIMEOUT - 250, exit: 250 }}>
          <MessageBar messageBarType={message.type} onDismiss={() => dismissMessage(message.id)}>
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
