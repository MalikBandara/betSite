const mongoose = require('mongoose');

const gameResultSchema = new mongoose.Schema({
    periodId: {
        type: String,
        required: true
        // Removed unique: true to allow same periodId across different timeFrames
    },
    timeFrame: {
        type: String, // '30s', '1Min', '3Min', '5Min'
        required: true
    },
    resultNumber: {
        type: Number,
        required: true
    },
    resultColor: {
        type: String, // 'green', 'red', 'violet' + 'red'... ?? Usually based on number
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('GameResult', gameResultSchema);
