  const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;

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
        institute: {
          type: String,
          trim: true,
        },
        university_name: {
          type: String,
          trim: true,
        },
        sendfeereceipt: {
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
        sessionType: {
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

        installmentType: {
          type: String,
          trim: true,
        },

        paymentMode: {
          type: String,
          trim: true,
        },

        totalPaidAmount: {
          type: String,
          trim: true,
        },

        paidAmount: {
          type: String,
          trim: true,
        },

        duefeeAmount: {
          type: String,
          trim: true,
        },

        counselorEmail: {
          type: String,
          trim: true,
          lowercase: true,
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
    },
    {
      strict: false,
    }
  );

  // Middleware to handle dynamic validation based on university selection
  applicationSchema.pre('save', function (next) {
    if (this.university_name === 'SPU' && !this.full_name) {
      return next(new Error('Full name is required for SPU university.'));
    }
    next();
  });

  module.exports = mongoose.model('Applications', applicationSchema);
