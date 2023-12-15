const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

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

    total_paid_amount: {
      type: String,
      trim: true,
    },

    paid_amount: {
      type: String,
      trim: true,
    },

    due_amount: {
      type: String,
      trim: true,
    },

    counselor_email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    upload_fee_receipt_screenshot: {
      type: String,
      trim: true,
    },
    upload_student_document: {
      type: String,
      trim: true,
    },
  },
  status: {
    type: String,
    default: 'new',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to handle dynamic validation based on university selection
applicationSchema.pre('save', function (next) {
  if (this.university_name === 'SPU' && !this.full_name) {
    return next(new Error('Full name is required for SPU university.'));
  }
  next();
});

module.exports = mongoose.model('Applications', applicationSchema);
