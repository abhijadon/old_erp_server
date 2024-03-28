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

// Check if the model has already been defined
const PaymentHistory = mongoose.models.PaymentHistory || mongoose.model('PaymentHistory', paymentHistorySchema);

module.exports = PaymentHistory;