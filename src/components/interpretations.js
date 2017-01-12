const h = require('inferno-hyperscript')
const { connect } = require('inferno-redux')

const enhance = connect(
  (state) => ({
    buffer: state.currentFile.buffer,
    cursor: state.cursor.position
  })
)

module.exports = enhance(Interpretations)

const createValueComponent = (label, reader) => ({ buffer, cursor }) =>
  h('div', [
    h('label', label),
    h('input', { value: reader(buffer, cursor), readonly: true })
  ])

const AsUInt8 = createValueComponent('UInt8', (b, i) => b.readUInt8(i))
const AsUInt16LE = createValueComponent('UInt16LE', (b, i) => b.readUInt16LE(i))
const AsUInt32LE = createValueComponent('UInt32LE', (b, i) => b.readUInt32LE(i))
const AsInt8 = createValueComponent('Int8', (b, i) => b.readInt8(i))
const AsInt16LE = createValueComponent('Int16LE', (b, i) => b.readInt16LE(i))
const AsInt32LE = createValueComponent('Int32LE', (b, i) => b.readInt32LE(i))
const AsFloatLE = createValueComponent('FloatLE', (b, i) => b.readFloatLE(i))

function Interpretations ({ buffer, cursor }) {
  if (!buffer) {
    return h('div')
  }
  return h('div', [
    h(AsUInt8, { buffer, cursor }),
    h(AsUInt16LE, { buffer, cursor }),
    h(AsUInt32LE, { buffer, cursor }),
    h(AsInt8, { buffer, cursor }),
    h(AsInt16LE, { buffer, cursor }),
    h(AsInt32LE, { buffer, cursor }),
    h(AsFloatLE, { buffer, cursor })
  ])
}
