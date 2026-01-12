import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Home = () => {
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchGigs();
    }, []);

    const fetchGigs = async (query = '') => {
        try {
            const res = await api.get(`/gigs?search=${query}`);
            setGigs(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchGigs(search);
    };

    if (loading) return <div className="text-center mt-10">Loading Gigs...</div>;

    return (
        <div className="container mx-auto p-6 font-clay mt-20">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <h1 className="text-5xl font-extrabold text-clay-blue drop-shadow-md tracking-wider">Available Gigs</h1>
                <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-3 bg-stone-100 p-2 rounded-2xl shadow-clay-card">
                    <input
                        type="text"
                        placeholder="Search gigs..."
                        className="clay-input w-full md:w-64 bg-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="clay-btn bg-clay-purple hover:bg-purple-500">Search</button>
                </form>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {gigs.map((gig, index) => (
                    <div
                        key={gig._id}
                        className={`clay-card p-6 flex flex-col justify-between h-full bg-white transform hover:scale-[1.02] hover:z-10 ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0`}
                    >
                        <div>
                            <h2 className="text-2xl font-bold mb-3 text-gray-800 leading-tight">{gig.title}</h2>
                            <p className="text-gray-600 mb-6 font-medium leading-relaxed">{gig.description.length > 100 ? gig.description.substring(0, 100) + '...' : gig.description}</p>
                        </div>
                        <div className="mt-auto">
                            <div className="flex justify-between items-center mb-4">
                                <span className="bg-clay-green text-white px-4 py-1 rounded-full text-lg font-bold shadow-sm">
                                    ${gig.budget}
                                </span>
                                <span className="text-sm font-bold text-gray-400">by {gig.ownerId?.name || 'Unknown'}</span>
                            </div>
                            <Link
                                to={`/gigs/${gig._id}`}
                                className="block w-full text-center clay-btn bg-stone-200 text-clay-blue hover:bg-clay-blue hover:text-white"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
                {gigs.length === 0 && (
                    <div className="col-span-full text-center py-20">
                        <p className="text-2xl text-gray-400 font-bold">No gigs found in the clay pit.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
