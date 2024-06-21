import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { UserContext } from './UserContext';

const UserProfile = () => {
    const { user } = useContext(UserContext);

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <View style={styles.imagePlaceholder}>
                    <Text style={styles.imagePlaceholderText}>Image</Text>
                </View>
                <Text style={styles.name}>{`${user.firstName} ${user.lastName}`}</Text>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    itemContainer: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    itemText: {
        fontSize: 16,
    },
});

export default UserProfile;
