const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lmsSchema = new Schema({
    applicationId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Application'
    },
    status: {
        type: String,
        required: true
    },
    data: [
        {
            status: {
                type: String,
                required: true
            },
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User', // Reference to the User model
                required: true
            },
            updatedAt: {
                type: Date,
                required: true
            }
        }
    ],
    emailStatuses: [
        {
            status: {
                type: String,
                required: true
            },
            errorMessage: String,
            createdAt: {
                type: Date,
                required: true
            }
        }
    ],
    welcomeMailStatus: [
        {
            status: {
                type: String,
                required: true
            },
            errorMessage: String,
            createdAt: {
                type: Date,
                required: true
            }
        }
    ],
    whatsappStatuses: [
        {
            status: { type: String, required: true },
            errorMessage: { type: String, default: '' },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    whatsappEnrolledment: [
{
            status: { type: String, required: true },
            errorMessage: { type: String, default: '' },
            createdAt: { type: Date, default: Date.now }
        }
    ],
}, { timestamps: true });

const LMS = mongoose.model('LMS', lmsSchema);

module.exports = { LMS };
