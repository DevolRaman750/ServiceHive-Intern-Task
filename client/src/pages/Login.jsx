import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        dispatch(loginStart());
        try {
            const res = await api.post('/auth/login', { email, password });
            dispatch(loginSuccess(res.data));
            navigate('/');
        } catch (err) {
            dispatch(loginFailure());
            setLocalError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] font-clay">
            <div className="w-full max-w-md clay-card p-10 transform rotate-1">
                <h2 className="text-3xl font-extrabold mb-8 text-center text-clay-red drop-shadow-sm">Login to GigFlow</h2>
                {localError && <div className="bg-red-100 text-clay-red font-bold p-3 mb-4 rounded-xl border-2 border-red-200">{localError}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-600 font-bold mb-2 ml-1">Email</label>
                        <input
                            type="email"
                            className="clay-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-8">
                        <label className="block text-gray-600 font-bold mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            className="clay-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full clay-btn bg-clay-blue hover:bg-blue-500 text-lg"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600 font-medium">
                    Don't have an account? <Link to="/register" className="text-clay-blue hover:text-blue-500 font-bold hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
