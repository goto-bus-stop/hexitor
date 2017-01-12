const h = require('inferno-hyperscript')
const css = require('glamor').css
const Header = require('./header')
const Hex = require('./hex')
const Ascii = require('./ascii')
const { Hotkeys } = require('./hotkey')
const { MOVE_CURSOR } = require('../state')

css.global('*, *::after, *::before', {
  boxSizing: 'border-box'
})

css.global('body', {
  background: '#333',
  margin: 0,
  padding: 0,
  font: '10pt Ubuntu'
})

const styles = {
  split: css({
    display: 'flex',
    position: 'absolute',
    top: 50,
    bottom: 0,
    width: '100%',
    overflowY: 'auto'
  }),
  hex: css({
    flexGrow: 2
  }),
  ascii: css({
    flexGrow: 1
  })
}

module.exports = function App () {
  return h('div', [
    h(Header),
    h(`.${styles.split}`, [
      h(`.${styles.hex}`, [ h(Hex) ]),
      h(`.${styles.ascii}`, [ h(Ascii) ])
    ]),
    h(Hotkeys, {
      left: () => ({ type: MOVE_CURSOR, payload: (pos) => pos - 1 }),
      right: () => ({ type: MOVE_CURSOR, payload: (pos) => pos + 1 })
    })
  ])
}
