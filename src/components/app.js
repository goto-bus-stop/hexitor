const h = require('inferno-hyperscript')
const css = require('glamor').css
const Hex = require('./hex')

css.global('body', {
  margin: 0,
  padding: 0,
  font: '10pt Ubuntu'
})

const styles = {
  header: css({
    height: '50px',
    lineHeight: '50px',
    background: '#e99'
  }),
  title: css({
    margin: 0
  })
}

module.exports = function App () {
  return h('div', [
    h(`.${styles.header}`, [
      h(`h1.${styles.title}`, 'Hexitor')
    ]),
    h(Hex)
  ])
}
