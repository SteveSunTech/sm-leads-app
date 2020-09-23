import {
  AM_LOAD_ALL_COLLEGES,
  AM_LOAD_ALL_LEADS,
  AM_UPLOAD_SINGLE_LEAD,
  AM_UPDATE_SINGLE_LEAD,
  AM_DELETE_SINGLE_LEAD,
} from "../actions/types";

const initialState = {
  allLeads: [],
  allColleges: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case AM_LOAD_ALL_COLLEGES:
      state.allColleges = payload;
      return state;
    case AM_LOAD_ALL_LEADS:
      state.allLeads = payload;
      return state;
    case AM_UPLOAD_SINGLE_LEAD:
      state.allLeads = [...state.allLeads, payload];
      return state;
    case AM_UPDATE_SINGLE_LEAD:
      state.allLeads = state.allLeads.map((e) =>
        e._id === payload._id ? payload : e
      );
      return state;
    case AM_DELETE_SINGLE_LEAD:
      state.allLeads = state.allLeads.filter((e) => e._id !== payload._id);
      return state;
    default:
      return state;
  }
}
