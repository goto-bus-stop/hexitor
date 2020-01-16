const html = require('nanohtml')
const css = require('tagged-css-modules')
const DataView = require('./dataView')

const styles = css`
  .cell {
    display: inline-block;
    padding: 0 5px;
  }

  .selected {
    background: yellow;
    color: black;
  }

  .empty {
    color: #777;
  }
`

module.exports = DataView.make(Cell)

function formatByte (byte) {
  return byte.toString(16).padStart(2, '0').toUpperCase()
}

const formatted = []
for (let i = 0; i <= 0xFF; i++) {
  formatted[i] = formatByte(i)
}

function Cell ({ byte, selected }) {
  const classNames = [
    styles.cell,
    selected && styles.selected,
    byte === 0 && styles.empty
  ].filter(Boolean).join(' ')

  return html`
    <span class=${classNames}>${formatted[byte]}</span>
  `
}
