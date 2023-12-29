const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
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
  student_name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: Number,
    trim: true,
    unique: true,
  },
  counselor_email: {
    type: String,
    trim: true,
  },
  institute_name: {
    type: String,
    trim: true,
  },
  university_name: {
    type: String,
    trim: true,
  },
  total_course_fee: {
    type: Number,
    required: true,
    default: 0,
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
  week: {
    type: Number,
  },
  year: {
    type: Number,
  },
});

// Set week and year based on created date, and update the updated field on every save
paymentSchema.pre('save', function (next) {
  const currentDate = Date.now();
  this.updated = currentDate;

  const createdDate = this.created || currentDate;
  const date = new Date(createdDate);
  this.week = date.getWeek();
  this.year = date.getFullYear();
  next();
});

// Function to get week number
Date.prototype.getWeek = function () {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  var week1 = new Date(date.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  );
};

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = { Payment };
