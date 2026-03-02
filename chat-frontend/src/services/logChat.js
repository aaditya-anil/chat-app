import api from './api';

export const logChat = async (chatObj) => {
    try {
        const response = await api.post(`/log`, chatObj);
        return response.data;
    } catch (error) {
        console.error('Error logging chat:', error);
        throw error;
    }
};
