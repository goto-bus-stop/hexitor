const { combineReducers } = require('redux')
const currentFile = require('./currentFile')
const cursor = require('./cursor')

module.exports = exports = combineReducers({
  currentFile,
  cursor
})

Object.assign(exports, currentFile)
Object.assign(exports, cursor)
