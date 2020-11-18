const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LeadsProfileSchema = new Schema({
  ProfileID: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
  },
  wechatId: {
    type: String,
  },
  name: {
    type: String,
  },
  note: {
    type: String,
  },
  createdDate: {
    type: Date,
    defaule: Date.now(),
  },
  createdDateDisplay: {
    type: String,
  },
  updateDate: {
    type: Date,
    default: Date.now(),
  },
  updateDateDisplay: {
    type: String,
  },
  college: {
    type: Schema.Types.ObjectId,
    ref: "College",
  },
  collegeDisplay: {
    type: String,
  },
  country: {
    type: String,
  },
  grade: {
    type: String,
  },
  createdUser: {
    type: String,
  },
  createdUserID: {
    type: Schema.Types.ObjectId,
  },
  updateDateUser: {
    type: String,
  },
  updateDateUserID: {
    type: Schema.Types.ObjectId,
  },
  participateUser: [
    {
      UserID: {
        type: Schema.Types.ObjectId,
      },
      UserDisplay: {
        type: String,
      },
    },
  ],
});

module.exports = LeadsProfile = mongoose.model(
  "LeadsProfile",
  LeadsProfileSchema
);
