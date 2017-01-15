module.exports = exports = cursor

exports.MOVE_CURSOR = 'hexitor/cursor/MOVE_CURSOR'
exports.BEGIN_SELECTION = 'hexitor/cursor/BEGIN_SELECTION'
exports.MOVE_SELECTION = 'hexitor/cursor/MOVE_SELECTION'
exports.CLEAR_SELECTION = 'hexitor/cursor/CLEAR_SELECTION'

exports.moveCursor = function moveCursor (delta) {
  return {
    type: exports.MOVE_CURSOR,
    payload: typeof delta === 'function' ? delta : () => delta
  }
}

exports.beginSelection = function beginSelection (cursor) {
  return {
    type: exports.BEGIN_SELECTION,
    payload: cursor
  }
}

exports.endSelection = function endSelection (cursor) {
  return {
    type: exports.MOVE_SELECTION,
    payload: cursor
  }
}

const initialState = {
  position: 0,
  selectionStart: null,
  selectionEnd: null
}

function cursor (state = initialState, action) {
  switch (action.type) {
    case exports.MOVE_CURSOR:
      return Object.assign({}, state, {
        position: action.payload(state.position)
      })
    case exports.BEGIN_SELECTION:
      return Object.assign({}, state, {
        selectionStart: action.payload,
        selectionEnd: action.payload
      })
    case exports.MOVE_SELECTION:
      if (action.payload < state.selectionStart) {
        return Object.assign({}, state, {
          selectionStart: action.payload,
          selectionEnd: state.selectionStart
        })
      }

      return Object.assign({}, state, {
        selectionEnd: action.payload
      })
    case exports.CLEAR_SELECTION:
      return Object.assign({}, state, {
        selectionStart: null,
        selectionEnd: null
      })
    default:
      return state
  }
}

exports.selectCursorPosition = (state) =>
  state.cursor.position
exports.selectMainSelection = (state) =>
  ({ start: state.cursor.selectionStart, end: state.cursor.selectionEnd })
