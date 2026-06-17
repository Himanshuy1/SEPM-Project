import axios from 'axios';
import { API_BASE_URL } from "./apiConfig";

const API_URL = API_BASE_URL;

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
