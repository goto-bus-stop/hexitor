const extend = require('deep-extend')
const reduceReducers = require('reduce-reducers')

module.exports = exports = reduceReducers(view, updateVisibleLines)

exports.SET_VISIBLE_AREA = 'hexitor/view/SET_VISIBLE_AREA'
exports.REPORT_CELL_SIZE = 'hexitor/view/REPORT_CELL_SIZE'

exports.setVisibleArea = function setVisibleArea (top, left, height, width) {
  return {
    type: exports.SET_VISIBLE_AREA,
    payload: { top, left, height, width }
  }
}

exports.reportCellSize = function reportCellSize (type, { top, left, height, width }) {
  return {
    type: exports.REPORT_CELL_SIZE,
    payload: { type, size: { top, left, height, width } }
  }
}

const initialState = {
  visible: {
    top: 0,
    left: 0,
    height: 0,
    width: 0
  },
  cellSizes: {}
}

const GUTTER_WIDTH = 100

function getProportionalWidths (freeWidth, { hex, ascii }) {
  if (!hex || !ascii) {
    return { hex: 'auto', ascii: 'auto' }
  }

  const proportionTotal = hex.width + ascii.width
  const hexWidth = (hex.width / proportionTotal) * freeWidth
  const asciiWidth = (ascii.width / proportionTotal) * freeWidth

  return { hex: hexWidth, ascii: asciiWidth }
}

function updateVisibleLines (state) {
  const { visible, cellSizes } = state

  const freeWidth = visible.width - GUTTER_WIDTH
  const widths = getProportionalWidths(freeWidth, cellSizes)

  // Assuming here that line heights are always the same!
  const lineHeight = cellSizes.hex && cellSizes.hex.height
  const bytesPerLine = cellSizes.hex && Math.floor(widths.hex / cellSizes.hex.width)

  return extend({}, state, {
    widths,
    firstVisibleLine: Math.floor(visible.top / lineHeight / 10) * 10,
    visibleLines: Math.ceil(visible.height / lineHeight / 10 + 1) * 10,
    bytesPerLine
  })
}

function view (state = initialState, action) {
  switch (action.type) {
    case exports.SET_VISIBLE_AREA:
      return extend({}, state, {
        visible: action.payload
      })
    case exports.REPORT_CELL_SIZE:
      return extend({}, state, {
        cellSizes: {
          [action.payload.type]: action.payload.size
        }
      })
    default:
      return state
  }
}

const selectTotalLines = ({ currentFile, view }) =>
  Math.ceil((currentFile.buffer || []).length / (view.bytesPerLine || Infinity))
const selectLineHeight = ({ view }) =>
  ((view.cellSizes.hex || view.cellSizes.ascii || {}).height || 0)
const selectTotalHeight = (state) =>
  selectTotalLines(state) * selectLineHeight(state)

Object.assign(exports, {
  selectTotalLines,
  selectLineHeight,
  selectTotalHeight
})
