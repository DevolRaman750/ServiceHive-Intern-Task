const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid');
const Gig = require('../models/Gig');
const { protect } = require('../middleware/authMiddleware');
const mongoose = require('mongoose');


router.get('/my-bids', protect, async (req, res) => {
    try {
        const bids = await Bid.find({ freelancerId: req.user._id })
            .populate('gigId', 'title budget status')
            .sort({ createdAt: -1 });
        res.json(bids);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a bid
router.post('/', protect, async (req, res) => {
    try {
        const { gigId, message, price } = req.body;

        // Validation
        const gig = await Gig.findById(gigId);
        if (!gig) return res.status(404).json({ message: 'Gig not found' });
        if (gig.status !== 'open') return res.status(400).json({ message: 'Gig is not open' });
        if (gig.ownerId.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot bid on your own gig' });
        }

        const bid = await Bid.create({
            gigId,
            freelancerId: req.user._id,
            message,
            price
        });
        res.status(201).json(bid);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get bids for a gig 
router.get('/:gigId', protect, async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.gigId);
        if (!gig) return res.status(404).json({ message: 'Gig not found' });

        if (gig.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view bids' });
        }

        const bids = await Bid.find({ gigId: req.params.gigId })
            .populate('freelancerId', 'name email')
            .sort({ createdAt: -1 });
        res.json(bids);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Hire endpoint (Atomic via findOneAndUpdate - works without replica set)
router.patch('/:bidId/hire', protect, async (req, res) => {
    try {
        const bid = await Bid.findById(req.params.bidId);
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }

        // Check ownership first
        const gigCheck = await Gig.findById(bid.gigId);
        if (!gigCheck) {
            return res.status(404).json({ message: 'Gig not found' });
        }
        if (gigCheck.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // ATOMIC STEP: Update gig ONLY if status is 'open' (prevents race conditions)
        const gig = await Gig.findOneAndUpdate(
            { _id: bid.gigId, status: 'open' },
            {
                status: 'assigned',
                hiredFreelancerId: bid.freelancerId
            },
            { new: true }
        );

        if (!gig) {
            return res.status(400).json({ message: 'This gig has already been assigned or is not open.' });
        }

        // Gig updated successfully, now update bid statuses
        await Bid.findByIdAndUpdate(bid._id, { status: 'hired' });

        // Reject all other bids for this gig
        await Bid.updateMany(
            { gigId: gig._id, _id: { $ne: bid._id } },
            { status: 'rejected' }
        );

        // SOCKET.IO: Notify hired freelancer
        const io = req.app.get('io');
        const userSocketMap = req.app.get('userSocketMap');
        const freelancerSocketId = userSocketMap.get(bid.freelancerId.toString());
        
        if (freelancerSocketId) {
            io.to(freelancerSocketId).emit('hired', {
                gigTitle: gig.title,
                message: `You have been hired for "${gig.title}"!`
            });
            console.log(`Notification sent to freelancer ${bid.freelancerId}`);
        }

        res.json({ message: 'Freelancer hired successfully', gig });
    } catch (err) {
        console.error('Hire Error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
