// Schema adjustment: Remove unique constraint from 'Mode' field
const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
  mode_info: {
    type: String,
    trim: true,
    required: true, // Ensure mode_info is provided
  },
  university: {
    type: String,
    trim: true,
  },
  course: {
    type: String,
    trim: true,
  },
  electives: {
    type: String,
    trim: true,
  },
  fee: {
    type: String,
    trim: true,
  },
  reg_fee: {
    type: String,
    trim: true,
  },
  examinationFee: {
    type: String,
    trim: true,
  },
  advantages: {
    type: String,
    trim: true,
  },
  eligibility: {
    type: String,
    trim: true,
  },
  website_url: {
    type: String,
    trim: true,
  },
   ebd: {
    type: String,
    trim: true,
  },
});

const courseInfo = mongoose.model('courseInfo', infoSchema);

module.exports = { courseInfo };
