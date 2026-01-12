const express = require('express');
const router = express.Router();
const Gig = require('../models/Gig');
const { protect } = require('../middleware/authMiddleware');

// Get all open gigs (with search)
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = { status: 'open' };
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        const gigs = await Gig.find(query).populate('ownerId', 'name email').sort({ createdAt: -1 });
        res.json(gigs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single gig
router.get('/:id', async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');
        if (!gig) return res.status(404).json({ message: 'Gig not found' });
        res.json(gig);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new gig
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, budget } = req.body;
        const gig = await Gig.create({
            title,
            description,
            budget,
            ownerId: req.user._id
        });
        res.status(201).json(gig);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
