import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const API_URL = `${API_BASE_URL}/auth`;

export const syncUser = async (token) => {
  try {
    const response = await axios.post(
      `${API_URL}/sync`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000, // 10 second timeout
      }
    );
    return response.data.user;
  } catch (error) {
    const message = error.response?.data?.message || error.message || "User sync failed";
    throw new Error(message);
  }
};
