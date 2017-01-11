const h = require('inferno-hyperscript')
const { connect } = require('inferno-redux')
const file = require('file-component')
const state = require('../state')

function onChange (event, dispatch) {
  dispatch({ type: state.LOAD_FILE_START })
  const input = file(event.target.files[0])
  input.toArrayBuffer((err, buffer) => {
    dispatch({
      type: state.LOAD_FILE_FINISH,
      payload: Buffer.from(buffer)
    })
  })
}

const enhance = connect(
  state => state.currentFile,
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
