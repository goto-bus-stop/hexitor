const h = require('inferno-hyperscript')
const { linkEvent } = require('inferno')
const { connect } = require('inferno-redux')
const { css } = require('glamor')
const Hex = require('./hex')
const Ascii = require('./ascii')
const { setVisibleArea, reportCellSize } = require('../state')

const styles = {
  split: css({
    display: 'flex',
    height: '100%',
    width: '100%',
    overflowY: 'auto'
  }),
  hex: css({ }),
  ascii: css({ })
}

const enhance = connect(
  (state) => {
    const { width } = state.view.visible
    const { hex, ascii } = state.view.cellSizes

    if (!hex || !ascii) {
      return { hexWidth: 'auto', asciiWidth: 'auto' }
    }

    const proportionTotal = hex.width + ascii.width

    const hexWidth = (hex.width / proportionTotal) * width
    const asciiWidth = (ascii.width / proportionTotal) * width

    return { hexWidth, asciiWidth }
  },
  {
    setVisibleArea,
    reportHexCellSize: reportCellSize.bind(null, 'hex'),
    reportAsciiCellSize: reportCellSize.bind(null, 'ascii')
  }
)

module.exports = enhance(MainViews)

function onUpdate (setVisibleArea, el) {
  setVisibleArea(
    el.scrollTop,
    el.scrollLeft,
    el.clientHeight,
    el.clientWidth
  )
}

function onScroll (setVisibleArea, event) {
  onUpdate(setVisibleArea, event.target)
}

const Wrapper = (props) => h(`.${styles.split}`, props)

function MainViews ({
  hexWidth,
  asciiWidth,
  setVisibleArea,
  reportHexCellSize,
  reportAsciiCellSize
}) {
  return h(Wrapper, {
    onComponentDidMount: onUpdate.bind(null, setVisibleArea),
    onScroll: linkEvent(setVisibleArea, onScroll)
  }, [
    h(`.${styles.hex}`, { style: { width: hexWidth } },
      [ h(Hex, { width: hexWidth, onCellSize: reportHexCellSize }) ]),
    h(`.${styles.ascii}`, { style: { width: asciiWidth } },
      [ h(Ascii, { width: asciiWidth, onCellSize: reportAsciiCellSize }) ])
  ])
}
