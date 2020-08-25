import {
  SET_ALERT_SUB,
  REMOVE_ALERT_SUB
} from '../actions/types';

const initialState = [];

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch(type) {
    case SET_ALERT_SUB:
      return [...state, payload];
    case REMOVE_ALERT_SUB:
      return state.filter(alert => alert.id !== payload);
    default:
      return state;
  }
}