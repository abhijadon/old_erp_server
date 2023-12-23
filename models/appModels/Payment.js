const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const paymentSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },

  date: {
    type: Date,
    default: Date.now,
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
