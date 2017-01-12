module.exports = exports = cursor

exports.MOVE_CURSOR = 'hexitor/cursor/MOVE_CURSOR'

exports.moveCursor = function moveCursor (delta) {
  return {
    type: exports.MOVE_CURSOR,
    payload: typeof delta === 'function' ? delta : () => delta
  }
}

const initialState = { position: 0 }

function cursor (state = initialState, action) {
  switch (action.type) {
    case exports.MOVE_CURSOR:
      return { position: action.payload(state.position) }
    default:
      return state
  }
}
