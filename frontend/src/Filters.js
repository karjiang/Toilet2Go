import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, ScrollView } from 'react-native';
import { UserContext } from './UserContext';
import { getRestrooms } from './api';

const Filters = ({ navigation }) => {
    const { user } = useContext(UserContext);
    const [restrooms, setRestrooms] = useState([]);
    const [sortedRestrooms, setSortedRestrooms] = useState([]);
    const [sortOption, setSortOption] = useState('distance');
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
        fetchRestrooms();
    }, []);

    useEffect(() => {
        if (sortOption === 'distance') {
            sortByDistance();
        } else if (sortOption === 'rating') {
            sortByRating();
        }
    }, [sortOption, restrooms]);

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

    const handleDropdownSelect = (option) => {
        setSortOption(option);
        setDropdownVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => setDropdownVisible(true)}>
                <Text style={styles.buttonText}>Sort by: {sortOption === 'distance' ? 'Closest Distance' : 'Rating'}</Text>
            </TouchableOpacity>
            <Modal
                transparent={true}
                visible={isDropdownVisible}
                animationType="fade"
                onRequestClose={() => setDropdownVisible(false)}
            >
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setDropdownVisible(false)}>
                    <View style={styles.dropdownContainer}>
                        <TouchableOpacity style={styles.dropdownOption} onPress={() => handleDropdownSelect('distance')}>
                            <Text style={styles.optionText}>Closest Distance</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dropdownOption} onPress={() => handleDropdownSelect('rating')}>
                            <Text style={styles.optionText}>Rating</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
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
    dropdownButton: {
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dropdownContainer: {
        backgroundColor: 'white',
        borderRadius: 5,
        width: '80%',
        maxHeight: '50%',
    },
    dropdownOption: {
        padding: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    optionText: {
        fontSize: 18,
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
