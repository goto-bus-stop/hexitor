const Inferno = require('inferno')
const h = require('inferno-hyperscript')

function App () {
  return h('div', [
    h('h1', 'Hello World!')
  ])
}

Inferno.render(
  h(App, {
    onComponentDidMount: () => console.log('ComponentDidMount')
  }),
  document.querySelector('#app')
)
