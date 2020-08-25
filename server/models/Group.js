const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  college: {
    type: Schema.Types.ObjectId,
    ref: 'College'
  },
  collegeDisplay: {
    type: String,
    required: true
  }
})

module.exports = Group = mongoose.model('Group', GroupSchema);