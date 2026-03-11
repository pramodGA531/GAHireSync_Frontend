import axios from "axios";

const getExternalApiUrl = () =>
    import.meta.env.VITE_EXTERNAL_API_URL ||
    "https://backend.gagrid.in/external/tasks/";

// Note: Ensure VITE_EXTERNAL_API_KEY is configured in your environments
const getApiKey = () => import.meta.env.VITE_EXTERNAL_API_KEY;

export const ticketService = {
    createTicket: async (formData) => {
        try {
            const response = await axios.post(getExternalApiUrl(), formData, {
                headers: {
                    "X-Api-Key": getApiKey(),
                    // axios automatically sets boundary for multipart/form-data when passing FormData
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating ticket:", error);
            throw error;
        }
    },

    getTickets: async (empId = null) => {
        try {
            const url = empId
                ? `${getExternalApiUrl()}?emp_id=${empId}`
                : getExternalApiUrl();
            const response = await axios.get(url, {
                headers: {
                    "X-Api-Key": getApiKey(),
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching tickets:", error);
            throw error;
        }
    },
};
