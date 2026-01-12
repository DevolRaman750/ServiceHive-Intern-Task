import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CreateGig = () => {
    const [formData, setFormData] = useState({ title: '', description: '', budget: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/gigs', formData);
            setLoading(false);
            navigate('/');
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Failed to create gig');
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-2 font-clay">
            <div className="clay-card p-10 bg-white transform rotate-1">
                <h2 className="text-3xl font-extrabold mb-8 text-clay-blue text-center drop-shadow-sm">Post a New Gig</h2>
                {error && <div className="bg-red-100 text-clay-red font-bold p-3 mb-4 rounded-xl border-2 border-red-200">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2 ml-1">Gig Title</label>
                        <input
                            type="text"
                            name="title"
                            className="clay-input"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2 ml-1">Description</label>
                        <textarea
                            name="description"
                            rows="5"
                            className="clay-input"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <div className="mb-8">
                        <label className="block text-gray-700 font-bold mb-2 ml-1">Budget ($)</label>
                        <input
                            type="number"
                            name="budget"
                            className="clay-input"
                            value={formData.budget}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full clay-btn bg-clay-green hover:bg-green-600 text-lg"
                    >
                        {loading ? 'Posting...' : 'Post Gig'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateGig;
