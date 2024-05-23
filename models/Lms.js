const mongoose = require('mongoose');
const { Schema } = mongoose;

const LMSSchema = new Schema({
    applicationId: { type: String, required: true },
    data: [
        {
            status: { type: String, required: true },
            userId: { type: String, required: true }, // Add user field
            updatedAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

const LMS = mongoose.model('LMS', LMSSchema);
module.exports = { LMS };
