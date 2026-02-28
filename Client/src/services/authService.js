import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const syncUser = async (token) => {
  try {
    const response = await axios.post(
      `${API_URL}/sync`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.user;
  } catch (error) {
    throw error.response?.data?.message || "User sync failed";
  }
};
