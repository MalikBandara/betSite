const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

// @route   GET /api/user/me
// @desc    Get current user info
// @access  Private
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// @route   POST /api/user/admin/search
// @desc    Search user by phone or ID (Admin only)
// @access  Private (Admin)
router.post('/admin/search', verifyToken, async (req, res) => {
    const { query } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user.isAdmin) return res.status(403).json({ msg: 'Access denied' });

        let targetUser;
        // Check if query is ObjectId
        if (query.match(/^[0-9a-fA-F]{24}$/)) {
            targetUser = await User.findById(query).select('-password');
        } else {
            targetUser = await User.findOne({ phone: query }).select('-password');
        }

        if (!targetUser) return res.status(404).json({ msg: 'User not found' });
        res.json(targetUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/user/admin/balance
// @desc    Update user balance (Admin only)
// @access  Private (Admin)
router.post('/admin/balance', verifyToken, async (req, res) => {
    const { userId, amount, type } = req.body; // type: 'add' or 'deduct'
    try {
        const admin = await User.findById(req.user.id);
        if (!admin.isAdmin) return res.status(403).json({ msg: 'Access denied' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (type === 'add') {
            user.balance += parseFloat(amount);
        } else if (type === 'deduct') {
            user.balance -= parseFloat(amount);
        }

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/user/admin/freeze
// @desc    Toggle freeze status (Admin only)
// @access  Private (Admin)
router.post('/admin/freeze', verifyToken, async (req, res) => {
    const { userId } = req.body;
    try {
        const admin = await User.findById(req.user.id);
        if (!admin.isAdmin) return res.status(403).json({ msg: 'Access denied' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.isFrozen = !user.isFrozen;
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
