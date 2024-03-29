const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const amUserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  dateDisplay: {
    type: String,
  },
  status: {
    type: Boolean,
    required: true,
  },
  area: {
    type: String,
  },
  // title: {
  //   type: String,
  //   // required: true
  // },
  college: [
    {
      collegeId: {
        type: Schema.Types.ObjectId,
        ref: "College",
      },
      collegeDisplay: {
        type: String,
      },
    },
  ],
  basic: [
    {
      basicId: {
        type: Schema.Types.ObjectId,
        ref: "basicUser",
      },
      basicDisplay: {
        type: String,
      },
    },
  ],
  wechat: [
    {
      wechatId: {
        type: Schema.Types.ObjectId,
        ref: "WechatNew",
      },
      wechatDisplay: {
        type: String,
      },
    },
  ],
  name: {
    type: String,
  },
  preference: {
    table: {
      paginationRows: {
        type: Number,
        default: 10,
      },
      heading: {
        profile: [
          {
            id: {
              type: String,
            },
            label: {
              type: String,
            },
          },
        ],
        lead: [
          {
            id: {
              type: String,
            },
            label: {
              type: String,
            },
          },
        ],
        basicUser: [
          {
            id: {
              type: String,
            },
            label: {
              type: String,
            },
          },
        ],
      },
    },
  },
  presidentUser: {
    type: Boolean,
    default: false,
  },
});

module.exports = basicUser = mongoose.model("amUser", amUserSchema);
