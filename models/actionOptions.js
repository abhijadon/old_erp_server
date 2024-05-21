const mongoose = require('mongoose');

const actionoptionSchema = new mongoose.Schema({
  role: {
    type: String,
    trim: true,
  },
  options: {
    type: Array,
    trim: true,
  },
});
const actionoption = mongoose.model('actionoption', actionoptionSchema);

module.exports = { actionoption };
