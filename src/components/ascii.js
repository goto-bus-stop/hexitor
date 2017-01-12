const h = require('inferno-hyperscript')
const css = require('glamor').css
const isControlCharacter = require('is-ascii-control-char-code')
const DataView = require('./dataView')

const styles = {
  field: css({
    font: '12pt monospace',
    color: 'white',
    width: '100%'
  }),
  cell: css({
    display: 'inline-block'
  }),
  selected: css({
    background: 'yellow',
    color: 'black'
  }),
  control: css({
    color: '#777'
  })
}

module.exports = DataView.make(Cell)

function formatByte (byte, isCtrl) {
  if (byte === 0x0A /* '\n' */) {
    return '⏎'
  }
  if (byte === 0x20 /* ' ' */) {
    return '\u00A0'
  }
  return isCtrl ? '?' : String.fromCharCode(byte)
}

function Cell ({ byte, selected, onSelect }) {
  const isCtrl = isControlCharacter(byte) || byte > 0x7F
  return h('span', {
    onClick: onSelect,
    className: css(
      styles.cell,
      selected && styles.selected,
      isCtrl && styles.control
    )
  }, formatByte(byte, isCtrl))
}
