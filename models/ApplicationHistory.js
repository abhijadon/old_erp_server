const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationHistorySchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Applications'
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

const ApplicationHistory = mongoose.model('ApplicationHistory', applicationHistorySchema);

module.exports = ApplicationHistory;
