const Inferno = require('inferno')
const h = require('inferno-hyperscript')
const { createStore } = require('redux')
const { Provider } = require('inferno-redux')
const App = require('./components/app')
const reducer = require('./state')

const store = createStore(reducer)

Inferno.render(
  h(Provider, { store }, h(App)),
  document.querySelector('#app')
)

window.store = store
