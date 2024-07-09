import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Make sure the URL is correct

/************ USERS  ****************/ 
export const getUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users', error);
        throw error;
    }
};

export const addUser = async (user) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users`, user);
        return response.data;
    } catch (error) {
        console.error('Error adding user', error);
        throw error;
    }
};

export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/login`, { username, password });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            return { success: false, message: error.response.data.message };
        } else {
            console.error('Error logging in', error);
            return { success: false, message: 'An error occurred. Please try again.' };
        }
    }
};

export const registerUser = async (user) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/register`, user);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            return { success: false, message: error.response.data.message };
        } else {
            console.error('Error registering user', error);
            return { success: false, message: 'An error occurred. Please try again.' };
        }
    }
};

export const addUserReview = async (userId, review) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/${userId}/reviews`, review);
        return response.data;
    } catch (error) {
        console.error('Error adding user review', error);
        throw error;
    }
};

export const addUserFavorite = async (userId, restroomId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/${userId}/favorites`, { restroomId });
        return response.data;
    } catch (error) {
        console.error('Error adding user favorite', error);
        throw error;
    }
};

export const removeUserFavorite = async (userId, restroomId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/users/${userId}/favorites`, { data: { restroomId } });
        return response.data;
    } catch (error) {
        console.error('Error removing user favorite', error);
        throw error;
    }
};


export const updateUser = async (userId, userData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user', error);
        throw error;
    }
};

/************ RESTROOMS  ****************/ 
export const getRestrooms = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/restrooms`);
        return response.data;
    } catch (error) {
        console.error('Error fetching restrooms', error);
        throw error;
    }
};

export const addRestroom = async (restroom) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/restrooms`, restroom);
        return response.data;
    } catch (error) {
        console.error('Error adding restroom', error);
        throw error;
    }
};

export const addReview = async (id, review) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/restrooms/${id}/reviews`, review);
        return response.data;
    } catch (error) {
        console.error('Error adding review', error);
        throw error;
    }
};
