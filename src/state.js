const { combineReducers } = require('redux')

module.exports = exports = combineReducers({
  currentFile
})

exports.LOAD_FILE_START = 'hexitor/file/LOAD_FILE_START'
exports.LOAD_FILE_FINISH = 'hexitor/file/LOAD_FILE_FINISH'

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

