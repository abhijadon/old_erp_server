const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: String,
  action: String,
  full_name: String,
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
