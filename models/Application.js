const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const { Payment } = require('./Payment');
const mongooseHistory = require('mongoose-history');


// History Entry Schema
const historyEntrySchema = new Schema({
  documentId: Schema.Types.ObjectId,
  changes: {
    type: Map,
    of: {
      oldValue: Schema.Types.Mixed,
      newValue: Schema.Types.Mixed,
      timestamp: { type: Date, default: Date.now },
      updatedBy: String, // Add user information
    },
  },
});

const HistoryEntry = mongoose.model('HistoryEntry', historyEntrySchema);

// Remark History Schema
const remarkHistorySchema = new Schema({
  applicationId: {
    type: Schema.Types.ObjectId,
    ref: 'Applications',
  },
  remark: {
    type: String,
    trim: true,
  },
  updatedBy: {
    type: String,
    trim: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedBy: {
    type: String,
    trim: true,
    default: null,
  },
  completedAt: {
    type: Date,
    default: null,
  },
});

const RemarkHistory = mongoose.model('RemarkHistory', remarkHistorySchema);

// Application Schema
const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
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

  
    history: {
    total_course_fee: [
      {
        value: String,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    total_paid_amount: [
      {
        value: Number,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    paid_amount: [
      {
        value: Number,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    installment_type: [
      {
        value: String,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },


  contact: {
  email: {
    type: String,
    trim: true,
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
      default: 'no',
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
    admission_type: {
      type: String,
      trim: true,
      default: 'Fresher',
    },
    enter_specialization: {
      type: String,
      trim: true,
    },
    dob: {
      type: String,
      trim: true,
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
      default: '1st installmenttype/New',
    },

    payment_mode: {
      type: String,
      trim: true,
    },
    payment_type: {
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
    upload_fee_receipt_screenshot: [
      {
        originalFilename: String,
        filename: String,
        // Other properties as needed
      },
    ],
    upload_student_document: [
      {
        originalFilename: String,
        filename: String,
        // Other properties as needed
      },
    ],
    status: {
      type: String,
      trim: true,
      default: 'New',
    },
    lms: {
      type: String,
      trim: true,
      default: 'N/A',
    },
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
          ((currentDate.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) /
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
});

applicationSchema.plugin(mongooseHistory, { customCollectionName: 'ApplicationHistory' });
 
applicationSchema.pre('save', async function (next) {
  try {
    const userId = this.userId;
    if (!this.isNew) {
      this.history.total_course_fee.push({
        value: this.customfields['total_course_fee'],
        userId,
      });
      this.history.total_paid_amount.push({
        value: this.customfields['total_paid_amount'],
        userId,
      });
      this.history.paid_amount.push({
        value: this.customfields['paid_amount'],
      });
      this.history.installment_type.push({
        value: this.customfields['installment_type'],
        userId,
      });
    }
    next();
  } catch (error) {
    console.error('Error updating history fields:', error);
    next(error);
  }
});





applicationSchema.pre('save', async function (next) {
  try {
    const documentId = this._id;
    const changes = {};
    if (!this.isNew) {
      const originalDocument = await this.constructor.findOne({ _id: this._id });

      Object.keys(this._doc).forEach((field) => {
        const originalValue = originalDocument[field];
        const currentValue = this._doc[field];

        if (originalValue !== currentValue) {
          changes[field] = {
            oldValue: originalValue,
            newValue: currentValue,
          };
        }
      });
    }

    if (Object.keys(changes).length > 0) {
      await HistoryEntry.create({
        documentId,
        changes,
      });
    }

    next();
  } catch (error) {
    console.error('Error saving history entry:', error);
    next(error);
  }
});





applicationSchema.post('findOneAndUpdate', async function (doc) {
  try {
    const applicationId = doc._id;
    const remark = doc.customfields.remark;
    const updatedBy = 'system';

    await RemarkHistory.create({
      applicationId,
      remark,
      updatedBy,
    });
  } catch (error) {
    console.error('Error saving remark history:', error);
  }
});

applicationSchema.post('findOneAndUpdate', async function (doc) {
  try {
    const applicationId = doc._id;

    await Payment.findOneAndUpdate(
      { applicationId },
      {
        $set: {
          applicationId,
          userId: doc.userId,
          payment_type: doc.customfields['payment_type'],
          total_course_fee: doc.customfields['total_course_fee'],
          total_paid_amount: doc.customfields['total_paid_amount'],
          paid_amount: doc.customfields['paid_amount'],
          university_name: doc.customfields['university_name'],
          institute_name: doc.customfields['institute_name'],
          counselor_email: doc.customfields['counselor_email'],
         session: doc.customfields['session'],
          payment_mode: doc.customfields['payment_mode'],
          status: doc.customfields['status'],
          email: doc.contact['email'],
          phone: doc.contact['phone'],
          student_name: doc.full_name,
          // ... other fields you want to update in the Payment record
        },
      },
      { upsert: true }
    );

    const userId = doc.userId;
    const changes = {
      paymentUpdatedBy: userId,
      paymentUpdatedAt: Date.now(),
    };

    await HistoryEntry.create({
      documentId: applicationId,
      changes,
    });
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
      userId: this.userId,
      lead_id: this.lead_id,
      student_name: this.full_name,
      email: this.contact['email'],
      phone: this.contact['phone'],
        session: this.customfields['session'],
      status: this.customfields['status'],
      payment_type: this.customfields['payment_type'],
      total_course_fee: this.customfields['total_course_fee'],
      total_paid_amount: this.customfields['total_paid_amount'],
      paid_amount: this.customfields['paid_amount'],
      payment_mode: this.customfields['payment_mode'],
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
          userId: doc.userId,
          lead_id: doc.lead_id,
          student_name: doc.full_name,
          email: doc.contact['email'],
          phone: doc.contact['phone'],
          payment_type: doc.customfields['payment_type'],
          session: doc.customfields['session'],
          total_course_fee: doc.customfields['total_course_fee'],
          total_paid_amount: doc.customfields['total_paid_amount'],
          payment_mode: doc.customfields['payment_mode'],
          paid_amount: doc.customfields['paid_amount'],
          counselor_email: doc.customfields['counselor_email'],
          status: doc.customfields['status'],
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

module.exports = { Applications, RemarkHistory, HistoryEntry };

