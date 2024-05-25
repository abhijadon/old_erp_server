const mongoose = require('mongoose');
const Specialization = require('./Specialization');

const courseSchema = new mongoose.Schema({
  name: String,
  specializations: [Specialization.schema],
});

module.exports = mongoose.model('Course', courseSchema);
