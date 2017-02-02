const h = require('inferno-create-element')
const css = require('tagged-css-modules')
const isControlCharacter = require('is-ascii-control-char-code')
const DataView = require('./dataView')

const styles = css`
  .field {
    font: 12pt monospace;
    color: white;
    width: 100%;
  }

  .cell {
    display: inline-block;
  }

  .selected {
    background: yellow;
    color: black;
  }

  .control {
    color: #777;
  }
`

module.exports = DataView.make(Cell)

function formatByte (byte, isCtrl) {
  if (byte === '\n'.charCodeAt(0)) {
    return '⏎'
  }
  if (byte === ' '.charCodeAt(0)) {
    return '\u00A0'
  }
  return isCtrl ? '?' : String.fromCharCode(byte)
}

function Cell ({ byte, selected, onSelect }) {
  const isCtrl = isControlCharacter(byte) || byte > 0x7F
  return h('span', {
    onClick: onSelect,
    className: [
      styles.cell,
      selected && styles.selected,
      isCtrl && styles.control
    ].filter(Boolean).join(' ')
  }, formatByte(byte, isCtrl))
}
