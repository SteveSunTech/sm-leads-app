import { setAlert } from "../actions/subAlert";

const handleProError = (err, dispatch) => {
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

export default handleProError;
