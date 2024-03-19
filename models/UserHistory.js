// models/UserHistory.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userHistorySchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  oldValue: {
    type: Schema.Types.Mixed,
    required: true,
  },
  newValue: {
    type: Schema.Types.Mixed,
    required: true,
  },
  updatedBy: {
    type: String, // You can change this to reference another user model if needed
  },
  updatedField: {
    type: String,
    required: true,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
});

const UserHistory = mongoose.model('UserHistory', userHistorySchema);

module.exports = UserHistory;
