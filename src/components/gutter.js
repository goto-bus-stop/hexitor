const cx = require('clsx')
const html = require('nanohtml')
const empty = require('empty-element')
const css = require('tagged-css-modules')
const { selectLineHeight, selectTotalHeight, selectTotalLines } = require('../state')
const connect = require('../utils/connect')

const styles = css`
  .gutter {
    width: 100%;
    background: #1b1b1b;
    font: 16px monospace;
    text-align: right;
    color: white;
  }

  .lineNumber {
    word-spacing: 0;
  }

  .selected {
    color: #ff7;
  }

  .padding {
    opacity: 0.5;
  }
`

module.exports = Gutter

function Byte ({ byte, selected }) {
  const hex = byte.toString(16).toUpperCase()
  const padding = '0'.repeat(8 - hex.length)

  const classNames = cx([
    styles.lineNumber,
    selected && styles.selected
  ])
  return html`
    <div class=${classNames}>
      <span class=${styles.padding}>${padding}</span>${hex}
    </div>
  `
}

function Gutter () {
  const markersWrapper = html`<div />`

  function updateMarkers ({
    firstVisibleLine,
    visibleLines,
    bytesPerLine,
    totalLines,
    cursor
  }) {
    empty(markersWrapper)

    let firstByte = firstVisibleLine * bytesPerLine
    const end = Math.min(firstVisibleLine + visibleLines, totalLines)
    for (let i = firstVisibleLine; i < end; i++) {
      markersWrapper.appendChild(Byte({
        byte: firstByte,
        selected: cursor >= firstByte && cursor <= firstByte + bytesPerLine
      }))
      firstByte += bytesPerLine
    }
  }

  return connect((state, el) => {
    const cursor = state.cursor.position
    const lineHeight = selectLineHeight(state)
    const totalHeight = selectTotalHeight(state)
    const totalLines = selectTotalLines(state)
    const firstVisibleLine = state.view.firstVisibleLine
    const visibleLines = state.view.visibleLines
    const bytesPerLine = state.view.bytesPerLine

    const topPadding = firstVisibleLine * lineHeight

    el.style.height = `${totalHeight}px`
    markersWrapper.style.transform = `translateY(${topPadding}px)`

    updateMarkers({
      firstVisibleLine,
      visibleLines,
      bytesPerLine,
      totalLines,
      cursor
    })
  })(html`
    <div class=${styles.gutter}>
      ${markersWrapper}
    </div>
  `)
}
