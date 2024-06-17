const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
  mode_info: {
    type: String,
    trim: true,
    required: true,
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
   utm_link: {
    type: String,
    trim: true,
  },
   ebd: {
    type: String,
    trim: true,
  },
 brochure: [{ 
    name: { type: String },
    downloadURL: { type: String },
    previewURL: { type: String },
    university: { type: String },
    course: { type: String },
    electives: { type: String },
  }],
   sampleMarksheets: [{
    name: { type: String },
    downloadURL: { type: String },
    university: { type: String },
  }],
   sampleDegrees: [{
    name: { type: String },
    downloadURL: { type: String },
    university: { type: String },
  }],
},
{
  timestamps: true
},
);

const courseInfo = mongoose.model('courseInfo', infoSchema);

module.exports = { courseInfo };
