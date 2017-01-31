const h = require('inferno-create-element')
const { connect } = require('inferno-redux')
const css = require('tagged-css-modules')
const FileInput = require('./fileInput')

const styles = css`
  .header {
    height: 50px;
    line-height: 50px;
    background: #53209d;
    color: white;
    padding: 0 20px;
  }

  .title {
    margin: 0;
    margin-right: 50px;
    font-weight: normal;
    float: left;
  }

  .tabs {
    float: left;
    display: flex;
    height: 100%;
    border-left: 1px solid rgba(0, 0, 0, 0.3);
    margin-right: 20px;
  }

  .tab {
    border: 0 solid rgba(0, 0, 0, 0.3);
    border-right-width: 1px;
    height: 100%;
    padding: 0 20px;
  }
`

const enhance = connect(
  (state) => ({
    filename: state.currentFile.filename
  })
)

module.exports = enhance(Header)

function Header ({ filename }) {
  return h('div', { className: styles.header }, [
    h('h1', { className: styles.title }, 'Hexitor'),
    h('div', { className: styles.tabs },
      filename && h('div', { className: styles.tab }, filename)
    ),
    h(FileInput)
  ])
}
