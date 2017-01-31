const h = require('inferno-create-element')
const css = require('glamor').css
const Header = require('./header')
const Main = require('./mainViews')
const Interpretations = require('./interpretations')
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
  main: css({
    position: 'absolute',
    top: 50,
    bottom: 150,
    width: '100%'
  }),
  footer: css({
    position: 'absolute',
    height: 150,
    bottom: 0,
    width: '100%'
  })
}

module.exports = function App () {
  return h('div', {}, [
    h(Header),
    h('div', { className: styles.main },
      h(Main)
    ),
    h('div', { className: styles.footer },
      h(Interpretations)
    ),
    h(Hotkeys, {
      left: () => moveCursor((pos) => pos - 1),
      right: () => moveCursor((pos) => pos + 1),
      up: (state) => moveCursor((pos) => pos - state.view.bytesPerLine),
      down: (state) => moveCursor((pos) => pos + state.view.bytesPerLine)
    })
  ])
}
