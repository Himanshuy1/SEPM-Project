import axios from "axios";

const API_URL = "http://localhost:5000/api/answers";

export const getAnswersByDoubt = async (doubtId) => {
    const response = await axios.get(`${API_URL}/doubt/${doubtId}`);
    return response.data;
};

export const postAnswer = async (doubtId, content, token) => {
    const response = await axios.post(
        `${API_URL}/doubt/${doubtId}`,
        { content },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const upvoteAnswer = async (answerId, token) => {
    const response = await axios.post(
        `${API_URL}/${answerId}/upvote`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};
