import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { UserContext } from './UserContext';
import { updateUser } from './api';

const EditProfile = () => {
    const { user, setUser } = useContext(UserContext);
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');

    const handleSaveChanges = async () => {
        const updateData = {};
        if (firstName && firstName !== user.firstName) updateData.firstName = firstName;
        if (lastName && lastName !== user.lastName) updateData.lastName = lastName;
        if (username && username !== user.username) updateData.username = username;
        if (email && email !== user.email) updateData.email = email;
        if (password) updateData.password = password;

        if (Object.keys(updateData).length === 0) {
            Alert.alert('Error', 'No changes to save');
            return;
        }

        console.log('Update Data:', updateData);

        try {
            const updatedUser = await updateUser(user.id, updateData);
            setUser(updatedUser);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error.response ? error.response.data : error.message);
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const handleCancel = () => {
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setUsername(user.username);
        setEmail(user.email);
        setPassword('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
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
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        padding: 8,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        backgroundColor: 'blue',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EditProfile;
