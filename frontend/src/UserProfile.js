import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserContext } from './UserContext';
import { useNavigation } from '@react-navigation/native';

const UserProfile = () => {
    const navigation = useNavigation();
    const { user } = useContext(UserContext);
    const editProfilePress = () => {
        navigation.navigate('EditProfile');
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <View style={styles.imagePlaceholder}>
                    <Text style={styles.imagePlaceholderText}>Image</Text>
                </View>
                <Text style={styles.name}>{`${user.firstName} ${user.lastName}`}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={editProfilePress}>
                <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    imagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    imagePlaceholderText: {
        color: 'white',
        fontSize: 16,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 'auto',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UserProfile;
