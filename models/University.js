// models/University.js
const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  location: { type: String, required: true, trim: true  },
});

const University = mongoose.model('University', universitySchema);

module.exports = University;
