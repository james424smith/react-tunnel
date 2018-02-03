import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import PropTypes from 'prop-types'
import React from 'react'
import { Tunnel, TunnelPlaceholder, TunnelProvider } from '../src'

configure({ adapter: new Adapter() })

const TUNNEL_ID = 'GroompyTunnel'
const props = { message: 'Aihop!' }

const Msg = ({ message }) => (
  <div className="msg">{message || 'defaultMessage'}</div>
)
Msg.propTypes = { message: PropTypes.string }

describe('Tunnel', () => {
  it('should render a tunnel passing props', () => {
    const wrapper = mount(
      <TunnelProvider>
        <div>
          <TunnelPlaceholder id={TUNNEL_ID}>
            {({ message }) => <span>{message}</span>}
          </TunnelPlaceholder>
          <Tunnel id={TUNNEL_ID} {...props} />
        </div>
      </TunnelProvider>,
    )
    assertTunnelPlaceholderContent(wrapper, props.message)
  })

  it('should render a tunnel passing children', () => {
    const wrapper = mount(
      <TunnelProvider>
        <div>
          <TunnelPlaceholder id={TUNNEL_ID} />
          <Tunnel id={TUNNEL_ID}>
            <span>{props.message}</span>
          </Tunnel>
        </div>
      </TunnelProvider>,
    )
    assertTunnelPlaceholderContent(wrapper, props.message)
  })

  it('should render multiple tunnels props when there is a multiple prop', () => {
    const wrapper = mount(
      <TunnelProvider>
        <div>
          <TunnelPlaceholder id={TUNNEL_ID} multiple>
            {({ items = [] }) =>
              items.map((props, i) => <div key={i}>{props.message}</div>)
            }
          </TunnelPlaceholder>
          <Tunnel id={TUNNEL_ID} message="Foo" />
        </div>
      </TunnelProvider>,
    )
    expect(wrapper.contains([<div key={0}>Foo</div>])).toEqual(true)
  })

  it('should render multiple tunnels props when there are many tunnels', () => {
    const wrapper = mount(
      <TunnelProvider>
        <div>
          <TunnelPlaceholder id={TUNNEL_ID}>
            {({ items = [] }) =>
              items.map((props, i) => <div key={i}>{props.message}</div>)
            }
          </TunnelPlaceholder>
          <Tunnel id={TUNNEL_ID} message="Foo" />
          <Tunnel id={TUNNEL_ID} message="Bar" />
        </div>
      </TunnelProvider>,
    )
    expect(
      wrapper.contains([<div key={0}>Foo</div>, <div key={1}>Bar</div>]),
    ).toEqual(true)
  })

  describe('given Tunnel is not defined', () => {
    it('should render TunnelPlaceholder children passing empty props', () => {
      const wrapper = mount(
        <TunnelProvider>
          <TunnelPlaceholder id={TUNNEL_ID}>
            {({ message }) => <span>{message || 'Empty'}</span>}
          </TunnelPlaceholder>
        </TunnelProvider>,
      )
      assertTunnelPlaceholderContent(wrapper, 'Empty')
    })

    it('should render empty is TunnelPlaceholder does not have children', () => {
      const wrapper = mount(
        <TunnelProvider>
          <TunnelPlaceholder id={TUNNEL_ID} />
        </TunnelProvider>,
      )
      expect(wrapper.find(TunnelPlaceholder).children().length).toEqual(0)
    })
  })

  describe('update lifecycle', () => {
    const Component = (
      { msg, visible }, //eslint-disable-line
    ) => (
      <TunnelProvider>
        <div>
          <TunnelPlaceholder id={TUNNEL_ID}>
            {({ message }) => <span>{message || 'Empty'}</span>}
          </TunnelPlaceholder>
          {visible && <Tunnel id={TUNNEL_ID} message={msg} />}
        </div>
      </TunnelProvider>
    )
    const msg1 = 'Message1'
    const msg2 = 'Message2'

    it('should update TunnelPlaceholder when Tunnel is updated', () => {
      const wrapper = mount(<Component msg={msg1} visible />)
      assertTunnelPlaceholderContent(wrapper, msg1)
      wrapper.setProps({ msg: msg2 })
      assertTunnelPlaceholderContent(wrapper, msg2)
    })

    it('should update TunnelPlaceholder when Tunnel is mounted', () => {
      const wrapper = mount(<Component msg={msg1} visible={false} />)
      assertTunnelPlaceholderContent(wrapper, 'Empty')
      wrapper.setProps({ visible: true })
      assertTunnelPlaceholderContent(wrapper, msg1)
    })

    it('should update TunnelPlaceholder when Tunnel is unmounted', () => {
      const wrapper = mount(<Component msg={msg1} visible />)
      assertTunnelPlaceholderContent(wrapper, msg1)
      wrapper.setProps({ visible: false })
      assertTunnelPlaceholderContent(wrapper, 'Empty')
    })
  })

  function assertTunnelPlaceholderContent(wrapper, expectedContent) {
    expect(wrapper.find(TunnelPlaceholder).text()).toEqual(expectedContent)
  }
})
