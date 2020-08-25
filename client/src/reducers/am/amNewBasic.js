import {
  AM_BASIC_NEW
} from '../../actions/types';

const initialState = {
  basic: []
}

export default function(state = initialState, action) {
  const { type, payload } = action;

  // console.log(payload)

  switch(type) {
    case AM_BASIC_NEW:
      // console.log(payload)
      state.basic = state.basic.slice();
      state.basic.push(payload)
      // console.log(state)
      return state
    default:
      return state;
  }
}