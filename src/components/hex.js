const h = require('inferno-hyperscript')
const { connect } = require('inferno-redux')
const css = require('glamor').css

const styles = {
  field: css({
    font: '12pt monospace',
    color: 'white',
    width: '100%',
    wordBreak: 'break-word'
  }),
  cell: css({
    display: 'inline',
    marginRight: 5
  })
}

const enhance = connect(
  state => state.currentFile
)

module.exports = enhance(Hex)

function formatByte (byte) {
  return byte.toString(16).padStart(2, '0')
}

function Cell ({ byte }) {
  return h(`.${styles.cell}`, formatByte(byte))
}

function Hex ({ buffer }) {
  if (buffer) {
    const cells = []
    for (let i = 0; i < buffer.byteLength; i += 1) {
      cells.push(h(Cell, { byte: buffer[i] }))
    }
    return h(`.${styles.field}`, cells)
  }
  return h('div')
}
