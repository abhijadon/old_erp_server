const mongoose = require('mongoose');

const subcourseSchema = new mongoose.Schema({

  coursename: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    trim: true
  },
  subcourseCode: {
    type: String,
    required: true,
    trim: true
  },
  subcourse: {
    type: String,
    required: true,
    trim: true
  },

  shortname: {
    type: String,
    required: true,
    trim: true
  },
});

const Subcourse = mongoose.model('Subcourse', subcourseSchema);

module.exports = Subcourse;
