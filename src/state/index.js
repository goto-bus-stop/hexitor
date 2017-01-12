const { combineReducers } = require('redux')
const currentFile = require('./currentFile')
const cursor = require('./cursor')
const view = require('./view')

module.exports = exports = combineReducers({
  currentFile,
  cursor,
  view
})

Object.assign(exports, currentFile)
Object.assign(exports, cursor)
Object.assign(exports, view)
