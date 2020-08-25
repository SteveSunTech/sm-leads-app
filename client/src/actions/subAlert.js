import {v4 as uuidv4} from 'uuid';
import {
  SET_ALERT_SUB,
  REMOVE_ALERT_SUB
} from './types';

export const setAlert = (msg, alertType) => dispatch => {
  const id = uuidv4();

  dispatch({
    type: SET_ALERT_SUB,
    payload: { msg, alertType, id }
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT_SUB , payload: id }), 5000)
}