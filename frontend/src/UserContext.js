import React, { createContext, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        location: null,
        // Add other user properties here if needed
    });

    // Function to update the user's location
    const updateUserLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setUser(prevUser => ({
                    ...prevUser,
                    location: { latitude, longitude }
                }));
            },
            error => console.error('Error getting location', error),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    return (
        <UserContext.Provider value={{ user, setUser, updateUserLocation }}>
            {children}
        </UserContext.Provider>
    );
};
