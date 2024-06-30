import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { registerUser } from './api';
import { UserContext } from './UserContext';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const SignUp = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');

    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [generalError, setGeneralError] = useState('');

    const { setUser } = useContext(UserContext);

    const handleSignUp = async () => {
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

        if (!password) {
            setPasswordError('Password is required');
            hasError = true;
        }

        if (!confirmPassword) {
            setConfirmPasswordError('Confirm Password is required');
            hasError = true;
        }

        if (password && confirmPassword && password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            hasError = true;
        }

        if (!email) {
            setEmailError('Email is required');
            hasError = true;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setEmailError('Invalid email address');
                hasError = true;
            }
        }

        if (hasError) {
            return;
        }

        // If all checks pass, proceed with sign-up logic
        try {
            const user = { firstName, lastName, username, password, email };
            const response = await registerUser(user);
            if (response.success) {
                setUser(response.user);
                requestLocationPermission();
            } else {
                setGeneralError('Account already exists');
            }
        } catch (error) {
            setGeneralError('An error occurred. Please try again.');
        }
    };

    const requestLocationPermission = async () => {
        try {
            console.log('Requesting location permission...');
            const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            if (status === RESULTS.DENIED || status === RESULTS.LIMITED) {
                const permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
                console.log('Permission status after request:', permissionStatus);
                if (permissionStatus === RESULTS.GRANTED) {
                    getLocation();
                } else {
                    showSuccessAlert();
                }
            } else if (status === RESULTS.GRANTED) {
                console.log('Location permission already granted.');
                getLocation();
            } else {
                console.log('Location permission denied.');
                showSuccessAlert();
            }
        } catch (error) {
            console.error('Error checking/requesting location permission:', error);
            showSuccessAlert();
        }
    };

    const getLocation = () => {
        console.log('Getting location...');
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                console.log('Location obtained:', latitude, longitude);
                setUser(prevState => ({ ...prevState, location: { latitude, longitude } }));
                showSuccessAlert();
            },
            error => {
                console.error('Geolocation error:', error);
                Alert.alert('Error', 'Failed to get your location', [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('MainPage'),
                    },
                ]);
            }
        );
    };

    const showSuccessAlert = () => {
        Alert.alert('Success', 'Account created successfully', [
            {
                text: 'OK',
                onPress: () => navigation.navigate('MainPage'),
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
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
                <Text style={styles.label}>Password <Text style={styles.required}>*</Text></Text>
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
                <Text style={styles.label}>Confirm Password <Text style={styles.required}>*</Text></Text>
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
            <Button title="Sign Up" onPress={handleSignUp} />
            {generalError ? <Text style={styles.errorText}>{generalError}</Text> : null}
            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an Account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        marginBottom: 150,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
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
    loginContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    loginText: {
        fontSize: 16,
    },
    loginLink: {
        fontSize: 16,
        color: 'blue',
    },
});

export default SignUp;
