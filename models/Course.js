const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  courseCode: {
    type: String,
    required: true,
    trim: true
  },
  courseDuration: {
    type: String,
    required: true,
    trim: true
  },

  courseType: {
    type: String,
    required: true,
    trim: true
  },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
