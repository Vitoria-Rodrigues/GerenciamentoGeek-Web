import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const authLogin = async (identifier, password) => {
    try {
        const response = await api.post('/auth/login', { identifier, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Erro de conexão');
    }
};

export const authVerify = async () => {
    try {
        const response = await api.get('/auth/verify');
        return response.data;
    } catch (error) {
        return null;
    }
};

export const authLogout = async () => {
    try {
        await api.post('/auth/logout');
    } catch (error) {
        console.error(error);
    }
};