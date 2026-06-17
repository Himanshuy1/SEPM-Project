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
      }
    );
    return response.data.user;
  } catch (error) {
    throw error.response?.data?.message || "User sync failed";
  }
};
