import React from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';

const MainPage = ({ navigation }) => {
    const handlePress = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }], // Use 'Home' as this is your initial screen
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Main Page ( map, etc )</Text>
            {/* Add your components here */}
            <Button title="Back to Start" onPress={handlePress} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
    },
});

export default MainPage;
