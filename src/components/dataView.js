const h = require('inferno-hyperscript')
const { linkEvent } = require('inferno')
const Component = require('inferno-component')
const { connect } = require('inferno-redux')
const { css } = require('glamor')
const { moveCursor } = require('../state')
const measure = require('../utils/measure')

const styles = {
  type: css({
    font: '16px monospace',
    color: 'white'
  }),
  field: css({
    width: '100%'
  })
}

const enhance = connect(
  state => ({
    buffer: state.currentFile.buffer,
    cursor: state.cursor.position,
    visible: state.view.visible
  }),
  { setCursor: moveCursor }
)

class DataView extends Component {
  constructor (props) {
    super(props)

    this.state = {
      cellSize: { width: Infinity, height: Infinity }
    }

    this.refContainer = (container) => {
      this.container = container
    }
  }

  getBytesPerLine () {
    const { cellSize } = this.state

    return Math.floor(this.getWidth() / cellSize.width)
  }

  getLinesCount () {
    const bytesPerLine = this.getBytesPerLine()
    return Math.ceil(this.props.buffer.length / bytesPerLine)
  }

  getLinesFromTop () {
    const { top } = this.props.visible
    const { cellSize } = this.state

    return Math.floor(top / cellSize.height)
  }

  getLinesVisible () {
    const { height } = this.props.visible
    const { cellSize } = this.state

    return Math.ceil(height / cellSize.height)
  }

  getWidth () {
    return this.container.clientWidth
  }

  componentDidMount () {
    const cellSize = measure(
      h(this.props.cellComponent, {
        byte: 0,
        selected: false,
        onSelect: () => {}
      }),
      this.container
    )

    if (this.props.onCellSize) {
      this.props.onCellSize(cellSize)
    }
    this.setState({ cellSize })
  }

  render () {
    const { cellComponent, buffer, cursor, setCursor } = this.props
    const { cellSize } = this.state

    if (buffer) {
      const linesFromTop = this.getLinesFromTop()
      const linesVisible = this.getLinesVisible()
      const bytesPerLine = this.getBytesPerLine()

      const chunks = []
      for (let i = 0; i < linesVisible; i++) {
        const lineStart = (linesFromTop + i) * bytesPerLine
        const lineEnd = lineStart + bytesPerLine

        if (lineStart > buffer.length) {
          break
        }

        chunks.push(h(LineView, {
          key: lineStart,
          cellComponent,
          chunk: buffer.view(lineStart, lineEnd),
          chunkOffset: lineStart,
          setCursor,
          cursor: cursor >= lineStart && cursor < lineEnd ? cursor - lineStart : null
        }))
      }

      const topPadding = linesFromTop * cellSize.height
      const totalHeight = this.getLinesCount() * cellSize.height
      return h(`.${css(styles.type, styles.field)}`, { ref: this.refContainer }, [
        h('div', { style: { height: totalHeight } }, [
          h('div', { style: { transform: `translateY(${topPadding}px)` } }, chunks)
        ])
      ])
    }
    return h(`.${css(styles.type, styles.field)}`, { ref: this.refContainer })
  }
}

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

function lineStateIsEqual (a, b) {
  return a.chunk.equals(b.chunk) &&
    a.cursor === b.cursor &&
    a.onSelect === b.onSelect
}

class LineView extends Component {
  shouldComponentUpdate (nextProps) {
    return !lineStateIsEqual(this.props, nextProps)
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
