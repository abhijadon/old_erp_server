const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
   userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
  type: String,
  action: String,
  full_name: String,
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
