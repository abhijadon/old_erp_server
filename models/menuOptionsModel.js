// menuOptionsModel.js
const mongoose = require('mongoose');

const menuOptionsSchema = new mongoose.Schema({
  role: String,
  options: [String],
});

module.exports = mongoose.model('MenuOptions', menuOptionsSchema);
