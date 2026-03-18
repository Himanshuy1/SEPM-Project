import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user && user._id) {
            const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

            newSocket.on('connect', () => {
                console.log('Connected to socket server');
                newSocket.emit('join', user._id);
            });

            newSocket.on('userStatus', (users) => {
                setOnlineUsers(users);
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        }
    }, [user]);

    const value = {
        socket,
        onlineUsers
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
