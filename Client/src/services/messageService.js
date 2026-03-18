import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getChatHistory = async (otherUserId, token) => {
    const response = await axios.get(`${API_URL}/messages/history/${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getConversations = async (token) => {
    const response = await axios.get(`${API_URL}/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
