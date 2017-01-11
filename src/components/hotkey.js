const h = require('inferno-hyperscript')
const { connect } = require('inferno-redux')
const Mousetrap = require('mousetrap')

const enhance = connect(
  () => {},
  dispatch => ({ dispatch })
)

module.exports = enhance(Hotkey)
module.exports.Hotkeys = enhance(Hotkeys)

function Listener () {}

function Hotkey (props) {
  function handle (...args) {
    props.dispatch(props.action(...args))
  }

  function bind () {
    Mousetrap.bind(props.keys, handle)
  }

  function unbind () {
    Mousetrap.unbind(props.keys)
  }

  return h(Listener, {
    onComponentDidMount: bind,
    onComponentWillUnmount: unbind
  })
}

function Hotkeys (handlers) {
  const dispatch = handlers.dispatch

  return h('span', Object.keys(handlers)
    .filter((keys) => keys !== 'dispatch')
    .map((keys) => h(Hotkey, { dispatch, keys, action: handlers[keys] }))
  )
}
