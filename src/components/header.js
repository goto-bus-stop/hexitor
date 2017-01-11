const h = require('inferno-hyperscript')
const css = require('glamor').css
const FileInput = require('./fileInput')

const styles = {
  header: css({
    height: '50px',
    lineHeight: '50px',
    background: '#e99',
    padding: '0 20px'
  }),
  title: css({
    margin: 0,
    marginRight: 50,
    float: 'left'
  })
}

module.exports = function Header () {
  return h(`.${styles.header}`, [
    h(`h1.${styles.title}`, 'Hexitor'),
    h(FileInput)
  ])
}
