const html = require('bel')
const css = require('tagged-css-modules')
const connect = require('../utils/connect')
const Gutter = require('./gutter')
const Hex = require('./hex')
const Ascii = require('./ascii')
const {
  dispatch,
  setVisibleArea,
  reportCellSize
} = require('../state')

const GUTTER_WIDTH = 100
const BORDER_WIDTH = 2

const styles = css`
  .split {
    display: flex;
    height: 100%;
    width: 100%;
    overflow-y: auto;
  }

  .gutter {
    width: ${GUTTER_WIDTH}px;
    background: #1b1b1b;
    border-right: ${BORDER_WIDTH}px solid #000;
  }

  .hex {}
  .ascii {}
`

module.exports = MainViews

function MainViews () {
  const report = (type) => (size) => dispatch(reportCellSize(type, size))

  function onUpdate (el) {
    dispatch(setVisibleArea(
      el.scrollTop,
      el.scrollLeft,
      el.clientHeight,
      el.clientWidth
    ))
  }

  function onScroll (event) {
    onUpdate(event.target)
  }

  const hex = html`
    <div class=${styles.hex}>
      ${Hex({ onCellSize: report('hex') })}
    </div>
  `
  const ascii = html`
    <div class=${styles.ascii}>
      ${Ascii({ onCellSize: report('ascii') })}
    </div>
  `

  return connect((state) => {
    const widths = state.view.widths
    hex.style.width = `${widths.hex}px`
    ascii.style.width = `${widths.ascii}px`
  })(html`
    <span>
      <div class=${styles.split} onscroll=${onScroll} onload=${onUpdate}>
        <div class=${styles.gutter}>
          ${Gutter()}
        </div>
        ${hex}
        ${ascii}
      </div>
    </span>
  `)
}
