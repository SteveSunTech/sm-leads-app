import {
  ADMIN_LOAD_ALL_COLLEGES,
  ADMIN_LOAD_ALL_USERS,
  ADMIN_LOAD_ALL_LEADS,
  ADMIN_LOAD_ANALYZE_USER_LEADS,
  ADMIN_COLLEGES_NEW,
  ADMIN_COLLEGES_DELETE,
  ADMIN_USER_UPDATE,
} from "../actions/types";

const initialState = {
  allColleges: [],
  allUsers: [],
  allLeads: [],
  userAnalyze: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ADMIN_LOAD_ALL_COLLEGES:
      state.allColleges = payload;
      return state;
    case ADMIN_LOAD_ALL_USERS:
      state.allUsers = payload;
      return state;
    case ADMIN_LOAD_ALL_LEADS:
      state.allLeads = payload;
      return state;
    case ADMIN_LOAD_ANALYZE_USER_LEADS:
      state.userAnalyze = payload;
      return state;
    case ADMIN_COLLEGES_NEW:
      state.allColleges = [payload, ...state.allColleges];
      return state;
    case ADMIN_USER_UPDATE:
      state.allUsers = state.allUsers.map((e) =>
        e._id === payload._id ? payload : e
      );
      return state;
    default:
      return state;
  }
}
