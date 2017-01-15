const h = require('inferno-hyperscript')
const { linkEvent } = require('inferno')
const Component = require('inferno-component')
const { connect } = require('inferno-redux')
const { css } = require('glamor')
const {
  moveCursor,
  beginSelection,
  endSelection,
  selectCursorPosition,
  selectMainSelection,
  selectLineHeight,
  selectTotalLines,
  selectTotalHeight
} = require('../state')
const measure = require('../utils/measure')
const pure = require('../utils/pure')

const type = {
  font: '16px monospace',
  color: 'white'
}

const styles = {
  type: css(type),
  field: css({
    width: '100%',
    background: '#1b1b1b'
  }, type)
}

const enhance = connect(
  state => ({
    buffer: state.currentFile.buffer,
    cursor: selectCursorPosition(state),
    selection: selectMainSelection(state),
    visible: state.view.visible,
    lineHeight: selectLineHeight(state),
    totalHeight: selectTotalHeight(state),
    firstVisibleLine: state.view.firstVisibleLine,
    visibleLines: state.view.visibleLines,
    bytesPerLine: state.view.bytesPerLine
  }),
  {
    setCursor: moveCursor,
    onBeginSelection: beginSelection,
    onEndSelection: endSelection
  }
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
    const {
      cellComponent,
      buffer,
      cursor,
      selection,
      setCursor,
      onBeginSelection,
      onEndSelection
    } = this.props
    const { cellSize } = this.state

    if (!buffer) {
      return h(`.${styles.field}`, { ref: this.refContainer })
    }

    const linesFromTop = this.props.firstVisibleLine
    const linesVisible = this.props.visibleLines
    const bytesPerLine = this.props.bytesPerLine

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
        onBeginSelection,
        onEndSelection,
        cursor: cursor >= lineStart && cursor < lineEnd ? cursor - lineStart : null,
        selection: { start: selection.start - lineStart, end: selection.end - lineStart }
      }))
    }

    const topPadding = linesFromTop * this.props.lineHeight
    return h(`.${styles.field}`, { ref: this.refContainer }, [
      h('div', { style: { height: this.props.totalHeight } }, [
        h('div', { style: { transform: `translateY(${topPadding}px)` } }, chunks)
      ])
    ])
  }
}

DataView.defaultProps = {
  width: 1
}

module.exports = enhance(DataView)

function cellStateIsEqual (a, b) {
  return a.selected === b.selected &&
    a.focused === b.focused &&
    a.byte === b.byte &&
    // Compare linkEvent() result
    a.onSelect.data === b.onSelect.data &&
    a.onSelect.event === b.onSelect.event
}

/**
 * Create a DataView component that uses the given cell renderer.
 */
module.exports.make = (renderCell) => {
  const PureCell = pure(cellStateIsEqual)(renderCell)
  return (props) => h(module.exports, Object.assign({ cellComponent: PureCell }, props))
}

function lineStateIsEqual (a, b) {
  return a.chunk.equals(b.chunk) &&
    a.selection.start === b.selection.start &&
    a.selection.end === b.selection.end &&
    a.cursor === b.cursor &&
    a.onSelect === b.onSelect
}

function onCellClick (props, event) {
  props.setCursor(props.i)
  if (event.shiftKey) {
    event.preventDefault()
    props.onEndSelection(props.i)
  } else {
    props.onBeginSelection(props.i)
  }
}

const LineView = pure(lineStateIsEqual)(function LineView ({
  cellComponent,
  chunk,
  chunkOffset,
  cursor,
  selection,
  setCursor,
  onBeginSelection,
  onEndSelection
}) {
  const cells = Array(chunk.byteLength)
  for (let i = 0; i < chunk.byteLength; i += 1) {
    cells.push(h(cellComponent, {
      byte: chunk[i],
      onSelect: linkEvent({
        setCursor,
        onBeginSelection,
        onEndSelection,
        i: chunkOffset + i
      }, onCellClick),
      selected: i >= selection.start && i <= selection.end,
      focused: i === cursor
    }))
  }

  return h('span', cells)
})
