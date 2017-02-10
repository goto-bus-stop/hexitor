const bel = require('bel')
const file = require('file-component')
const connect = require('../utils/connect')
const { dispatch, loadFileStart, loadFileFinish } = require('../state')

function onChange (event) {
  if (event.target.files.length === 0) {
    return
  }

  const input = file(event.target.files[0])
  dispatch(loadFileStart(input.name))
  input.toArrayBuffer((err, buffer) => {
    if (err) {
      console.error(err.message)
      return
    }
    dispatch(loadFileFinish(buffer))
  })
}

module.exports = FileInput

function FileInput () {
  const loadingIndicator = bel`
    <span>Loading ...</span>
  `

  let wasLoading = false

  return connect((state, el) => {
    if (state.currentFile.loading) {
      el.insertBefore(loadingIndicator, el.firstChild)
    } else if (wasLoading) {
      el.removeChild(loadingIndicator)
    }
    wasLoading = state.currentFile.loading
  })(bel`
    <div>
      <input type="file" onchange=${onChange} />
    </div>
  `)
}
