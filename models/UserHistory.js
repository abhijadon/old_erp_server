// PaymentHistory.js
const mongoose = require('mongoose');

const userHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedFields: {
    type: Object,
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const UserHistory = mongoose.model('UserHistory', userHistorySchema);

module.exports = UserHistory;