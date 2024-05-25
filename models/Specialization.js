const mongoose = require('mongoose');

const specializationSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model('Specialization', specializationSchema);
