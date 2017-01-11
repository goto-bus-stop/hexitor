const h = require('inferno-hyperscript')
const { connect } = require('inferno-redux')
const css = require('glamor').css
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
  })
}

module.exports = DataView.make(Cell)

function formatByte (byte) {
  if (byte === '\n'.charCodeAt()) {
    return '\\n'
  }
  return String.fromCharCode(byte)
}

function Cell ({ byte, selected, onSelect }) {
  return h('span', {
    onClick: onSelect,
    className: css(styles.cell, selected && styles.selected)
  }, formatByte(byte))
}
