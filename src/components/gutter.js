const h = require('inferno-hyperscript')
const { connect } = require('inferno-redux')
const { css } = require('glamor')
const { selectLineHeight, selectTotalHeight } = require('../state')
const pure = require('../utils/pure')

const styles = {
  gutter: css({
    width: '100%',
    background: '#1b1b1b',
    font: '16px monospace',
    textAlign: 'right',
    color: 'white'
  }),
  selected: css({
    color: '#ff7'
  }),
  padding: css({ opacity: 0.5 }),
  hex: css({})
}

const enhance = connect(
  (state) => ({
    cursor: state.cursor.position,
    lineHeight: selectLineHeight(state),
    totalHeight: selectTotalHeight(state),
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
    h(`span.${styles.padding}`, padding),
    h(`span.${styles.hex}`, hex)
  ])
}

function Gutter ({
  cursor,
  lineHeight,
  totalHeight,
  firstVisibleLine,
  visibleLines,
  bytesPerLine
}) {
  let firstByte = firstVisibleLine * bytesPerLine
  const markers = []
  for (let i = 0; i < visibleLines; i++) {
    markers.push(h(Byte, {
      byte: firstByte,
      selected: cursor >= firstByte && cursor <= firstByte + bytesPerLine
    }))
    firstByte += bytesPerLine
  }

  const topPadding = firstVisibleLine * lineHeight
  return h(`.${styles.gutter}`, { style: { height: totalHeight } }, [
    h('div', { style: { transform: `translateY(${topPadding}px)` } }, markers)
  ])
}
