import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { getUsers, addUser, getRestrooms, addRestroom } from './api';

const BackendTest = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [rating, setRating] = useState('');
    const [restrooms, setRestrooms] = useState([]);

    const handleAddUser = async () => {
        try {
            const data = await addUser({ firstName, lastName, username, password, email, phone });
            setUsers([...users, data]);
            setFirstName('');
            setLastName('');
            setUsername('');
            setPassword('');
            setEmail('');
            setPhone('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleFetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
            const userExists = data.some(user => user.firstName === firstName && user.lastName === lastName);
            Alert.alert('User Exists', userExists ? 'true' : 'false');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAddRestroom = async () => {
        try {
            const data = await addRestroom({ name, latitude: parseFloat(latitude), longitude: parseFloat(longitude), rating: parseFloat(rating) });
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
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            
            <TextInput
                style={styles.input}
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
                autoCapitalize="none"
            />
            <Button title="Add User" onPress={handleAddUser} />
            <Button title="Fetch Users" onPress={handleFetchUsers} />

            <FlatList
                data={users}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <View style={styles.user}>
                        <Text>{item.firstName} {item.lastName}</Text>
                        <Text>{item.username}</Text>
                        <Text>{item.email}</Text>
                        <Text>{item.phone}</Text>
                    </View>
                )}
            />

            <TextInput
                style={styles.input}
                placeholder="Restroom Name"
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
            <Button title="Add Restroom" onPress={handleAddRestroom} />
            <Button title="Fetch Restrooms" onPress={handleFetchRestrooms} />

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
    user: {
        padding: 16,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
    restroom: {
        padding: 16,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
});

export default BackendTest;
