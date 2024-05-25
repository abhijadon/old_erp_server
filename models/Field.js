const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  label: String,
  name: String,
  type: String,
});

module.exports = mongoose.model('Field', fieldSchema);
