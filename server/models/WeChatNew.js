const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WechatNewSchema = new Schema({
  wechatId: {
    type: String,
    required: true,
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
    default: Date.now(),
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
  intention: {
    type: Number,
  },
  followUp: {
    type: Boolean,
  },
  followUpDate: {
    type: String,
  },
  profileID: {
    type: String,
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
  updatedLog: [
    {
      UserDisplay: {
        type: String,
      },
      updateDate: {
        type: Date,
        default: Date.now(),
      },
      updateDateDisplay: {
        type: String,
      },
      logID: {
        type: String,
      },
      content: [
        {
          name: {
            type: String,
          },
          old: {
            type: String,
          },
          new: {
            type: String,
          },
        },
      ],
    },
  ],
});

module.exports = WechatNew = mongoose.model("WechatNew", WechatNewSchema);
