const Inferno = require('inferno')
const h = require('inferno-hyperscript')
const App = require('./components/app')

Inferno.render(
  h(App, {
    onComponentDidMount: () => console.log('ComponentDidMount')
  }),
  document.querySelector('#app')
)
