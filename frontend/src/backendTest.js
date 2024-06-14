import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { getRestrooms, addRestroom } from './api';

const BackendTest = () => {
    const [name, setName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [rating, setRating] = useState('');
    const [restrooms, setRestrooms] = useState([]);

    const handleAddRestroom = async () => {
        try {
            const data = await addRestroom({ name, latitude, longitude, rating });
            setRestrooms([...restrooms, data]);
            setName('');
            setLatitude('');
            setLongitude('');
            setRating('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleFetchRestrooms = async () => {
        try {
            const data = await getRestrooms();
            setRestrooms(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Restaurant Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Latitude"
                value={latitude}
                onChangeText={setLatitude}
                autoCapitalize="none"
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Longitude"
                value={longitude}
                onChangeText={setLongitude}
                autoCapitalize="none"
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Rating"
                value={rating}
                onChangeText={setRating}
                autoCapitalize="none"
                keyboardType="numeric"
            />
            <Button title="Add Restaurant" onPress={handleAddRestroom} />
            <Button title="Fetch Restaurants" onPress={handleFetchRestrooms} />

            <FlatList
                data={restrooms}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <View style={styles.restroom}>
                        <Text>{item.name}</Text>
                        <Text>{item.latitude}</Text>
                        <Text>{item.longitude}</Text>
                        <Text>{item.rating}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        padding: 8,
    },
    restroom: {
        padding: 16,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
});

export default BackendTest;
