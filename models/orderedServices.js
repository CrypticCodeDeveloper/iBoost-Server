const mongoose = require('mongoose');

const orderedServiceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    platform : {
        type: String,
        required: true,
    },
    service: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    socialLink: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        required: true,
    }
}, {timestamps: true})

module.exports = mongoose.model('OrderedService', orderedServiceSchema);