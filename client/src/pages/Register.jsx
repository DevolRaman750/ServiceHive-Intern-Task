import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../api/axios';
import { loginSuccess } from '../store/authSlice';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/register', formData);
            setLoading(false);
            dispatch(loginSuccess(res.data));
            navigate('/');
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] font-clay py-10">
            <div className="w-full max-w-md clay-card p-10 transform -rotate-1">
                <h2 className="text-3xl font-extrabold mb-8 text-center text-clay-purple drop-shadow-sm">Join GigFlow</h2>
                {error && <div className="bg-red-100 text-clay-red font-bold p-3 mb-4 rounded-xl border-2 border-red-200">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-600 font-bold mb-2 ml-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="clay-input"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-600 font-bold mb-2 ml-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="clay-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-8">
                        <label className="block text-gray-600 font-bold mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="clay-input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full clay-btn bg-clay-green hover:bg-green-500 text-lg"
                    >
                        {loading ? 'Molding Account...' : 'Register'}
                    </button>
                    <p className="mt-6 text-center text-gray-600 font-medium">
                        Already have an account? <Link to="/login" className="text-clay-blue hover:text-blue-500 font-bold hover:underline">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
