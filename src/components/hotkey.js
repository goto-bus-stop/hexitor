const onload = require('on-load')
const { dispatch, getState } = require('../state')
const Mousetrap = require('mousetrap')

module.exports = Hotkey
module.exports.Hotkeys = Hotkeys

function Hotkey ({ keys, action }) {
  function handle (event, ...args) {
    event.preventDefault()
    dispatch(action(getState(), event, ...args))
  }

  function attach () {
    Mousetrap.bind(keys, handle)
  }
  function detach () {
    Mousetrap.unbind(keys)
  }

  function auto (el) {
    onload(el, attach, detach)
    return el
  }

  auto.attach = attach
  auto.detach = detach

  return auto
}

function Hotkeys (handlers) {
  const hotkeys = Object.keys(handlers).map((keys) => Hotkey({
    keys,
    action: handlers[keys]
  }))

  function attach () {
    hotkeys.forEach((k) => k.attach())
  }
  function detach () {
    hotkeys.forEach((k) => k.detach())
  }

  function auto (el) {
    onload(el, attach, detach)
    return el
  }

  auto.attach = attach
  auto.detach = detach

  return auto
}
