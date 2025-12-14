const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    periodId: {
        type: String,
        required: true
    },
    type: {
        type: String, // 'color', 'number'
        required: true
    },
    timeFrame: {
        type: String, // '30s', '1Min', '3Min', '5Min'
        required: true
    },
    selection: {
        type: String, // 'green', 'red', 'violet', '0'-'9'
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'win', 'loss'],
        default: 'pending'
    },
    winAmount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Bet', betSchema);
