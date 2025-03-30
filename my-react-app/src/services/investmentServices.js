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
        const response = await axios.post(`${apiUrl}/api/investments`, {investmentCategory}, { 
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

export const deleteInvestment = async (investmentId) => {
    try {
        const response = await axios.delete(`${apiUrl}/api/investments/${investmentId}`, { 
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting investment ${investmentId}:`, error);
        throw error;
    }
}

export const addSubInvestment = async (investmentId, name, value) => {
    try {
        // Match the actual route format in your backend
        const response = await axios.post(
            `${apiUrl}/api/investments/subInvestment/${investmentId}`, 
            { name, value }, 
            { 
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    'Content-Type': 'application/json'
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(`Error adding sub-investment to investment ${investmentId}:`, error);
        throw error;
    }
}