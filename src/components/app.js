const html = require('nanohtml')
const css = require('tagged-css-modules')
const Header = require('./header')
const Main = require('./mainViews')
const Interpretations = require('./interpretations')
const { Hotkeys } = require('./hotkey')
const { moveCursor } = require('../state')

const styles = css`
  :global * { box-sizing: border-box; }
  :global *::after { box-sizing: border-box; }
  :global *::before { box-sizing: border-box; }

  :global body {
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
  const hotkeys = Hotkeys({
    left: () => moveCursor((pos) => pos - 1),
    right: () => moveCursor((pos) => pos + 1),
    up: (state) => moveCursor((pos) => pos - state.view.bytesPerLine),
    down: (state) => moveCursor((pos) => pos + state.view.bytesPerLine)
  })

  return hotkeys(html`
    <div>
      ${Header()}
      <div class=${styles.main}>
        ${Main()}
      </div>
      <div class=${styles.footer}>
        ${Interpretations()}
      </div>
    </div>
  `)
}
