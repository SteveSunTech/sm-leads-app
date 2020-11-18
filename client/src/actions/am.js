import axios from "axios";
import { setAlert } from "./subAlert";
import handleProError from "../utils/HandleProError";

import {
  AM_BASIC_NEW,
  AM_LOAD_ALL_LEADS,
  AM_LOAD_ALL_COLLEGES,
  AM_UPLOAD_SINGLE_LEAD,
  AM_LOAD_ALL_PROFILES,
  AM_SAVING_PROFILELEAD,
  AM_UPLOAD_SINGLE_PROFILE,
  AM_DELETE_SINGLE_PROFILE,
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
    handleProError(err, dispatch);
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

    console.log(payload);

    // dispatch({
    //   type: AM_BASIC_NEW,
    //   payload,
    // });

    dispatch(setAlert(`校园大使：${payload.name}， 创建成功！`, "success"));
  } catch (err) {
    handleProError(err, dispatch);
  }
};

// get all basic users belong to current user
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
    handleProError(err, dispatch);
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
  intention,
  makeProfile,
  ProfileID
) => async (dispatch) => {
  // console.log(ProfileID);
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
    makeProfile,
    ProfileID,
  });

  try {
    const res = await axios.post("/api/am/lead/new", body, config);
    const payload = res.data;

    if (payload.justNewLead) {
      await dispatch({
        type: AM_UPLOAD_SINGLE_LEAD,
        payload: payload.wechatNew,
      });
      dispatch(
        setAlert(
          `“微信：${payload.wechatNew.wechatId}，状态：${payload.wechatNew.status}” 上传成功！`,
          "success"
        )
      );
    } else {
      // Update profile in redux
      await dispatch({
        type: AM_UPLOAD_SINGLE_PROFILE,
        payload: payload.profileNew,
      });
      dispatch(
        setAlert(
          `Profile：${payload.profileNew.ProfileID} 已成功建立！`,
          "success"
        )
      );
      // Update lead in redux
      await dispatch({
        type: AM_UPLOAD_SINGLE_LEAD,
        payload: payload.wechatNew,
      });
      dispatch(
        setAlert(
          `“微信：${payload.wechatNew.wechatId}，状态：${payload.wechatNew.status}” 上传成功！`,
          "success"
        )
      );
    }
  } catch (err) {
    handleProError(err, dispatch);
  }
};

// get all leads belong to current am
export const getAllLeads = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/am/lead/index");
    let payload = [];

    var processing = new Promise((resolve, reject) => {
      if (res.data.wechats) {
        res.data.wechats.forEach((value, index, array) => {
          payload.push(value);
          if (index === array.length - 1) resolve();
        });
      }
    });

    processing.then(() => {
      dispatch({
        type: AM_LOAD_ALL_LEADS,
        payload,
      });
    });
  } catch (err) {
    handleProError(err, dispatch);
  }
};

// get all Colleges belong to current am
export const getAllColleges = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/am/college/index/");
    let payload = res.data;

    const asyncMap = await Promise.all(
      payload.map((e) => {
        e.id = e._id;
        e.title = e.collegeDisplay;
        delete e._id;
        delete e.collegeId;
        delete e.collegeDisplay;
        return e;
      })
    );

    if (payload) {
      payload = asyncMap;
    }

    await dispatch({
      type: AM_LOAD_ALL_COLLEGES,
      payload,
    });
  } catch (err) {
    handleProError(err, dispatch);
  }
};

// get all profiles belong to current user
export const getAllProfiles = () => async (dispatch) => {
  try {
    const res = await axios.get("api/am/profiles/index");

    let payload = [];

    var processing = new Promise((resolve, reject) => {
      if (res.data.profiles) {
        res.data.profiles.forEach((value, index, array) => {
          payload.push(value);
          if (index === array.length - 1) resolve();
        });
      }
    });

    processing.then(() => {
      dispatch({
        type: AM_LOAD_ALL_PROFILES,
        payload,
      });
    });
  } catch (err) {
    handleProError(err, dispatch);
  }
};
