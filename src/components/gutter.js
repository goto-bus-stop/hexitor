const h = require('inferno-create-element')
const { connect } = require('inferno-redux')
const css = require('tagged-css-modules')
const { selectLineHeight, selectTotalHeight, selectTotalLines } = require('../state')
const pure = require('../utils/pure')

const styles = css`
  .gutter {
    width: 100%;
    background: #1b1b1b;
    font: 16px monospace;
    text-align: right;
    color: white;
  }

  .selected {
    color: #777;
  }

  .padding {
    opacity: 0.5;
  }

  .hex {}
`

const enhance = connect(
  (state) => ({
    cursor: state.cursor.position,
    lineHeight: selectLineHeight(state),
    totalHeight: selectTotalHeight(state),
    totalLines: selectTotalLines(state),
    firstVisibleLine: state.view.firstVisibleLine,
    visibleLines: state.view.visibleLines,
    bytesPerLine: state.view.bytesPerLine
  })
)

module.exports = enhance(pure()(Gutter))

function Byte ({ byte, selected }) {
  const hex = byte.toString(16).toUpperCase()
  const padding = '0'.repeat(8 - hex.length)
  return h('div', selected ? { className: styles.selected } : {}, [
    h('span', { className: styles.padding }, padding),
    h('span', { className: styles.hex }, hex)
  ])
}

function Gutter ({
  cursor,
  lineHeight,
  totalHeight,
  firstVisibleLine,
  visibleLines,
  totalLines,
  bytesPerLine
}) {
  let firstByte = firstVisibleLine * bytesPerLine
  const markers = []
  const end = Math.min(firstVisibleLine + visibleLines, totalLines)
  for (let i = firstVisibleLine; i < end; i++) {
    markers.push(h(Byte, {
      byte: firstByte,
      selected: cursor >= firstByte && cursor <= firstByte + bytesPerLine
    }))
    firstByte += bytesPerLine
  }

  const topPadding = firstVisibleLine * lineHeight
  return h('div', { className: styles.gutter, style: { height: totalHeight } },
    h('div', { style: { transform: `translateY(${topPadding}px)` } }, markers)
  )
}
