const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Cookie options for production (cross-site) and development
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
};

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, cookieOptions);

        res.status(201).json({ _id: user._id, name: user.name, email: user.email });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, cookieOptions);

        res.json({ _id: user._id, name: user.name, email: user.email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.cookie('token', '', { ...cookieOptions, expires: new Date(0) });
    res.json({ message: 'Logged out' });
});

module.exports = router;
