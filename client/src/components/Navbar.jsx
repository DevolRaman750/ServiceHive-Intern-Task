import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import api from '../api/axios';
import { logout } from '../store/authSlice';
import { useNotifications } from '../context/NotificationContext';

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { unreadCount } = useNotifications();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            dispatch(logout());
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 p-4 font-clay">
            <div className="container mx-auto px-6 py-3 bg-stone-100 rounded-3xl shadow-clay-card flex justify-between items-center border-4 border-white/50">
                <Link to="/" className="text-3xl font-extrabold text-clay-red drop-shadow-sm tracking-wide">GigFlow</Link>
                <div className="flex items-center space-x-6">
                    <Link to="/" className="text-gray-700 font-bold hover:text-clay-blue transition-colors">Find Gigs</Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/create-gig" className="text-gray-700 font-bold hover:text-clay-blue transition-colors">Post a Gig</Link>
                            <Link to="/my-bids" className="text-gray-700 font-bold hover:text-clay-blue transition-colors">My Bids</Link>
                            
                            {/* Notification Bell Icon*/}
                            <Link to="/notifications" className="relative group">
                                <img 
                                    src="/asset/images/icon/notification-bell-svgrepo-com.svg" 
                                    alt="Notifications" 
                                    className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity"
                                />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-clay-red text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </Link>

                            <span className="text-gray-500 font-bold border-l-2 border-gray-300 pl-4">Hi, {user?.name}</span>
                            <button onClick={handleLogout} className="clay-btn bg-clay-red hover:bg-red-500 text-sm">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-700 font-bold hover:text-clay-blue transition-colors">Login</Link>
                            <Link to="/register" className="clay-btn bg-clay-blue hover:bg-blue-500">Join</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
