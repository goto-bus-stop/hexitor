const h = require('inferno-hyperscript')
const { linkEvent } = require('inferno')
const Component = require('inferno-component')
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

function cellStateIsEqual (a, b) {
  return a.selected === b.selected &&
    a.byte === b.byte &&
    // Compare linkEvent() result
    a.onSelect.data === b.onSelect.data &&
    a.onSelect.event === b.onSelect.event
}

/**
 * Create a DataView component that uses the given cell renderer.
 */
module.exports.make = (renderCell) => {
  // Add shouldComponentUpdate to cells.
  class PureCell extends Component {
    shouldComponentUpdate (nextProps) {
      return !cellStateIsEqual(this.props, nextProps)
    }

    render () {
      return renderCell(this.props)
    }
  }

  return (props) => h(module.exports, Object.assign({ cellComponent: PureCell }, props))
}

function chunkStateIsEqual (a, b) {
  return a.chunk === b.chunk &&
    a.cursor === b.cursor &&
    a.onSelect === b.onSelect
}

class ChunkView extends Component {
  shouldComponentUpdate (nextProps) {
    return !chunkStateIsEqual(this.props, nextProps)
  }

  render () {
    const {
      cellComponent,
      chunk,
      chunkOffset,
      cursor,
      setCursor
    } = this.props

    const cells = Array(chunk.byteLength)
    for (let i = 0; i < chunk.byteLength; i += 1) {
      cells.push(h(cellComponent, {
        byte: chunk[i],
        onSelect: linkEvent(chunkOffset + i, setCursor),
        selected: i === cursor
      }))
    }

    return h('span', cells)
  }
}

function DataView ({ cellComponent, buffer, cursor, setCursor }) {
  if (buffer) {
    let chunkOffset = 0

    const chunks = buffer.chunks().map((chunk) => {
      const chunkEnd = chunkOffset + chunk.byteLength
      const el = h(ChunkView, {
        cellComponent,
        chunk,
        chunkOffset,
        setCursor,
        cursor: cursor >= chunkOffset && cursor < chunkEnd ? cursor - chunkOffset : null
      })
      chunkOffset = chunkEnd
      return el
    })

    return h(`.${styles.field}`, chunks)
  }
  return h('div')
}

