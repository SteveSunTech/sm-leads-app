import axios from "axios";
import { setAlert } from "./subAlert";

import {
  AM_BASIC_NEW,
  AM_LOAD_ALL_LEADS,
  AM_LOAD_ALL_COLLEGES,
  AM_UPLOAD_SINGLE_LEAD,
} from "./types";

// // Lookup wechat from database
// export const single = ( wechat ) => async dispatch => {
//   const config = {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   }

//   const body = JSON.stringify({ wechat });

//   try {
//     const res = await axios.post('/api/basic/single', body, config)
//     console.log(res);

//   } catch (err) {
//     console.log(err);
//   }
// }

// Upload wechat client to database
export const upload = (wechat, status, checkedItem) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ wechat, status, checkedItem });

  try {
    const res = await axios.post("/api/am/new", body, config);
    const payload = res.data.wechatNew;

    // dispatch({
    //   type: WECHAT_NEW,
    //   payload
    // })

    dispatch(
      setAlert(
        `“微信：${payload.wechatId}，状态：${payload.status}” 上传成功！`,
        "success"
      )
    );
  } catch (err) {
    handleError(err, dispatch);
  }
};

// Upload basic user to database
export const newBasic = (email, password, name, college) => async (
  dispatch
) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password, name, college });

  try {
    const res = await axios.post("/api/am/basic/new", body, config);
    const payload = res.data.user;

    // console.log(payload)

    dispatch({
      type: AM_BASIC_NEW,
      payload,
    });

    dispatch(setAlert(`校园大使：${payload.name}， 创建成功！`, "success"));
  } catch (err) {
    handleError(err, dispatch);
  }
};

// get all wechat lead account belong to current user
export const getAllBasic = () => async (dispatch) => {
  try {
    const res = await axios.get("api/am/basic/index");
    // console.log(res.data.wechats)
    if (res) {
      return new Promise((resolve) => {
        resolve(res.data.basics);
      });
    }
  } catch (err) {
    handleError(err, dispatch);
  }
};

// Upload wechat client to database
export const uploadLead = (
  wechat,
  status,
  checkedItem,
  college,
  grade,
  country,
  otherKeywords,
  note,
  intention
) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({
    wechat,
    status,
    checkedItem,
    college,
    grade,
    country,
    otherKeywords,
    note,
    intention,
  });

  try {
    const res = await axios.post("/api/am/lead/new", body, config);
    const payload = res.data.wechatNew;

    await dispatch({
      type: AM_UPLOAD_SINGLE_LEAD,
      payload,
    });

    dispatch(
      setAlert(
        `“微信：${payload.wechatId}，状态：${payload.status}” 上传成功！`,
        "success"
      )
    );
  } catch (err) {
    handleError(err, dispatch);
  }
};

const handleError = (err, dispatch) => {
  console.log(err);
  if (err.response) {
    if (err.response.data) {
      if (err.response.data.errors) {
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
        }
      }
    } else {
      dispatch(setAlert(err, "error"));
    }
  }
};

// get all leads belong to current am
export const getAllLeads = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/am/lead/index");
    let allLeads = res.data.wechats;
    let payload = [];

    var processing = new Promise((resolve, reject) => {
      allLeads.forEach((value, index, array) => {
        payload.push(value);
        if (index === array.length - 1) resolve();
      });
    });

    processing.then(() => {
      dispatch({
        type: AM_LOAD_ALL_LEADS,
        payload,
      });
    });
  } catch (err) {
    handleError(err, dispatch);
  }
};

// get all Colleges belong to current am
export const getAllColleges = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/am/college/index/");
    const allColleges = res.data;
    let payload = [];

    var processing = new Promise((resolve, reject) => {
      allColleges.forEach((value, index, array) => {
        payload.push(value);
        if (index === array.length - 1) resolve();
      });
    });

    processing.then(() => {
      dispatch({
        type: AM_LOAD_ALL_COLLEGES,
        payload,
      });
    });
  } catch (err) {
    handleError(err, dispatch);
  }
};
