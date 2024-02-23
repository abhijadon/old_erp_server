const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserActionSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  action: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('UserAction', UserActionSchema);
