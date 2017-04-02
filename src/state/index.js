const { combineReducers, createStore } = require('redux')
const currentFile = require('./currentFile')
const cursor = require('./cursor')
const view = require('./view')

const reducer = combineReducers({
  currentFile,
  cursor,
  view
})

module.exports = exports = createStore(reducer)

Object.assign(exports, currentFile)
Object.assign(exports, cursor)
Object.assign(exports, view)
