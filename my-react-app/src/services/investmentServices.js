import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchInvestment = async (investmentId) => {
    try {
        const response = await axios.get(`${apiUrl}/api/investments/${investmentId}`, { 
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error(`Error fetching investment ${investmentId}:`, error);
        throw error;
    }
}

export const createInvestment = async (investmentCategory) => {
    try {
        const response = await axios.post(`${apiUrl}/api/investments`, investmentCategory, { 
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating investment:", error);
        throw error;
    }
}
