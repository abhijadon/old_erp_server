const mongoose = require('mongoose');
// History log schema
const HistorySchema = new mongoose.Schema({
  dataId: { type: mongoose.Schema.Types.ObjectId, ref: 'Applications' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
});

const HistoryModel = mongoose.model('History', HistorySchema);

module.exports = { HistoryModel };
