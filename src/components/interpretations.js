const html = require('bel')
const css = require('tagged-css-modules')
const connect = require('../utils/connect')

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
    composes: valuePart;
    text-align: right;
    padding-right: 24px;
    color: white;
  }

  .input {
    composes: valuePart;
    padding: 0 .75em;
    line-height: 1.5;
    font: inherit;
    border-radius: 3px;
    border: 1px solid #dbdbdb;
  }
`

module.exports = Interpretations

function onInputClick (event) {
  event.target.select()
}

const createValueComponent = (label, reader) => () => {
  const input = html`
    <input
      class=${styles.input}
      readonly
      onclick=${onInputClick}
    />
  `

  const update = ({ buffer, cursor }) => {
    input.value = buffer ? reader(buffer, cursor) : ''
  }

  const element = html`
    <div class=${styles.valueComponent}>
      <label class=${styles.label}>${label}</label>
      ${input}
    </div>
  `

  return { update, render: () => element }
}

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

function Interpretations () {
  const representations = [
    [AsInt8(), AsUInt8(), AsInt16LE(), AsUInt16LE()],
    [AsInt32LE(), AsUInt32LE(), AsFloatLE(), AsDoubleLE()],
    [AsHexadecimal(), AsOctal(), AsBinary(), AsAscii(), AsUtf8()]
  ]

  const columns = representations.map((col) => html`
    <div>
      ${col.map((component) => component.render())}
    </div>
  `)

  return connect((state) => {
    const props = {
      buffer: state.currentFile.buffer,
      cursor: state.cursor.position
    }

    representations.forEach((column) => {
      column.forEach((repr) => {
        repr.update(props)
      })
    })
  })(html`
    <div class=${styles.interpretations}>
      ${columns}
    </div>
  `)
}
