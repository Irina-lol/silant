import axios from 'axios';

const getCsrfTokenFromCookie = () => {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
    return cookieValue || '';
};

const API_URL = 'http://localhost:8000/api/auth/';

export const login = async (username, password) => {
    const response = await axios.post(
        `${API_URL}login/`,
        { username, password },
        {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfTokenFromCookie(),
            },
            withCredentials: true,
        }
    );
    return {
        user: response.data.user,
        token: response.data.token
    };
};

export const getCurrentUser = async (token) => {
    const response = await axios.get(`${API_URL}user/`, {
        headers: { 'Authorization': `Token ${token}` }
    });
    return response.data;
};

export const logout = async (token) => {
    await axios.post(`${API_URL}logout/`, null, {
        headers: { 'Authorization': `Token ${token}` }
    });
};
