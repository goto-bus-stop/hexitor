const h = require('inferno-hyperscript')
const { linkEvent } = require('inferno')
const { connect } = require('inferno-redux')
const { css } = require('glamor')
const Hex = require('./hex')
const Ascii = require('./ascii')
const { setVisibleArea } = require('../state')

const styles = {
  split: css({
    display: 'flex',
    height: '100%',
    width: '100%',
    overflowY: 'auto'
  }),
  hex: css({
    flexGrow: 2
  }),
  ascii: css({
    flexGrow: 1
  })
}

const enhance = connect(
  state => ({}),
  { setVisibleArea }
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

function MainViews ({ setVisibleArea }) {
  return h(Wrapper, {
    onComponentDidMount: onUpdate.bind(null, setVisibleArea),
    onScroll: linkEvent(setVisibleArea, onScroll)
  }, [
    h(`.${styles.hex}`, [ h(Hex) ]),
    h(`.${styles.ascii}`, [ h(Ascii) ])
  ])
}
