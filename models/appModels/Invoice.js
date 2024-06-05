// invoiceModel.js

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const invoiceSchema = new mongoose.Schema(
  {
    removed: {
      type: Boolean,
      default: false,
    },
    taxTotal: {
      type: String,
      trim: true,
    },
    subTotal: {
      type: String,
      trim: true,
    },
    items: [
      {
        total: {
          type: Number,
          default: 0,
        },
      },
    ],

    // ... (other fields)
  },
  {
    static: false,
  }
);

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
