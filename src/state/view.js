module.exports = exports = view

exports.SET_VISIBLE_AREA = 'hexitor/view/SET_VISIBLE_AREA'

exports.setVisibleArea = function setVisibleArea (top, left, height, width) {
  return {
    type: exports.SET_VISIBLE_AREA,
    payload: { top, left, height, width }
  }
}

const initialState = {
  visible: null
}

function view (state = initialState, action) {
  switch (action.type) {
    case exports.SET_VISIBLE_AREA:
      return Object.assign({}, state, {
        visible: action.payload
      })
    default:
      return state
  }
}
