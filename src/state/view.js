module.exports = exports = view

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

function view (state = initialState, action) {
  switch (action.type) {
    case exports.SET_VISIBLE_AREA:
      return Object.assign({}, state, {
        visible: action.payload
      })
    case exports.REPORT_CELL_SIZE:
      return Object.assign({}, state, {
        cellSizes: Object.assign({}, state.cellSizes, {
          [action.payload.type]: action.payload.size
        })
      })
    default:
      return state
  }
}
