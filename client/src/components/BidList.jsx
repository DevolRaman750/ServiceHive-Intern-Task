import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const BidList = ({ gigId, gigStatus }) => {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchBids = async () => {
        try {
            const res = await api.get(`/bids/${gigId}`);
            setBids(res.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load bids');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBids();
    }, [gigId]);

    const handleHire = async (bidId) => {
        if (!window.confirm('Are you sure you want to hire this freelancer? This action cannot be undone.')) return;
        try {
            await api.patch(`/bids/${bidId}/hire`);
            alert('Freelancer hired because hiring is atomic!');
            window.location.reload(); // Simple reload to reflect all changes
        } catch (err) {
            alert(err.response?.data?.message || 'Hiring failed');
        }
    };

    if (loading) return <div>Loading bids...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="mt-12">
            <h3 className="text-2xl font-extrabold mb-6 text-gray-800 pl-2 border-l-4 border-clay-purple">Received Bids</h3>
            {bids.length === 0 ? <p className="text-gray-500 font-bold italic ml-2">No bids squashed onto here yet.</p> : (
                <div className="space-y-6">
                    {bids.map((bid, index) => (
                        <div key={bid._id} className={`clay-card p-6 border-none ${bid.status === 'hired' ? 'bg-green-50 ring-4 ring-green-200' : bid.status === 'rejected' ? 'bg-gray-100 opacity-60 grayscale' : 'bg-white'} ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-extrabold text-xl text-gray-800">{bid.freelancerId.name}</h4>
                                    <p className="text-sm text-gray-500 font-bold">{bid.freelancerId.email}</p>
                                    <p className="mt-3 text-gray-700 font-medium whitespace-pre-wrap bg-stone-100 p-3 rounded-xl">{bid.message}</p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-2xl font-extrabold text-clay-green drop-shadow-sm">${bid.price}</span>
                                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mt-2 capitalize shadow-sm ${bid.status === 'hired' ? 'bg-green-200 text-green-800' :
                                        bid.status === 'rejected' ? 'bg-red-200 text-red-800' :
                                            'bg-yellow-200 text-yellow-800'
                                        }`}>
                                        {bid.status}
                                    </span>
                                </div>
                            </div>
                            {gigStatus === 'open' && bid.status === 'pending' && (
                                <button
                                    onClick={() => handleHire(bid._id)}
                                    className="mt-6 w-full md:w-auto clay-btn bg-clay-purple hover:bg-purple-600 text-white text-sm"
                                >
                                    Hire Freelancer
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BidList;
