// models/Institute.js
const mongoose = require('mongoose');

const instituteSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  location: { type: String, required: true, trim: true },
});

const Institute = mongoose.model('Institute', instituteSchema);

module.exports = Institute;
