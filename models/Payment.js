// models/payment.js

const mongoose = require('mongoose');

// Define a schema for the payment history
const paymentHistorySchema = new mongoose.Schema({
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  updatedFields: {
    type: Object,
    required: true
  },
  updatedBy: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
const PaymentHistory = mongoose.model('PaymentHistory', paymentHistorySchema);


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
  },
);

// Middleware for tracking changes and creating history
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
        updatedBy: 'System' // You can specify who updated the record here
      });
    }
  } catch (error) {
    console.error('Error creating payment history:', error);
  }
});

// Middleware for tracking creation of new documents
paymentSchema.post('save', async function (doc) {
  try {
    await PaymentHistory.create({
      paymentId: doc._id,
      updatedFields: doc.toObject(),
      updatedBy: 'System' // You can specify who created the record here
    });
  } catch (error) {
    console.error('Error creating payment history:', error);
  }
});

// Middleware for tracking removal of documents
paymentSchema.post('findOneAndRemove', async function (doc) {
  try {
    await PaymentHistory.create({
      paymentId: doc._id,
      updatedFields: { removed: true },
      updatedBy: 'System' // You can specify who removed the record here
    });
  } catch (error) {
    console.error('Error creating payment history:', error);
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = { Payment, PaymentHistory };
