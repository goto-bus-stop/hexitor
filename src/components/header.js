const h = require('inferno-create-element')
const { connect } = require('inferno-redux')
const css = require('glamor').css
const FileInput = require('./fileInput')

const styles = {
  header: css({
    height: '50px',
    lineHeight: '50px',
    background: '#53209d',
    color: 'white',
    padding: '0 20px'
  }),
  title: css({
    margin: 0,
    marginRight: 50,
    fontWeight: 'normal',
    float: 'left'
  }),
  tabs: css({
    float: 'left',
    display: 'flex',
    height: '100%',
    borderLeft: '1px solid rgba(0, 0, 0, 0.3)',
    marginRight: 20
  }),
  tab: css({
    border: '0 solid rgba(0, 0, 0, 0.3)',
    borderRightWidth: 1,
    height: '100%',
    padding: '0 20px'
  })
}

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
