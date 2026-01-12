import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNotifications } from './NotificationContext';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { addNotification } = useNotifications();

    useEffect(() => {
        // Connect to Socket.IO server
        const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
            withCredentials: true,
        });

        setSocket(newSocket);

        // Cleanup on unmount
        return () => {
            newSocket.close();
        };
    }, []);

    useEffect(() => {
        if (socket && isAuthenticated && user?._id) {
            // Register user with their ID after login
            socket.emit('register', user._id);
            console.log('Registered socket for user:', user._id);
        }
    }, [socket, isAuthenticated, user]);

    useEffect(() => {
        if (socket) {
            // Listen for hired notifications
            socket.on('hired', (data) => {
                // Add to notification center
                addNotification({
                    type: 'hired',
                    title: 'You got hired!',
                    message: data.message,
                    gigTitle: data.gigTitle
                });

                //  toast notification
                toast.success(data.message, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: {
                        background: '#10B981',
                        color: 'white',
                        fontWeight: 'bold',
                    }
                });
            });

            return () => {
                socket.off('hired');
            };
        }
    }, [socket, addNotification]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
