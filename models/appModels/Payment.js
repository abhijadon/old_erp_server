const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const paymentSchema = new mongoose.Schema({
  applicationId: {
    // Add the applicationId field
    type: mongoose.Schema.Types.ObjectId, // Assuming applicationId is an ObjectId
    required: true,
  },
  removed: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  lead_id: {
    type: Number,
    default: 0,
  },
  institute_name: {
    type: String,
    trim: true,
  },
  university_name: {
    type: String,
    trim: true,
  },

  total_paid_amount: {
    type: Number,
    required: true,
  },
  paid_amount: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = { Payment };
