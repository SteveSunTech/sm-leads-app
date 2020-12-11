import axios from "axios";
import { setAlert } from "./subAlert";
import handleProError from "../utils/HandleProError";

import {
  ADMIN_LOAD_ALL_COLLEGES,
  ADMIN_LOAD_ALL_USERS,
  ADMIN_LOAD_ALL_LEADS,
  ADMIN_LOAD_ANALYZE_USER_LEADS,
  ADMIN_COLLEGES_NEW,
  ADMIN_COLLEGES_DELETE,
  ADMIN_USER_UPDATE,
} from "./types";

// Add a new college
export const addNewCollege = (name, area) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ name, area });

  try {
    const res = await axios.post("/api/admin/college/new", body, config);
    const payload = res.data.newCollege;

    await dispatch({ type: ADMIN_COLLEGES_NEW, payload });

    await dispatch(setAlert(`学校：${name}， 添加成功！`, "success"));
  } catch (err) {
    console.log(err);
  }
};

export const addNewUser = (email, password, name, area) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password, name, area });

  try {
    const res = axios.post("/api/admin/user/new", body, config);
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

// Get all colleges
export const getAllColleges = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/admin/college/index");
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
      type: ADMIN_LOAD_ALL_COLLEGES,
      payload,
    });
  } catch (err) {
    handleProError(err, dispatch);
  }
};

// Get all users
export const getAllUsers = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/admin/user/index");
    let payload = res.data;

    await dispatch({
      type: ADMIN_LOAD_ALL_USERS,
      payload,
    });
  } catch (err) {
    handleProError(err, dispatch);
  }
};

// Get all leads
export const getAllLeads = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/admin/lead/index");
    let payload = res.data;

    await dispatch({
      type: ADMIN_LOAD_ALL_LEADS,
      payload,
    });
  } catch (err) {
    handleProError(err, dispatch);
  }
};

export const AssignCollegeToUser = (email, college) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, college });

  try {
    let payload;
    const res = axios.post("/api/admin/user/college/assign", body, config);
    res.then(async (val) => {
      payload = val.data.user;
      await dispatch({
        type: ADMIN_USER_UPDATE,
        payload,
      });
      await dispatch(
        setAlert(`学校：${college}， 成功分配至用户：${email}！`, "success")
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// User analyze
export const userAnalyze = (user, lead) => async (dispatch) => {
  let users = {};
  var processingUsers = new Promise((resolve, reject) => {
    user.forEach((value, index, array) => {
      users[value.email] = {
        id: value._id,
        name: value.name,
        totalLeads: 0,
        已购买: 0,
        无意向购买: 0,
        未购买: 0,
        国内: 0,
        美国: 0,
      };
      if (index === array.length - 1) resolve();
    });
  });

  processingUsers.then(() => {
    var processingLeads = new Promise((resolve, reject) => {
      // console.log("enter");
      lead.forEach((value, index, array) => {
        users[value.amUserDisplay].totalLeads =
          users[value.amUserDisplay].totalLeads + 1;
        users[value.amUserDisplay][value.status] =
          users[value.amUserDisplay][value.status] + 1;
        users[value.amUserDisplay][value.country] =
          users[value.amUserDisplay][value.country] + 1;
        // console.log(users);
        if (index === array.length - 1) resolve();
      });
    });

    processingLeads.then(async () => {
      console.log(users);
      let payload = [];
      Object.keys(users).forEach((value) => {
        payload = [...payload, users[value]];
      });
      // console.log(payload);
      // users = Object.keys(users).map((key))
      await dispatch({
        type: ADMIN_LOAD_ANALYZE_USER_LEADS,
        payload,
      });
    });
  });
};

export const getUserReport = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/admin/user/report");
    // console.log(res.data);
    await dispatch({
      type: ADMIN_LOAD_ANALYZE_USER_LEADS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};
