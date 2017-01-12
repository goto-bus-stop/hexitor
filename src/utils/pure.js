const Component = require('inferno-component')

module.exports = pure

function shallowEqual (a, b) {
  const ka = Object.keys(a)
  const kb = Object.keys(b)
  return ka.length === kb.length && ka.every((k) => a[k] === b[k])
}

function pure (equals = shallowEqual) {
  return (render) => class PureCell extends Component {
    shouldComponentUpdate (nextProps) {
      return !equals(this.props, nextProps)
    }

    render () {
      return render(this.props)
    }
  }
}
