const { render } = require('inferno')

module.exports = measure

function measure (component, inside = document.body) {
  const target = document.createElement('span')
  inside.appendChild(target)
  render(component, target)

  const el = target.firstChild
  const size = el.getBoundingClientRect()

  inside.removeChild(target)

  return size
}
