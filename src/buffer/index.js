const Buffers = require('buffers')

class HexBuffer extends Buffers {
  chunks () {
    return this.buffers
  }
}

module.exports = HexBuffer

HexBuffer.from = function (arrayBuffer, size) {
  const buf = new HexBuffer()
  for (let i = 0; i < arrayBuffer.byteLength; i += size) {
    const chunk = Buffer.from(arrayBuffer.slice(i, i + size))
    buf.push(chunk)
  }
  return buf
}
