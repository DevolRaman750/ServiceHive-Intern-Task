import React, { useState } from 'react';
import api from '../api/axios';

const BidForm = ({ gigId, onBidSubmit }) => {
    const [message, setMessage] = useState('');
    const [price, setPrice] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/bids', { gigId, message, price });
            setLoading(false);
            setMessage('');
            setPrice('');
            if (onBidSubmit) onBidSubmit();
            alert('Bid placed successfully!');
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Failed to place bid');
        }
    };

    return (
        <div className="clay-card p-8 bg-stone-50 mt-8 transform rotate-1 border-4 border-white">
            <h3 className="text-2xl font-extrabold mb-6 text-clay-blue">Place a Bid</h3>
            {error && <div className="text-clay-red font-bold mb-4 bg-red-100 p-2 rounded">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-gray-600 font-bold mb-2 ml-1">Proposal Message</label>
                    <textarea
                        className="clay-input"
                        rows="3"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-600 font-bold mb-2 ml-1">Bid Price ($)</label>
                    <input
                        type="number"
                        className="clay-input"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="clay-btn bg-clay-green hover:bg-green-600 text-white font-bold text-lg"
                >
                    {loading ? 'Submitting...' : 'Submit Bid'}
                </button>
            </form>
        </div>
    );
};

export default BidForm;
