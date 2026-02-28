import axios from "axios";

const API_URL = "http://localhost:5000/api/doubts";

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  // Note: Better to get token from context/memory, but for now assuming we might store it or pass it.
  // Actually, let's pass token as argument to functions or use an interceptor.
  // For simplicity given the scope, I will rely on the component to pass the token or just use the token from the context if I can import it, but context is React.
  // Standard pattern: pass token to service functions.
};

export const getAllDoubts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createDoubt = async (doubtData, token) => {
  const response = await axios.post(API_URL, doubtData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getDoubtById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};
