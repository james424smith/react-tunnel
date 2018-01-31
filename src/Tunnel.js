import { Component } from 'react'
import PropTypes from 'prop-types'
import uniqueId from './uniqueId'

class Tunnel extends Component {
  static propTypes = {
    id: PropTypes.string,
    render: PropTypes.func,
  }

  static contextTypes = {
    tunnelState: PropTypes.object,
  }

  itemId = uniqueId()

  componentDidMount() {
    this.setTunnelProps(this.props)
  }

  componentWillUpdate(nextProps) {
    this.setTunnelProps(nextProps)
  }

  componentWillUnmount() {
    const { id } = this.props
    const { tunnelState } = this.context
    tunnelState.setTunnelProps(id, this.itemId, null)
  }

  setTunnelProps(newProps) {
    const { id, ...props } = newProps
    const { tunnelState } = this.context
    tunnelState.setTunnelProps(id, this.itemId, props)
  }

  render() {
    return null
  }
}

export default Tunnel
