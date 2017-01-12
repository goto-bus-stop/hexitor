function createView (base, start, end) {
  const view = base.subarray(start, end)
  view.base = base
  view.start = start
  view.end = end
  view.equals = (other) =>
    other.base === base && other.start === start && other.end === end

  return view
}

class HexBuffer extends Buffer {
  view (start, end) {
    return createView(this, start, end)
  }
}

module.exports = HexBuffer

HexBuffer.from = (arrayBuffer) => {
  const base = Buffer.from(arrayBuffer)
  base.__proto__ = HexBuffer.prototype
  return base
}
