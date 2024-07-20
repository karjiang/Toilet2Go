import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { UserContext } from './UserContext';
import { getRestrooms } from './api';

const Filters = ({ navigation }) => {
    const { user } = useContext(UserContext);
    const [restrooms, setRestrooms] = useState([]);
    const [sortedRestrooms, setSortedRestrooms] = useState([]);

    useEffect(() => {
        fetchRestrooms();
    }, []);

    const fetchRestrooms = async () => {
        try {
            const data = await getRestrooms();
            setRestrooms(data);
        } catch (error) {
            console.error('Error fetching restrooms:', error);
        }
    };

    const sortByDistance = () => {
        if (!user.location) {
            console.log('User location not available');
            return;
        }

        const { latitude: userLat, longitude: userLon } = user.location;
        const restroomsWithDistance = restrooms.map(restroom => {
            const distance = getDistanceFromLatLonInMiles(userLat, userLon, parseFloat(restroom.latitude), parseFloat(restroom.longitude));
            return { ...restroom, distance };
        });

        const sorted = restroomsWithDistance.sort((a, b) => a.distance - b.distance);
        setSortedRestrooms(sorted);
    };

    const sortByRating = () => {
        if (!user.location) {
            console.log('User location not available');
            return;
        }

        const { latitude: userLat, longitude: userLon } = user.location;
        const restroomsWithDistance = restrooms.map(restroom => {
            const distance = getDistanceFromLatLonInMiles(userLat, userLon, parseFloat(restroom.latitude), parseFloat(restroom.longitude));
            return { ...restroom, distance };
        });

        const sorted = restroomsWithDistance.sort((a, b) => {
            if (b.rating === a.rating) {
                return a.distance - b.distance;
            }
            return b.rating - a.rating;
        });

        setSortedRestrooms(sorted);
    };

    const getDistanceFromLatLonInMiles = (lat1, lon1, lat2, lon2) => {
        const R = 3958.8; // Radius of the earth in miles
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in miles
        return parseFloat(d.toFixed(1)); // Round to one decimal point
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity style={styles.button} onPress={sortByDistance}>
                <Text style={styles.buttonText}>Sort by Closest Distance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={sortByRating}>
                <Text style={styles.buttonText}>Sort by Rating</Text>
            </TouchableOpacity>
            <FlatList
                data={sortedRestrooms}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.restroomItem}>
                        <Text style={styles.restroomName}>{item.name}</Text>
                        <Text>{`Distance: ${item.distance} miles`}</Text>
                        <Text>{`Rating: ${item.rating}`}</Text>
                    </View>
                )}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    restroomItem: {
        padding: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    restroomName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    listContent: {
        paddingBottom: 20, // Add padding to the bottom of the list
    },
});

export default Filters;
