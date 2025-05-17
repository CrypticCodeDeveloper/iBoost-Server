const mongoose = require('mongoose');

const platformSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
   services: {
        type: [String],
        required: true,
   },
   price: {
        type: Number,
        required: true,
   },
}, {timestamps: true})

module.exports = mongoose.model('Platform', platformSchema);