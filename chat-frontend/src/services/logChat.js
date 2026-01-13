import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/chat';

export const logChat = async (chatObj) => {
    try {
        const response = await axios.post(`${BASE_URL}/log`, chatObj);
        return response.data;
    } catch (error) {
        console.error('Error logging chat:', error);
        throw error;
    }
};
