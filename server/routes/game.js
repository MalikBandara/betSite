const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const GameResult = require('../models/GameResult');
const Bet = require('../models/Bet');
const User = require('../models/User');

// Define Middleware inline for now or move to separate file
const verifyToken = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

const jwt = require('jsonwebtoken');


// @route   GET /api/game/history
// @desc    Get game history
// @access  Public
router.get('/history', async (req, res) => {
    try {
        const { timeFrame } = req.query;
        let query = {};
        if (timeFrame) {
            query.timeFrame = timeFrame;
        }
        
        const history = await GameResult.find(query).sort({ createdAt: -1 }).limit(20);
        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/game/bet
// @desc    Place a bet
// @access  Private
router.post('/bet', verifyToken, async (req, res) => {
    const { periodId, type, selection, amount, timeFrame } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (user.balance < amount) {
            return res.status(400).json({ msg: 'Insufficient balance' });
        }

        // Deduct balance
        user.balance -= amount;
        await user.save();

        const newBet = new Bet({
            user: req.user.id,
            periodId,
            type,
            timeFrame: timeFrame || '3Min', // Default to 3Min if missing
            selection,
            amount,
            status: 'pending'
        });

        const bet = await newBet.save();
        res.json(bet);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/game/my-bets
// @desc    Get user bets
// @access  Private
router.get('/my-bets', verifyToken, async (req, res) => {
    try {
        const bets = await Bet.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(50);
        res.json(bets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
