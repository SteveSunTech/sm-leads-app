import { SET_CURRENT_PROFILE } from "../actions/types";

const initialState = {
  currentProfile: {
    ProfileID: "",
    wechatId: "",
    createdDateDisplay: "",
    updateDateDisplay: "",
    collegeDisplay: "",
    country: "",
    grade: "",
    createdUser: "",
    participateUser: "",
  },
};

export default function (state = initialState, action) {
  let { type, payload } = action;
  switch (type) {
    case SET_CURRENT_PROFILE:
      // _.extend(state.currentProfile, payload);
      state.currentProfile = payload;
      return state;
    default:
      return state;
  }
}
