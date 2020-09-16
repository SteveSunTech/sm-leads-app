const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WechatNewSchema = new Schema({
  wechatId: {
    type: String,
    required: true,
    unique: true,
  },
  worker: {
    type: Boolean,
    default: false,
  },
  competitor: {
    type: Boolean,
    default: false,
  },
  ignore: {
    type: Boolean,
    default: false,
  },
  status: {
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
    required: true,
  },
  basicUser: {
    type: Schema.Types.ObjectId,
    ref: "basicUser",
  },
  basicUserDisplay: {
    type: String,
  },
  amUser: {
    type: Schema.Types.ObjectId,
    ref: "amUser",
  },
  amUserDisplay: {
    type: String,
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: "group",
  },
  groupDisplay: {
    type: String,
  },
  keywords: {
    type: String,
  },
  otherKeywords: {
    type: String,
  },
  country: {
    type: String,
  },
  grade: {
    type: String,
  },
  note: {
    type: String,
  },
});

module.exports = WechatNew = mongoose.model("WechatNew", WechatNewSchema);
