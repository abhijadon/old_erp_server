const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userRecordlogs = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  login: {
    type: Date,
    required: true,
  },
  logout: {
    type: Date,
    default: null, // Starts as null; updates when user logs out
  },
  ip: {
    type: String,
    required: true,
  },
  device: {
    type: String,
    trim: true,
  },
  browser: {
    type: String,
    trim: true,
  },
  os: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true, // Adds `createdAt` and `updatedAt` fields
});

const UserLog = mongoose.model('UserLog', userRecordlogs);

module.exports = UserLog; // Ensure model is exported
