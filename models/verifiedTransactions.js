const mongoose = require('mongoose');

const verifiedTransactionSchema = new mongoose.Schema({
    referenceString: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = mongoose.model('VerifiedTransaction', verifiedTransactionSchema);