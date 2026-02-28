import axios from "axios";

const API_URL = "http://localhost:5000/api/resources";

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
