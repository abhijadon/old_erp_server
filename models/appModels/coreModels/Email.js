const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const emailSchema = new mongoose.Schema({
  emailKey: {
    type: String,
    lowercase: true,
    required: true,
  },
  emailName: {
    type: String,
    required:true,
  },
  emailVariables:{
    type:Array
  },
  emailBody: {
    type: String,
    required: true,
  },
  emailSubject: {
    type: String,
    required: true,
  },
  language:{
    type:String,
    default:"en"
  },
  removed: {
  type: Boolean,
  default: false,
  },
  enabled: {
  type: Boolean,
  default: true,
  },
  created: {
  type: Date,
  default: Date.now,
  },
  updated: {
  type: Date,
  default: Date.now,
  },
});

module.exports = mongoose.model('Email', emailSchema);
