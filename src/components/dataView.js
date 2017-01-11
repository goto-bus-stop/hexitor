const h = require('inferno-hyperscript')
const { connect } = require('inferno-redux')
const { css } = require('glamor')
const { MOVE_CURSOR } = require('../state')

const styles = {
  field: css({
    font: '12pt monospace',
    color: 'white',
    width: '100%'
  })
}

const enhance = connect(
  state => ({
    buffer: state.currentFile.buffer,
    cursor: state.cursor.position
  }),
  dispatch => ({
    setCursor: (position) => dispatch({
      type: MOVE_CURSOR,
      payload: position
    })
  })
)

module.exports = enhance(DataView)

module.exports.make = (cellComponent) => (props) =>
  h(module.exports, Object.assign({ cellComponent }, props))

function DataView ({ cellComponent, buffer, cursor, setCursor }) {
  if (buffer) {
    const cells = []
    for (let i = 0; i < buffer.byteLength; i += 1) {
      cells.push(h(cellComponent, {
        byte: buffer[i],
        onSelect: () => setCursor(i),
        selected: i === cursor
      }))
    }
    return h(`.${styles.field}`, cells)
  }
  return h('div')
}

