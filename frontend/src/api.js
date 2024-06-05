import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Make sure the URL is correct

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
