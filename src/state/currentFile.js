const HexBuffer = require('../buffer')

module.exports = exports = currentFile

exports.LOAD_FILE_START = 'hexitor/file/LOAD_FILE_START'
exports.LOAD_FILE_FINISH = 'hexitor/file/LOAD_FILE_FINISH'

exports.loadFileStart = function loadFileStart (filename) {
  return {
    type: exports.LOAD_FILE_START,
    payload: { filename }
  }
}

exports.loadFileFinish = function loadFileFinish (buffer) {
  return {
    type: exports.LOAD_FILE_FINISH,
    payload: HexBuffer.from(buffer)
  }
}

const initialState = {
  loading: false,
  filename: null,
  buffer: null
}

function currentFile (state = initialState, action) {
  switch (action.type) {
    case exports.LOAD_FILE_START:
      return Object.assign({}, state, {
        filename: action.payload.filename,
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
