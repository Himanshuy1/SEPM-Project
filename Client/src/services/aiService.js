import axios from 'axios';
import { API_BASE_URL } from "./apiConfig";

const API_URL = `${API_BASE_URL}/ai`;

const summarizeText = async (text, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    };

    const response = await axios.post(`${API_URL}/summarize`, { text }, config);
    return response.data;
};

const chatWithAI = async (messages, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    };

    const response = await axios.post(`${API_URL}/chat`, { messages }, config);
    return response.data;
};

const summarizeFile = async (file, token) => {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        },
    };

    const response = await axios.post(`${API_URL}/summarize-file`, formData, config);
    return response.data;
};

const aiService = {
    summarizeText,
    summarizeFile,
    chatWithAI,
};

export default aiService;
