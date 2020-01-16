function createView (base, start, end) {
  const view = base.subarray(start, end)
  view.base = base
  view.start = start
  view.end = end
  view.equals = (other) =>
    (view === other) ||
    (other.base === base && other.start === start && other.end === end)

  return view
}

class HexBuffer extends Buffer {
  constructor (...args) {
    super(...args)
    this.initHexBuffer()
  }

  initHexBuffer () {
    this.viewsCache = {}
  }

  view (start, end) {
    if (!has(this.viewsCache, start)) {
      this.viewsCache[start] = {}
    } else if (has(this.viewsCache[start], end)) {
      return this.viewsCache[start][end]
    }

    const view = createView(this, start, end)

    this.viewsCache[start][end] = view
    return view
  }
}

module.exports = HexBuffer

HexBuffer.from = (arrayBuffer) => {
  const base = Buffer.from(arrayBuffer)
  Object.setPrototypeOf(base, HexBuffer.prototype)
  base.initHexBuffer()
  return base
}

function has (obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}
