import axios from "axios";

export const addNewCollege = (name, area) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ name, area });

  try {
    const res = axios.post("/api/admin/college/new", body, config);
    console.log(res);
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

export const getAllCollege = () => async (dispatch) => {
  try {
    const res = axios.get("/api/admin/college/index");
    return new Promise((resolve) => {
      resolve(res);
    });
  } catch (err) {
    console.log(err);
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
    const res = axios.post("/api/admin/user/college/assign", body, config);
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};
