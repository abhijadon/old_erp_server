// models/PaymentHistory.js

const mongoose = require('mongoose');

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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const PaymentHistory = mongoose.model('PaymentHistory', paymentHistorySchema);

module.exports = PaymentHistory;
