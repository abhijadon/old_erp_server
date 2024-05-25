const mongoose = require('mongoose');
const University = require('./University');

const instituteSchema = new mongoose.Schema({
  name: String,
  universities: [University.schema],
});

module.exports = mongoose.model('Institute', instituteSchema);
