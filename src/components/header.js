const empty = require('empty-element')
const html = require('bel')
const css = require('tagged-css-modules')
const connect = require('../utils/connect')
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

module.exports = Header

function FileTab (filename) {
  return html`
    <div class=${styles.tab}>
      ${filename}
    </div>
  `
}

function Header () {
  const tabs = html`
    <div class=${styles.tabs} />
  `

  let lastFilename
  return connect((state, el) => {
    const newFilename = state.currentFile.filename
    if (newFilename === lastFilename) {
      return
    }
    lastFilename = newFilename

    empty(tabs)

    if (newFilename) {
      tabs.appendChild(FileTab(newFilename))
    }
  })(html`
    <div class=${styles.header}>
      <h1 class=${styles.title}>
        Hexitor
      </h1>
      ${tabs}
      ${FileInput()}
    </div>
  `)
}
