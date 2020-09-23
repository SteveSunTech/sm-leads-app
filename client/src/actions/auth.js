import axios from "axios";
import { setAlert } from "./alert";
import { setSubAlert } from "./subAlert";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "./types";
import setAuthToken from "../utils/setAuthToken";

// Load User
export const loadUser = () => async (dispatch) => {
  // if (localStorage.token) {
  //   // console.log(localStorage.token)
  //   setAuthToken(localStorage.token);
  // }

  try {
    await setAuthToken(localStorage.token);
    //axios.defaults.headers.common['x-auth-token'] = localStorage.token
    // console.log(axios.defaults.headers.common);

    const res = await axios.get("/api/auth"); // @yuchen 最开始程序死在这里了; 现在改好了

    // console.log(axios.defaults.headers.common);

    // const res = await axios.get('/api/auth', {headers: { Authoization}})

    // console.log(res);

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "warning")));
    }

    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const register = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/users", body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/auth/login", body, config);

    // console.log(res)

    await dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    await dispatch(setSubAlert("登陆成功！", "success"));

    dispatch(loadUser());
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout User
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};
