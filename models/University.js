const mongoose = require('mongoose');
const Course = require('./Course');
const Field = require('./Field');

const universitySchema = new mongoose.Schema({
  name: String,
  courses: [Course.schema],
  fields: [Field.schema]
});

module.exports = mongoose.model('University', universitySchema);
