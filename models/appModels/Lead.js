const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const applicationSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  studentname: {
    type: String,
    trim: true,
    required: true,
  },

  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Applications', applicationSchema);
