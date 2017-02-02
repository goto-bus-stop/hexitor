const h = require('inferno-create-element')
const { connect } = require('inferno-redux')
const css = require('tagged-css-modules')
const pure = require('../utils/pure')

const styles = css`
  .interpretations {
    display: flex;
    justify-content: flex-start;
  }

  .valueComponent {
    display: flex;
    margin: 4px 0;
  }

  .valuePart {
    width: 200px;
    height: 24px;
    line-height: 24px;
    display: block;
  }

  .label {
    text-align: right;
    padding-right: 24px;
    color: white;
  }

  .input {
    padding: 0 .75em;
    line-height: 1.5;
    font: inherit;
    border-radius: 3px;
    border: 1px solid #dbdbdb;
  }
`

const enhance = connect(
  (state) => ({
    buffer: state.currentFile.buffer,
    cursor: state.cursor.position
  })
)

module.exports = enhance(pure()(Interpretations))

function onInputClick (event) {
  event.target.select()
}

const createValueComponent = (label, reader) => pure()(({ buffer, cursor }) =>
  h('div', { className: styles.valueComponent }, [
    h('label', { className: `${styles.valuePart} ${styles.label}` }, label),
    h('input', {
      className: `${styles.valuePart} ${styles.input}`,
      value: reader(buffer, cursor),
      readonly: true,
      onClick: onInputClick
    })
  ]))

const AsUInt8 = createValueComponent('Unsigned 8 bit', (b, i) => b.readUInt8(i))
const AsUInt16LE = createValueComponent('Unsigned 16 bit', (b, i) => b.readUInt16LE(i))
const AsUInt32LE = createValueComponent('Unsigned 32 bit', (b, i) => b.readUInt32LE(i))
const AsInt8 = createValueComponent('Signed 8 bit', (b, i) => b.readInt8(i))
const AsInt16LE = createValueComponent('Signed 16 bit', (b, i) => b.readInt16LE(i))
const AsInt32LE = createValueComponent('Signed 32 bit', (b, i) => b.readInt32LE(i))
const AsFloatLE = createValueComponent('Float 32 bit', (b, i) => b.readFloatLE(i))
const AsDoubleLE = createValueComponent('Double 64 bit', (b, i) => b.readDoubleLE(i))

const AsHexadecimal = createValueComponent('Hexadecimal 8 bit', (b, i) => b[i].toString(16).padStart(2, '0').toUpperCase())
const AsOctal = createValueComponent('Octal 8 bit', (b, i) => b[i].toString(8).padStart(3, '0'))
const AsBinary = createValueComponent('Binary 8 bit', (b, i) => b[i].toString(2).padStart(8, '0'))
const AsAscii = createValueComponent('ASCII', (b, i) => String.fromCharCode(b[i]))
const AsUtf8 = createValueComponent('UTF-8', (b, i) => b.readUtf8(i))

function Interpretations ({ buffer, cursor }) {
  if (!buffer) {
    return h('div')
  }
  return h('div', { className: styles.interpretations }, [
    h('div', {}, [
      h(AsInt8, { buffer, cursor }),
      h(AsUInt8, { buffer, cursor }),
      h(AsInt16LE, { buffer, cursor }),
      h(AsUInt16LE, { buffer, cursor })
    ]),
    h('div', {}, [
      h(AsInt32LE, { buffer, cursor }),
      h(AsUInt32LE, { buffer, cursor }),
      h(AsFloatLE, { buffer, cursor }),
      h(AsDoubleLE, { buffer, cursor })
    ]),
    h('div', {}, [
      h(AsHexadecimal, { buffer, cursor }),
      h(AsOctal, { buffer, cursor }),
      h(AsBinary, { buffer, cursor }),
      h(AsAscii, { buffer, cursor }),
      h(AsUtf8, { buffer, cursor })
    ])
  ])
}
