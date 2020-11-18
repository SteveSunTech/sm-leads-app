import axios from "axios";
import { setAlert } from "./subAlert";
import {
  AM_DELETE_SINGLE_PROFILE,
  AM_DELETE_SINGLE_LEAD,
  SET_CURRENT_PROFILE,
  AM_UPDATE_SINGLE_PROFILE,
  AM_UPDATE_SINGLE_LEAD,
} from "./types";
import handleProError from "../utils/HandleProError";

// delete single profile
export const deleteSingleProfile = (profileID) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/leadprofile/delete/${profileID}`);
    const payload = res.data;

    await dispatch({
      type: AM_DELETE_SINGLE_PROFILE,
      payload: payload.profile,
    });

    payload.leads.forEach(async (item) => {
      await dispatch({
        type: AM_DELETE_SINGLE_LEAD,
        payload: {
          _id: item._id,
        },
      });
    });

    await dispatch(
      setAlert(
        `Profile: ${payload.profile} 及所有相关Leads删除成功！`,
        "success"
      )
    );

    return "success!";
  } catch (error) {
    handleProError(error, dispatch);
  }
};

// set current profile
export const setCurrentProfile = (payload) => async (dispatch) => {
  await dispatch({
    type: SET_CURRENT_PROFILE,
    payload,
  });
};

// update single profile
export const updateSingleProfile = (payload) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      payload,
    });
    const updatedProfile = await axios.post(
      "/api/leadprofile/update",
      body,
      config
    );
    await dispatch({
      type: AM_UPDATE_SINGLE_PROFILE,
      payload: updatedProfile.data,
    });

    await dispatch(setAlert(`Profile同步更新成功！`, "success"));
  } catch (err) {
    handleProError(err, dispatch);
  }
};

// add user to one profile
export const addUserToProfile = (profileID) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/leadprofile/adduser/${profileID}`);
    await dispatch({
      type: AM_UPDATE_SINGLE_PROFILE,
      payload: res.data.profile,
    });
    res.data.leads.forEach(async (item) => {
      await dispatch({
        type: AM_UPDATE_SINGLE_LEAD,
        payload: item,
      });
    });
    await dispatch({
      type: SET_CURRENT_PROFILE,
      payload: res.data.profile,
    });
    await dispatch(
      setAlert(`成功参与到此 Profile 及相关 Leads 中！`, "success")
    );
  } catch (err) {
    handleProError(err, dispatch);
  }
};
