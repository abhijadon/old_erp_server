const mongoose = require('mongoose');
const mongooseHistory = require('mongoose-history');
const paymentSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application' 
    },
     userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    removed: {
      type: Boolean,
      default: false,
    },
    lead_id: {
      type: String,
      default: 0,
    },
    student_name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: Number,
      trim: true,
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
      session: {
      type: String,
      trim: true,
    },
    payment_type: {
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
    payment_mode: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      trim: true,
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
      default: function () {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        currentDate.setDate(currentDate.getDate() + 3 - ((currentDate.getDay() + 6) % 7));
        const week1 = new Date(currentDate.getFullYear(), 0, 4);
        return (
          1 +
          Math.round(
            ((currentDate.getTime() - week1.getTime()) / 86400000 -
              3 +
              ((week1.getDay() + 6) % 7)) /
              7
          )
        );
      },
    },
    year: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
    date: {
      type: Date,
      default: Date.now,
      get: function (val) {
        // Format the date as 'MM/DD/YYYY'
        return val ? new Date(val).toLocaleDateString('en-US') : '';
      },
    },
    time: {
      type: Date,
      default: Date.now,
      get: function (val) {
        // Format the time as 'hh:mm A'
        return val
          ? new Date(val).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })
          : '';
      },
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.plugin(mongooseHistory, { customCollectionName: 'PaymentHistory' });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = { Payment };
