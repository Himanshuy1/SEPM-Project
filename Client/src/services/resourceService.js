import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const API_URL = `${API_BASE_URL}/resources`;

export const getAllResources = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const uploadResource = async (data, token) => {
    const isFormData = data instanceof FormData;
    const response = await axios.post(API_URL, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
        },
    });
    return response.data;
};
