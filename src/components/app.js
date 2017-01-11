const h = require('inferno-hyperscript')
const css = require('glamor').css
const Header = require('./header')
const Hex = require('./hex')
const Ascii = require('./ascii')

css.global('*, *::after, *::before', {
  boxSizing: 'border-box'
})

css.global('body', {
  background: '#333',
  margin: 0,
  padding: 0,
  font: '10pt Ubuntu'
})

const styles = {
  split: css({
    display: 'flex'
  }),
  hex: css({
    flexGrow: 2
  }),
  ascii: css({
    flexGrow: 1
  })
}

module.exports = function App () {
  return h('div', [
    h(Header),
    h(`.${styles.split}`, [
      h(`.${styles.hex}`, [ h(Hex) ]),
      h(`.${styles.ascii}`, [ h(Ascii) ])
    ])
  ])
}
