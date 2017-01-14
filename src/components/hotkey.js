const h = require('inferno-hyperscript')
const Component = require('inferno-component')
const { connect } = require('inferno-redux')
const Mousetrap = require('mousetrap')

const enhance = connect(
  (state) => ({}),
  (dispatch) => ({ dispatch })
)

class Hotkey extends Component {
  constructor (props, context) {
    super(props, context)

    this.store = context.store
    this.handle = this.handle.bind(this)
  }

  handle (event, ...args) {
    const { dispatch, action } = this.props

    event.preventDefault()
    dispatch(action(this.store.getState(), event, ...args))
  }

  componentDidMount () {
    Mousetrap.bind(this.props.keys, this.handle)
  }
  componentWillUnmount () {
    Mousetrap.unbind(this.props.keys)
  }

  render () {}
}

module.exports = enhance(Hotkey)
module.exports.Hotkeys = enhance(Hotkeys)

function Hotkeys (handlers) {
  const { dispatch } = handlers

  return h('span', Object.keys(handlers)
    .filter((keys) => keys !== 'dispatch')
    .map((keys) => h(Hotkey, {
      dispatch,
      keys,
      action: handlers[keys]
    }))
  )
}
