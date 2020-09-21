import axios from "axios";
import { setAlert } from "./subAlert";

// get single lead
export const getSingleLead = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/lead/${id}`);
    // console.log(res.data);
    return new Promise((resolve) => {
      resolve(res.data);
    });
  } catch (err) {
    console.log(err);
  }
};

// update single lead
export const updateSingleLead = (
  wechat,
  status,
  college,
  grade,
  country,
  keywords,
  note,
  leadID,
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
    college,
    grade,
    country,
    keywords,
    note,
    intention,
  });

  try {
    // console.log(body);
    // console.log(leadID);
    const res = await axios.post(`/api/lead/update/${leadID}`, body, config);
    const payload = res.data;

    dispatch(
      setAlert(
        `“微信：${payload.wechatId}，状态：${payload.status}” 更新成功！`,
        "success"
      )
    );
  } catch (err) {
    console.log(err);
  }
};

// update single lead
export const deleteSingleLead = (leadID) => async (dispatch) => {
  try {
    // console.log(body);
    // console.log(leadID);
    await axios.delete(`/api/lead/delete/${leadID}`);

    dispatch(setAlert(`删除成功！`, "success"));
    return "success!";
  } catch (err) {
    console.log(err);
  }
};
