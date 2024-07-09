import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { UserContext } from './UserContext';
import { getRestrooms } from './api';

const FavoritesPage = () => {
    const { user } = useContext(UserContext);
    const [favoriteRestrooms, setFavoriteRestrooms] = useState([]);

    useEffect(() => {
        fetchFavoriteRestrooms();
    }, []);

    const fetchFavoriteRestrooms = async () => {
        try {
            const restrooms = await getRestrooms();
            const favoriteRestrooms = restrooms.filter(restroom => user.favoriteRestrooms.includes(restroom.id));
            setFavoriteRestrooms(favoriteRestrooms);
        } catch (error) {
            console.error('Error fetching favorite restrooms:', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.restroomContainer}>
            <Text style={styles.restroomName}>{item.name}</Text>
            <Text style={styles.restroomDetails}>Rating: {item.rating.toFixed(1)}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Favorite Restrooms</Text>
            <FlatList
                data={favoriteRestrooms}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.emptyText}>No favorite restrooms found.</Text>}
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
    restroomContainer: {
        padding: 16,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    restroomName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    restroomDetails: {
        fontSize: 16,
        color: '#666',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default FavoritesPage;
