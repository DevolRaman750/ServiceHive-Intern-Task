import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const MyBids = () => {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const res = await api.get('/bids/my-bids');
                setBids(res.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load your bids.');
                setLoading(false);
            }
        };
        fetchBids();
    }, []);

    if (loading) return <div className="text-center mt-20 font-clay text-2xl font-bold text-clay-blue">Digging up your bids...</div>;

    return (
        <div className="container mx-auto p-6 font-clay mt-12 mb-20">
            <h1 className="text-4xl font-extrabold text-clay-blue drop-shadow-sm mb-10 text-center">My Bid History</h1>

            {error && <div className="max-w-md mx-auto clay-card bg-red-100 text-clay-red p-4 border-2 border-red-200 text-center font-bold mb-6">{error}</div>}

            {bids.length === 0 && !error ? (
                <div className="text-center clay-card p-10 bg-stone-100 max-w-lg mx-auto">
                    <p className="text-xl text-gray-500 font-bold">You haven't placed any bids yet.</p>
                    <p className="mt-4 text-gray-400">Time to start molding your future!</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {bids.map((bid, index) => (
                        <div
                            key={bid._id}
                            className={`clay-card p-6 bg-white flex flex-col justify-between transform hover:scale-[1.02] transition-transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0`}
                        >
                            <div className="mb-4">
                                <h2 className="text-2xl font-extrabold text-gray-800 mb-2 leading-tight">
                                    {bid.gigId?.title || <span className="text-red-400 italic">Gig Removed</span>}
                                </h2>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-bold text-gray-400">
                                        Bid Amount
                                    </span>
                                    <span className="text-xl font-extrabold text-clay-green">
                                        ${bid.price}
                                    </span>
                                </div>
                                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                                    <p className="text-gray-600 italic text-sm line-clamp-3">"{bid.message}"</p>
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t-2 border-stone-100 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</span>
                                <span className={`px-4 py-1 rounded-full text-sm font-extrabold uppercase tracking-wide shadow-sm
                                    ${bid.status === 'hired' ? 'bg-green-100 text-green-800 ring-2 ring-green-200' :
                                        bid.status === 'rejected' ? 'bg-red-100 text-red-800 ring-2 ring-red-200' :
                                            'bg-yellow-100 text-yellow-800 ring-2 ring-yellow-200'}`}>
                                    {bid.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBids;
