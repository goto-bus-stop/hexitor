const h = require('inferno-create-element')
const css = require('tagged-css-modules')
const Header = require('./header')
const Main = require('./mainViews')
const Interpretations = require('./interpretations')
const { Hotkeys } = require('./hotkey')
const { moveCursor } = require('../state')

const styles = css`
  :global(*, *::after, *::before) {
    box-sizing: border-box;
  }

  :global(body) {
    background: #333;
    margin: 0;
    padding: 0;
    font: 10pt Ubuntu;
  }

  .main {
    position: absolute;
    top: 50px;
    bottom: 150px;
    width: 100%;
  }

  .footer {
    position: absolute;
    height: 150px;
    bottom: 0;
    width: 100%;
  }
`

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
