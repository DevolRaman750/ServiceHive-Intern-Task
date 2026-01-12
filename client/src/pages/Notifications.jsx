import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Link } from 'react-router-dom';

const Notifications = () => {
    const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotifications();

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'hired':
                return '🎉';
            case 'bid':
                return '📝';
            case 'rejected':
                return '❌';
            default:
                return '🔔';
        }
    };

    return (
        <div className="container mx-auto p-6 font-clay mt-20 mb-20">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-extrabold text-clay-blue drop-shadow-sm">
                        Notifications
                    </h1>
                    <div className="flex gap-3">
                        {notifications.length > 0 && (
                            <>
                                <button
                                    onClick={markAllAsRead}
                                    className="clay-btn bg-clay-purple hover:bg-purple-500 text-sm"
                                >
                                    Mark All Read
                                </button>
                                <button
                                    onClick={clearNotifications}
                                    className="clay-btn bg-stone-300 hover:bg-stone-400 text-gray-700 text-sm"
                                >
                                    Clear All
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {notifications.length === 0 ? (
                    <div className="clay-card p-10 bg-stone-100 text-center">
                        <div className="text-6xl mb-4">🔔</div>
                        <p className="text-xl text-gray-500 font-bold">No notifications yet</p>
                        <p className="mt-2 text-gray-400">
                            When someone hires you for a gig, you'll see it here!
                        </p>
                        <Link
                            to="/"
                            className="inline-block mt-6 clay-btn bg-clay-blue hover:bg-blue-500"
                        >
                            Browse Gigs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => markAsRead(notification.id)}
                                className={`clay-card p-5 cursor-pointer transition-all hover:scale-[1.01] ${
                                    notification.read
                                        ? 'bg-stone-50 opacity-75'
                                        : 'bg-white border-l-4 border-clay-green'
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-3xl">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className={`font-bold text-lg ${
                                                notification.read ? 'text-gray-500' : 'text-gray-800'
                                            }`}>
                                                {notification.title}
                                            </h3>
                                            <span className="text-xs text-gray-400 font-bold">
                                                {formatTime(notification.timestamp)}
                                            </span>
                                        </div>
                                        <p className={`mt-1 ${
                                            notification.read ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                            {notification.message}
                                        </p>
                                        {!notification.read && (
                                            <span className="inline-block mt-2 px-2 py-1 bg-clay-green/20 text-clay-green text-xs font-bold rounded-full">
                                                NEW
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
