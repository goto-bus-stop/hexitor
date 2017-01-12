const h = require('inferno-hyperscript')
const css = require('glamor').css
const Header = require('./header')
const Hex = require('./hex')
const Ascii = require('./ascii')
const { Hotkeys } = require('./hotkey')
const { moveCursor } = require('../state')

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
      left: () => moveCursor((pos) => pos - 1),
      right: () => moveCursor((pos) => pos + 1)
    })
  ])
}
