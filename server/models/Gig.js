const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    status: {
        type: String,
        enum: ['open', 'assigned', 'completed'],
        default: 'open'
    },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hiredFreelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Gig', gigSchema);
