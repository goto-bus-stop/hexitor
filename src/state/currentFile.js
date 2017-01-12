module.exports = exports = currentFile

exports.LOAD_FILE_START = 'hexitor/file/LOAD_FILE_START'
exports.LOAD_FILE_FINISH = 'hexitor/file/LOAD_FILE_FINISH'

const initialState = {
  loading: false,
  buffer: null
}

function currentFile (state = initialState, action) {
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
