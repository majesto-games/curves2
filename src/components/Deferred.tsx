import React from "react"

type Props<T> = {
  promise: Promise<T>
  then: (value: T | true) => React.ReactNode
}

type State<T> = {
  value: T | true
}

export class Deferred<T> extends React.Component<Props<T>, State<T>> {
  state: State<T> = {
    value: true,
  }

  componentDidMount() {
    this.props.promise.then((value) => this.setState({ value }))
  }

  render() {
    const then = this.props.then || ((value) => value)

    return then(this.state.value)
  }
}
