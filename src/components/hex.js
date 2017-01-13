const h = require('inferno-hyperscript')
const css = require('glamor').css
const DataView = require('./dataView')

const styles = {
  cell: css({
    display: 'inline-block',
    padding: '0 5px'
  }),
  selected: css({
    background: 'yellow',
    color: 'black'
  })
}

module.exports = DataView.make(Cell)

function formatByte (byte) {
  return byte.toString(16).padStart(2, '0')
}

function Cell ({ byte, selected, onSelect }) {
  return h('span', {
    onClick: onSelect,
    className: css(styles.cell, selected && styles.selected)
  }, formatByte(byte))
}
