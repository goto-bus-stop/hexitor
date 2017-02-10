const empty = require('empty-element')
const bel = require('bel')
const css = require('tagged-css-modules')
const {
  dispatch,
  moveCursor,
  selectLineHeight,
  selectTotalLines,
  selectTotalHeight
} = require('../state')
const measure = require('../utils/measure')
const connect = require('../utils/connect')

const styles = css`
  .field {
    width: 100%;
    font: 16px monospace;
    color: white;
    background: #1b1b1b;
  }
`

module.exports = DataView

function replaceElement (oldElement, newElement) {
  if (oldElement.parentNode) {
    oldElement.parentNode.insertBefore(newElement, oldElement)
    oldElement.parentNode.removeChild(oldElement)
  }
  return newElement
}

function DataView ({ renderCell, onCellSize }) {
  const visibleWrapper = bel`<div />`
  const heightWrapper = bel`
    <div>${visibleWrapper}</div>
  `

  let previousChunks = []

  let selectedElement

  function getCell ({ byte, selected, byteIndex }) {
    const cell = renderCell({ byte, selected })

    cell.dataset.byteIndex = byteIndex
    return cell
  }

  function onload (el) {
    const cell = renderCell({
      byte: 0,
      selected: false,
      onSelect: () => {}
    })

    el.appendChild(cell)
    const size = cell.getBoundingClientRect()
    el.removeChild(cell)

    onCellSize(size)
  }

  function onclick (event) {
    const data = event.target.dataset
    if (typeof data.byteIndex !== 'undefined') {
      dispatch(moveCursor(parseInt(data.byteIndex, 10)))
    }
  }

  function renderLine ({
    buffer,
    cursor,
    bytesPerLine,
    lineStart
  }) {
    const line = bel`<span />`
    for (let b = 0; b < bytesPerLine; b += 1) {
      const byteIndex = lineStart + b
      line.appendChild(getCell({
        byteIndex,
        byte: buffer[byteIndex],
        selected: byteIndex === cursor
      }))
    }
    return line
  }

  function chunksById (chunks) {
    return chunks.reduce((ids, chunk) => {
      ids[chunk.lineStart] = chunk.element
      return ids
    }, {})
  }

  function removeOldChunks(previousChunks, nextChunks) {
    const nextChunkIds = chunksById(nextChunks)

    // Remove chunks that have gone out of view
    previousChunks.forEach((chunk) => {
      if (!nextChunkIds[chunk.lineStart]) {
        visibleWrapper.removeChild(chunk.element)
      }
    })
  }

  function insertNewChunks(nextChunks) {
    let insertBefore = true
    const firstChild = visibleWrapper.firstChild
    nextChunks.forEach((chunk) => {
      if (chunk.new) {
        // New chunks should be added *before* the existing chunks.
        // Until we find a chunk that already existed--in that case, we assume
        // it's a contiguous block of rendered chunks, so we continue by adding
        // new chunks after the end of the block.
        if (insertBefore && firstChild) {
          visibleWrapper.insertBefore(chunk.element, firstChild)
        } else {
          visibleWrapper.appendChild(chunk.element)
        }
      } else {
        insertBefore = false
      }
    })
  }

  function update ({
    buffer,
    cursor,
    firstVisibleLine,
    visibleLines,
    bytesPerLine
  }) {
    const chunks = []
    const previousChunkIds = chunksById(previousChunks)

    // Create elements for new chunks.
    for (let i = 0; i < visibleLines; i++) {
      const lineStart = (firstVisibleLine + i) * bytesPerLine
      const lineEnd = lineStart + bytesPerLine

      // Stop if we're at the end of the file.
      if (lineStart > buffer.length) {
        break
      }

      const chunk = { lineStart }
      chunks.push(chunk)

      // Reuse the old element if this chunk was already visible
      if (previousChunkIds[lineStart]) {
        chunk.element = previousChunkIds[lineStart]
        continue
      }

      // Render a new element if the chunk was not previously visible.
      chunk.element = renderLine({
        buffer,
        cursor,
        bytesPerLine,
        lineStart
      })
      chunk.new = true
    }

    // Remove chunks that have gone out of view.
    removeOldChunks(previousChunks, chunks)

    // Add chunks that are now in view.
    insertNewChunks(chunks)

    // Remember chunks so we can diff on the next render.
    previousChunks = chunks

    let nextSelectedElement = visibleWrapper.querySelector(`[data-byte-index="${cursor}"]`)
    if (selectedElement !== nextSelectedElement) {
      if (selectedElement) {
        const previousCursor = parseInt(selectedElement.dataset.byteIndex, 10)
        selectedElement = replaceElement(selectedElement, getCell({
          byteIndex: previousCursor,
          byte: buffer[previousCursor],
          selected: false
        }))
      }
      if (nextSelectedElement) {
        nextSelectedElement = replaceElement(nextSelectedElement, getCell({
          byteIndex: cursor,
          byte: buffer[cursor],
          selected: true
        }))
      }
    }
    selectedElement = nextSelectedElement
  }

  return connect((state, el) => {
    const buffer = state.currentFile.buffer
    const cursor = state.cursor.position
    const visible = state.view.visible
    const lineHeight = selectLineHeight(state)
    const totalHeight = selectTotalHeight(state)
    const firstVisibleLine = state.view.firstVisibleLine
    const visibleLines = state.view.visibleLines
    const bytesPerLine = state.view.bytesPerLine

    const topPadding = firstVisibleLine * lineHeight
    heightWrapper.style.height = `${totalHeight}px`
    visibleWrapper.style.transform = `translateY(${topPadding}px)`

    if (buffer) update({
      buffer,
      cursor,
      firstVisibleLine,
      visibleLines,
      bytesPerLine
    })
  })(bel`
    <span>
      <div class=${styles.field} onload=${onload} onclick=${onclick}>
        ${heightWrapper}
      </div>
    </span>
  `)
}

DataView.make = function makeDataView (renderCell) {
  return (props) => DataView(Object.assign({ renderCell }, props))
}
