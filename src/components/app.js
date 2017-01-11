const h = require('inferno-hyperscript')
const css = require('glamor').css
const Header = require('./header')
const Hex = require('./hex')

css.global('body', {
  background: '#333',
  margin: 0,
  padding: 0,
  font: '10pt Ubuntu'
})

module.exports = function App () {
  return h('div', [
    h(Header),
    h(Hex)
  ])
}
