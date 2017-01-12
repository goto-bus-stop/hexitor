module.exports = exports = cursor

exports.MOVE_CURSOR = 'hexitor/cursor/MOVE_CURSOR'

const initialState = { position: 0 }

function cursor (state = initialState, action) {
  switch (action.type) {
    case exports.MOVE_CURSOR:
      if (typeof action.payload === 'function') {
        return { position: action.payload(state.position) }
      }
      return { position: action.payload }
    default:
      return state
  }
}
