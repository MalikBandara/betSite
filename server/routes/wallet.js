const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Transaction = require('../models/Transaction');
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

// @route   POST /api/wallet/deposit
// @desc    Request deposit
// @access  Private
router.post('/deposit', verifyToken, async (req, res) => {
    const { amount, proof } = req.body;
    try {
        const newTx = new Transaction({
            user: req.user.id,
            type: 'deposit',
            amount,
            proof
        });
        await newTx.save();
        res.json(newTx);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/wallet/withdraw
// @desc    Request withdrawal
// @access  Private
router.post('/withdraw', verifyToken, async (req, res) => {
    const { amount, bankDetails } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (user.balance < amount) return res.status(400).json({ msg: 'Insufficient balance' });
        if (user.isFrozen) return res.status(400).json({ msg: 'Account is frozen' });

        // Deduct balance immediately
        user.balance -= amount;
        await user.save();

        const newTx = new Transaction({
            user: req.user.id,
            type: 'withdraw',
            amount,
            proof: JSON.stringify(bankDetails) // Store bank details as proof/meta
        });
        await newTx.save();
        res.json(newTx);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/wallet/history
// @desc    Get transaction history
// @access  Private
router.get('/history', verifyToken, async (req, res) => {
    try {
        const history = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/wallet/admin/pending
// @desc    Get pending transactions (Admin only)
// @access  Private (Needs admin check)
router.get('/admin/pending', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.isAdmin) return res.status(403).json({ msg: 'Access denied' });

        const pending = await Transaction.find({ status: 'pending' }).populate('user', 'phone');
        res.json(pending);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/wallet/admin/approve
// @desc    Approve/Reject transaction
// @access  Private (Admin)
router.post('/admin/approve', verifyToken, async (req, res) => {
    const { transactionId, action } = req.body; // action: 'approve' or 'reject'
    try {
        const user = await User.findById(req.user.id);
        if (!user.isAdmin) return res.status(403).json({ msg: 'Access denied' });

        const tx = await Transaction.findById(transactionId);
        if (!tx) return res.status(404).json({ msg: 'Transaction not found' });
        if (tx.status !== 'pending') return res.status(400).json({ msg: 'Transaction already processed' });

        const txUser = await User.findById(tx.user);

        if (action === 'approve') {
            tx.status = 'approved';
            // If deposit, add balance
            if (tx.type === 'deposit') {
                txUser.balance += tx.amount;
                await txUser.save();
            }
            // If withdraw, money already deducted, just mark done
        } else {
            tx.status = 'rejected';
            // If withdraw rejected, refund money
            if (tx.type === 'withdraw') {
                txUser.balance += tx.amount;
                await txUser.save();
            }
        }

        await tx.save();
        res.json(tx);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
