import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import BidForm from '../components/BidForm';
import BidList from '../components/BidList';

const GigDetails = () => {
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);
    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGig = async () => {
            try {
                const res = await api.get(`/gigs/${id}`);
                setGig(res.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load gig details');
                setLoading(false);
            }
        };
        fetchGig();
    }, [id]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
    if (!gig) return <div className="text-center mt-10">Gig not found</div>;

    const isOwner = user?._id === gig.ownerId._id;

    return (
        <div className="container mx-auto p-6 max-w-4xl font-clay mt-8">
            <div className="clay-card p-10 bg-white mb-10 transform -rotate-1 relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-800 drop-shadow-sm">{gig.title}</h1>
                        <p className="text-gray-500 font-bold mt-2">
                            Posted by <span className="text-clay-blue">{gig.ownerId.name}</span> on {new Date(gig.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="block text-3xl font-extrabold text-clay-green drop-shadow-sm">${gig.budget}</span>
                        <span className={`inline-block px-4 py-1 text-sm font-bold rounded-full mt-2 uppercase shadow-sm ${gig.status === 'open' ? 'bg-green-100 text-green-800' :
                            gig.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                            {gig.status}
                        </span>
                    </div>
                </div>

                <h3 className="font-bold text-xl border-b-4 border-stone-200 pb-2 mb-4 text-gray-700">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed font-medium">{gig.description}</p>
            </div>

            {/* Actions Area */}
            {isOwner ? (
                <BidList gigId={gig._id} gigStatus={gig.status} />
            ) : (
                <>
                    {gig.status === 'open' ? (
                        user ? (
                            <BidForm gigId={gig._id} />
                        ) : (
                            <div className="text-center clay-card bg-stone-100 p-8">
                                <p className="text-xl font-bold text-gray-600">Please <a href="/login" className="text-clay-blue underline hover:text-blue-600">login</a> to place a bid.</p>
                            </div>
                        )
                    ) : (
                        <div className="text-center clay-card bg-stone-100 p-8">
                            <p className="text-xl font-bold text-gray-600">This gig is {gig.status}</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default GigDetails;
