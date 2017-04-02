const onload = require('on-load')
const { getState, subscribe } = require('../state')

module.exports = connect

function connect (fn) {
  let unsubscribe
  function attach (el) {
    unsubscribe = subscribe(() => {
      fn(getState(), el)
    })
  }
  function detach () {
    unsubscribe()
  }

  return function (el) {
    onload(el, attach, detach)
    return el
  }
}
