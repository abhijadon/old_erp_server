// models/payment.js

const mongoose = require('mongoose');
const PaymentHistory = require('./PaymentHIstory');

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
      unique: true,
    },
    phone: {
      type: Number,
      trim: true,
      unique: true,
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
    due_amount: {
      type: String,
      trim: true,
    },
    payment_mode: {
      type: String,
      trim: true,
    },
    followStatus: {
      type: String,
      trim: true,
    },
    followUpDate: {
      type: Date,
      default: null,
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
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  }, {
    timestamps: true,
  }
);

paymentSchema.post('findOneAndUpdate', async function (doc) {
  try {
    const paymentId = doc._id;
    const originalDoc = await this.model.findOne({ _id: paymentId }).lean();

    const updatedFields = {};
    for (const key of Object.keys(originalDoc)) {
      if (JSON.stringify(originalDoc[key]) !== JSON.stringify(doc[key])) {
        updatedFields[key] = {
          oldValue: originalDoc[key],
          newValue: doc[key]  
        };
      }
    }

    if (Object.keys(updatedFields).length > 0) {
      await PaymentHistory.create({
        paymentId,
        updatedFields,
        updatedBy: originalDoc.updatedBy,
      });
    }
  } catch (error) {
    console.error('Error creating payment history:', error);
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = { Payment };
