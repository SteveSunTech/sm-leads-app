import axios from "axios";
import { setAlert } from './subAlert'

import {
  WECHAT_NEW
} from './types';

// Lookup wechat from database
export const single = ( wechat ) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify({ wechat });

  try {
    const res = await axios.post('/api/basic/single', body, config)
    console.log(res);

  } catch (err) {
    console.log(err);
  }
}

// Upload wechat client to database
export const upload = ( wechat, status ) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify({ wechat, status });

  try {
    const res = await axios.post('/api/basic/new', body, config)
    const payload = res.data.wechatNew

    dispatch({
      type: WECHAT_NEW,
      payload
    })

    dispatch(
      setAlert(`“微信：${payload.wechatId}，状态：${payload.status}” 上传成功！`, 'success')
    )


  } catch (err) {
    console.log(err)
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    }
  }
}

// get all wechat lead account belong to current user
export const get = () => async dispatch => {

  try {
    const res = await axios.get('/api/basic/get')
    // console.log(res.data.wechats)
    return new Promise(resolve => {
      resolve(res.data.wechats)
    })

  } catch (err) {
    console.log(err)
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    }
  }
}