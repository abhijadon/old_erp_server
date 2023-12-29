const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { Payment } = require('./Payment'); // Import the Invoice model

const applicationSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  lead_id: {
    type: String,
    trim: true,
  },

  full_name: {
    type: String,
    trim: true,
  },

  contact: {
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
    alternate_phone: {
      type: Number,
      trim: true,
    },
  },

  education: {
    course: {
      type: String,
      trim: true,
    },
    institute: {
      type: String,
      trim: true,
    },
    specialization: {
      type: String,
      trim: true,
    },
  },

  customfields: {
    institute_name: {
      type: String,
      trim: true,
    },
    university_name: {
      type: String,
      trim: true,
    },
    send_fee_receipt: {
      type: String,
      trim: true,
    },
    father_name: {
      type: String,
      trim: true,
    },
    mother_name: {
      type: String,
      trim: true,
    },
    session: {
      type: String,
      trim: true,
    },
    session_type: {
      type: String,
      trim: true,
    },
    enter_specialization: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
      trim: true,
      default: null,
    },
    remark: {
      type: String,
      default: null,
      trim: true,
    },

    gender: {
      type: String,
      trim: true,
    },

    installment_type: {
      type: String,
      trim: true,
    },

    payment_mode: {
      type: String,
      trim: true,
    },

    total_course_fee: {
      type: String,
      trim: true,
    },
    // Payment details that need to be saved in the Payment table
    total_paid_amount: {
      type: Number,
      default: 0,
    },
    paid_amount: {
      type: Number,
      default: 0,
    },
    total_paid_and_paid_amount: {
      type: Number,
      default: 0,
    },

    counselor_email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      trim: true,
    },
  },
  img: {
    data: Buffer,
    contentType: String,
  },

  created: {
    type: Date,
    default: Date.now,
  },
});

applicationSchema.post('findOneAndUpdate', async function (doc) {
  try {
    const applicationId = doc._id;

    // Calculate the sum of total_paid_amount and paid_amount
    const totalPaidAmount = parseFloat(doc.customfields.total_paid_amount) || 0;
    const paidAmount = parseFloat(doc.customfields.paid_amount) || 0;
    const totalPaidAndPaidAmount = totalPaidAmount + paidAmount;

    await Payment.findOneAndUpdate(
      { applicationId },
      {
        $set: {
          applicationId,
          total_course_fee: doc.customfields['total_course_fee'],
          total_paid_amount: doc.customfields['total_paid_amount'],
          paid_amount: doc.customfields['paid_amount'],
          university_name: doc.customfields['university_name'],
          institute_name: doc.customfields['institute_name'],
          counselor_email: doc.customfields['counselor_email'],
          email: doc.contact['email'],
          phone: doc.contact['phone'],
          student_name: doc.full_name,
          total_paid_and_paid_amount: totalPaidAndPaidAmount, // Add this line
          // ... other fields you want to update in the Payment record
        },
      },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error updating Payment record:', error);
  }
});
// for update according application to payment

// Pre-save hook for adding new data
applicationSchema.pre('save', async function (next) {
  try {
    const applicationId = this._id; // Get the ID of the Application
    // Check if the document is new or being updated
    if (!this.isNew) {
      // If the document is being updated, trigger the next middleware in the stack
      return next();
    }

    // Create a new Payment record based on the Application ID
    await Payment.create({
      applicationId,
      lead_id: this.lead_id,
      student_name: this.full_name,
      email: this.contact['email'],
      phone: this.contact['phone'],
      total_course_fee: this.customfields['total_course_fee'],
      total_paid_amount: this.customfields['total_paid_amount'],
      paid_amount: this.customfields['paid_amount'],
      university_name: this.customfields['university_name'],
      institute_name: this.customfields['institute_name'],
      counselor_email: this.customfields['counselor_email'],
      // ... other fields you want to set in the Payment record
    });

    // Trigger the next middleware in the stack
    return next();
  } catch (error) {
    console.error('Error creating Payment record:', error);
    return next(error);
  }
});

// Post-save hook for updating existing data
applicationSchema.post('save', async function (doc) {
  try {
    const applicationId = doc._id; // Get the ID of the Application

    // Update existing Payment record based on the Application ID
    await Payment.findOneAndUpdate(
      { applicationId },
      {
        $set: {
          applicationId,
          lead_id: doc.lead_id,
          student_name: doc.full_name,
          email: doc.contact['email'],
          phone: doc.contact['phone'],
          total_course_fee: doc.customfields['total_course_fee'],
          total_paid_amount: doc.customfields['total_paid_amount'],
          paid_amount: doc.customfields['paid_amount'],
          counselor_email: doc.customfields['counselor_email'],
          // ... other fields you want to update in the Payment record
        },
      },
      { upsert: true } // Create the Payment record if it doesn't exist
    );
  } catch (error) {
    console.error('Error updating Payment record:', error);
  }
});
const Applications = mongoose.model('Applications', applicationSchema);

module.exports = { Applications };
