const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const basicUserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  dateDisplay: {
    type: String
  },
  status: {
    type: Boolean,
    required: true
  },
  // title: {
  //   type: String,
  //   // required: true
  // },
  college: {
    type: Schema.Types.ObjectId,
    ref: 'College'
  },
  collegeDisplay: {
    type: String,
    required: true
  },
  area: {
    type: String
  },
  wechat: [
    {
      wechatId: {
        type: Schema.Types.ObjectId,
        ref: 'WechatNew'
      },
      wechatDisplay: {
        type: String
      }
    }
  ]
})

module.exports = basicUser = mongoose.model('basicUser', basicUserSchema);