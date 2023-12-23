const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { Payment } = require('./Payment'); // Import the Invoice model

const applicationSchema = new mongoose.Schema(
  {
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
  },
  // Options object should be added here
  { strict: false }
);

// Middleware to create or update a Payment record when an Application is updated
applicationSchema.post('findOneAndUpdate', async function (result) {
  try {
    const doc = await this.model.findOne(this.getQuery());
    if (doc) {
      // Update existing Payment record or create a new one
      await Payment.findOneAndUpdate(
        {
          /* Define your condition to find the Payment record */
        },
        {
          total_paid_amount: doc.customfields.total_paid_amount,
          paid_amount: doc.customfields.paid_amount,
          // ... other fields you want to update in the Payment record
        },
        { upsert: true } // Create the Payment record if it doesn't exist
      );
    }
  } catch (error) {
    console.error('Error updating Payment record:', error);
  }
});

// Define your Applications model
const Applications = mongoose.model('Applications', applicationSchema);

module.exports = { Applications };
