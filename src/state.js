const { combineReducers } = require('redux')

module.exports = exports = combineReducers({
  currentFile,
  cursor
})

exports.LOAD_FILE_START = 'hexitor/file/LOAD_FILE_START'
exports.LOAD_FILE_FINISH = 'hexitor/file/LOAD_FILE_FINISH'
exports.MOVE_CURSOR = 'hexitor/cursor/MOVE_CURSOR'

function currentFile (state = {
  loading: false,
  buffer: null
}, action) {
  switch (action.type) {
    case exports.LOAD_FILE_START:
      return Object.assign({}, state, {
        loading: true,
        buffer: null
      })
    case exports.LOAD_FILE_FINISH:
      return Object.assign({}, state, {
        loading: false,
        buffer: action.payload
      })
    default:
      return state
  }
}

function cursor(state = { position: 0 }, action) {
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
