import {
  WECHAT_NEW
} from '../../actions/types'

const initialState = {
  wechat: []
}

export default function(state = initialState, action) {
  const { type, payload } = action;

  // console.log(payload)

  switch(type) {
    case WECHAT_NEW:
      state.wechat = state.wechat.slice();
      state.wechat.push(payload)
      return state
    default:
      return state;
  }
}