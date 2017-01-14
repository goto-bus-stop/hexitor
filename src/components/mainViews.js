const h = require('inferno-hyperscript')
const { linkEvent } = require('inferno')
const { connect } = require('inferno-redux')
const { css } = require('glamor')
const Gutter = require('./gutter')
const Hex = require('./hex')
const Ascii = require('./ascii')
const {
  setVisibleArea,
  reportCellSize,
  selectLineHeight,
  selectTotalLines,
  selectTotalHeight
} = require('../state')

const GUTTER_WIDTH = 100
const BORDER_WIDTH = 2

const styles = {
  split: css({
    display: 'flex',
    height: '100%',
    width: '100%',
    overflowY: 'auto'
  }),
  gutter: css({
    width: GUTTER_WIDTH,
    background: '#1b1b1b',
    borderRight: '2px solid #000'
  }),
  hex: css({ }),
  ascii: css({ })
}

const enhance = connect(
  (state) => {
    return {
      visible: state.view.visible,
      lineHeight: selectLineHeight(state),
      totalHeight: selectTotalHeight(state),
      hexWidth: state.view.widths.hex,
      asciiWidth: state.view.widths.ascii,
      firstVisibleLine: state.view.firstVisibleLine,
      visibleLines: state.view.visibleLines,
      bytesPerLine: state.view.bytesPerLine
    }
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
    h(`.${styles.gutter}`, [ h(Gutter) ]),
    h(`.${styles.hex}`, { style: { width: hexWidth } },
      [ h(Hex, { width: hexWidth, onCellSize: reportHexCellSize }) ]),
    h(`.${styles.ascii}`, { style: { width: asciiWidth } },
      [ h(Ascii, { width: asciiWidth, onCellSize: reportAsciiCellSize }) ])
  ])
}
