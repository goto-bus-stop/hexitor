const h = require('inferno-hyperscript')
const { connect } = require('inferno-redux')
const file = require('file-component')
const { loadFileStart, loadFileFinish } = require('../state')

function onChange (event, dispatch) {
  dispatch(loadFileStart())
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

const enhance = connect(
  state => ({ loading: state.currentFile.loading }),
  dispatch => ({ onChange: (event) => onChange(event, dispatch) })
)

module.exports = enhance(FileInput)

function FileInput ({ loading, onChange }) {
  return h('div', [
    loading && h('span', 'Loading ...'),
    h('input', {
      type: 'file',
      onChange: onChange
    })
  ])
}
