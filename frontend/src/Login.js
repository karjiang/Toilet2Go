import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { loginUser } from './api';

const Login = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        setErrorMessage(''); // Clear previous error messages
        try {
            const response = await loginUser(username, password);
            if (response.success) {
                navigation.navigate('MainPage');
            } else {
                setErrorMessage(response.message || 'Invalid username or password');
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.name}>Toilet2Go</Text>
            <Text style={styles.title}>Login</Text>
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
            <Button title="Login" onPress={handleLogin} />
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an Account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.signupLink}>Sign Up</Text>
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
        marginBottom: 50,
    },
    title: {
        fontSize: 20,
        marginBottom: 15,
    },
    name: {
        fontSize: 50,
        marginBottom: 15,
    },
    input: {
        width: '100%',
        padding: 8,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginTop: 5,
        marginBottom: 5,
    },
    signupContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    signupText: {
        fontSize: 16,
    },
    signupLink: {
        fontSize: 16,
        color: 'blue',
    },
});

export default Login;
