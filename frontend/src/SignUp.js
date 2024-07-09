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
    const [confirmPassword, setConfirmPassword] = useState('');

    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [generalError, setGeneralError] = useState('');

    const handleSaveChanges = async () => {
        let hasError = false;

        // Clear previous error messages
        setFirstNameError('');
        setLastNameError('');
        setUsernameError('');
        setPasswordError('');
        setConfirmPasswordError('');
        setEmailError('');
        setGeneralError('');

        // Validate fields
        const nameRegex = /^[A-Za-z]+$/;

        if (!firstName) {
            setFirstNameError('First Name is required');
            hasError = true;
        } else if (!nameRegex.test(firstName)) {
            setFirstNameError('First Name must contain only letters');
            hasError = true;
        }

        if (!lastName) {
            setLastNameError('Last Name is required');
            hasError = true;
        } else if (!nameRegex.test(lastName)) {
            setLastNameError('Last Name must contain only letters');
            hasError = true;
        }

        if (!username) {
            setUsernameError('Username is required');
            hasError = true;
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError('Invalid email address');
            hasError = true;
        }

        if (password && (!confirmPassword || password !== confirmPassword)) {
            setConfirmPasswordError('Passwords do not match');
            hasError = true;
        }

        if (hasError) {
            return;
        }

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
        setConfirmPassword('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>First Name <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="none"
                />
                {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Last Name <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="none"
                />
                {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Username <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    textContentType="none"
                />
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    textContentType="none"
                />
                {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
            </View>
            {generalError ? <Text style={styles.errorText}>{generalError}</Text> : null}
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
    inputContainer: {
        width: '100%',
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        marginBottom: 4,
    },
    required: {
        color: 'red',
    },
    input: {
        width: '100%',
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
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
