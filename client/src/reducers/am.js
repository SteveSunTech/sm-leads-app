import {
  AM_LOAD_ALL_COLLEGES,
  AM_LOAD_ALL_LEADS,
  AM_UPLOAD_SINGLE_LEAD,
  AM_UPDATE_SINGLE_LEAD,
  AM_DELETE_SINGLE_LEAD,
  AM_LOAD_ALL_PROFILES,
  AM_UPLOAD_SINGLE_PROFILE,
  AM_UPDATE_SINGLE_PROFILE,
  AM_DELETE_SINGLE_PROFILE,
  AM_SET_STATISTIC,
  AM_LOADING_FINISH,
} from "../actions/types";

const initialState = {
  allLeads: [],
  allColleges: [],
  allProfiles: [],
  statitc: {},
  loading: null,
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
      state.allLeads = [payload, ...state.allLeads];
      return state;
    case AM_UPDATE_SINGLE_LEAD:
      state.allLeads = state.allLeads.map((e) =>
        e._id === payload._id ? payload : e
      );
      return state;
    case AM_DELETE_SINGLE_LEAD:
      state.allLeads = state.allLeads.filter((e) => e._id !== payload._id);
      return state;
    case AM_LOAD_ALL_PROFILES:
      state.allProfiles = payload;
      return state;
    case AM_UPLOAD_SINGLE_PROFILE:
      state.allProfiles = [payload, ...state.allProfiles];
      return state;
    case AM_UPDATE_SINGLE_PROFILE:
      state.allProfiles = state.allProfiles.map((e) =>
        e.ProfileID === payload.ProfileID ? payload : e
      );
      return state;
    case AM_DELETE_SINGLE_PROFILE:
      state.allProfiles = state.allProfiles.filter((e) => e._id !== payload);
      return state;
    case AM_SET_STATISTIC:
      state.statitc = payload;
      return state;
    case AM_LOADING_FINISH:
      state.loading = true;
      return state;
    default:
      return state;
  }
}
