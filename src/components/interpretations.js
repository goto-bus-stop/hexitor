const h = require('inferno-hyperscript')
const { connect } = require('inferno-redux')
const { css } = require('glamor')

const styles = {
  interpretations: css({
    display: 'flex',
    justifyContent: 'flex-start'
  }),
  valueComponent: css({
    display: 'flex',
    margin: '4px 0'
  }),
  valuePart: css({
    width: 200,
    height: 24,
    lineHeight: '24px',
    display: 'block'
  }),
  label: css({
    textAlign: 'right',
    paddingRight: 24,
    color: 'white'
  }),
  input: css({
    padding: '0 .75em',
    lineHeight: 1.5,
    font: 'inherit',
    borderRadius: 3,
    border: '1px solid #dbdbdb'
  })
}

const enhance = connect(
  (state) => ({
    buffer: state.currentFile.buffer,
    cursor: state.cursor.position
  })
)

module.exports = enhance(Interpretations)

function onInputClick (event) {
  event.target.select()
}

const createValueComponent = (label, reader) => ({ buffer, cursor }) =>
  h(`div.${styles.valueComponent}`, [
    h(`label.${styles.valuePart}.${styles.label}`, label),
    h(`input.${styles.valuePart}.${styles.input}`, {
      value: reader(buffer, cursor),
      readonly: true,
      onClick: onInputClick
    })
  ])

const AsUInt8 = createValueComponent('Unsigned 8 bit', (b, i) => b.readUInt8(i))
const AsUInt16LE = createValueComponent('Unsigned 16 bit', (b, i) => b.readUInt16LE(i))
const AsUInt32LE = createValueComponent('Unsigned 32 bit', (b, i) => b.readUInt32LE(i))
const AsInt8 = createValueComponent('Signed 8 bit', (b, i) => b.readInt8(i))
const AsInt16LE = createValueComponent('Signed 16 bit', (b, i) => b.readInt16LE(i))
const AsInt32LE = createValueComponent('Signed 32 bit', (b, i) => b.readInt32LE(i))
const AsFloatLE = createValueComponent('Float 32 bit', (b, i) => b.readFloatLE(i))

function Interpretations ({ buffer, cursor }) {
  if (!buffer) {
    return h('div')
  }
  return h(`.${styles.interpretations}`, [
    h('div', [
      h(AsInt8, { buffer, cursor }),
      h(AsUInt8, { buffer, cursor }),
      h(AsInt16LE, { buffer, cursor }),
      h(AsUInt16LE, { buffer, cursor })
    ]),
    h('div', [
      h(AsInt32LE, { buffer, cursor }),
      h(AsUInt32LE, { buffer, cursor }),
      h(AsFloatLE, { buffer, cursor })
    ])
  ])
}
