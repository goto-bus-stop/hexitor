const h = require('inferno-hyperscript')
const { connect } = require('inferno-redux')
const css = require('glamor').css

const styles = {
  field: css({
    font: '12pt monospace',
    color: 'white',
    width: '100%'
  }),
  cell: css({
    display: 'inline-block'
  })
}

const enhance = connect(
  state => state.currentFile
)

module.exports = enhance(Ascii)

function formatByte (byte) {
  if (byte === '\n'.charCodeAt()) {
    return '\\n'
  }
  return String.fromCharCode(byte)
}

function Cell ({ byte }) {
  return h(`.${styles.cell}`, formatByte(byte))
}

function Ascii ({ buffer }) {
  if (buffer) {
    const cells = []
    for (let i = 0; i < buffer.byteLength; i += 1) {
      cells.push(h(Cell, { byte: buffer[i] }))
    }
    return h(`.${styles.field}`, cells)
  }
  return h('div')
}
