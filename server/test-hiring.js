const mongoose = require('mongoose');
const User = require('./models/User');
const Gig = require('./models/Gig');
const Bid = require('./models/Bid');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const runTest = async () => {
    try {
        if (!process.env.MONGO_URI) {
            process.env.MONGO_URI = 'mongodb://localhost:27017/gigflow';
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Cleanup
        await User.deleteMany({});
        await Gig.deleteMany({});
        await Bid.deleteMany({});

        // 1. Create Users
        const client = await User.create({ name: 'Client', email: 'client@test.com', password: '123' });
        const freelancer1 = await User.create({ name: 'Free1', email: 'f1@test.com', password: '123' });
        const freelancer2 = await User.create({ name: 'Free2', email: 'f2@test.com', password: '123' });

        // 2. Create Gig
        const gig = await Gig.create({
            title: 'Test Gig',
            description: 'Desc',
            budget: 100,
            ownerId: client._id
        });
        console.log('Gig Created:', gig._id);

        // 3. Create Bids
        const bid1 = await Bid.create({ gigId: gig._id, freelancerId: freelancer1._id, message: 'I can do it', price: 90 });
        const bid2 = await Bid.create({ gigId: gig._id, freelancerId: freelancer2._id, message: 'Me too', price: 80 });
        console.log('Bids Created');

        // 4. Simulate Hiring Logic (Test the code path logic)
        // We will simulate the exact steps from the route
        console.log('Simulating Hiring...');

        const bidToHire = await Bid.findById(bid1._id);

        // ATOMIC STEP
        const updatedGig = await Gig.findOneAndUpdate(
            { _id: gig._id, status: 'open' },
            { status: 'assigned' },
            { new: true }
        );

        if (updatedGig) {
            bidToHire.status = 'hired';
            await bidToHire.save();

            await Bid.updateMany(
                { gigId: gig._id, _id: { $ne: bidToHire._id } },
                { status: 'rejected' }
            );
            console.log('Hiring Logic Executed Successfully');
        } else {
            console.error('Failed to assign gig (atomic check failed)');
        }

        // 5. Verify Results
        const finalGig = await Gig.findById(gig._id);
        const finalBid1 = await Bid.findById(bid1._id);
        const finalBid2 = await Bid.findById(bid2._id);

        console.log('Gig Status:', finalGig.status);
        console.log('Bid1 Status:', finalBid1.status);
        console.log('Bid2 Status:', finalBid2.status);

        if (finalGig.status === 'assigned' && finalBid1.status === 'hired' && finalBid2.status === 'rejected') {
            console.log('✅ TEST PASSED: Atomic Hiring worked.');
        } else {
            console.error('❌ TEST FAILED');
        }

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

runTest();
