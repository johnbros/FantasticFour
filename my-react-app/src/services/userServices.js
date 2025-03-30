import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const getId = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/users/me`, { 
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    // Handle errors (e.g., check error.response.status for 401, 403, 404)
    throw error;
  }
};

export const fetchUser = async (userId) => {
  try {
        const response = await axios.get(`${apiUrl}/api/users/${userId}`, { 
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
        throw error;
    }
}

export const fetchUserFinacials = async (financialId) => {
    try {
            const response = await axios.get(`${apiUrl}/api/users/${financialId}/finacials`, { 
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching user ${financialId} finacials:`, error);
            throw error;
        }
    }