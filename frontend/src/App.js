import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Button, StyleSheet } from 'react-native';
import Login from './Login';
import SignUp from './SignUp';
import MainPage from './MainPage';
import BackendTest from './backendTest';

const HomeScreen = ({ navigation }) => {
    const handlePress = () => {
        navigation.navigate('Login');
    };
    const handlePress1 = () => {
        navigation.navigate('BackendTest');
    };

    return (
        <View style={styles.container}>
            <Button title="Enter App" onPress={handlePress} />
            <Button title="Backend" onPress={handlePress1} />
        </View>

        
    );
};

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} /> 
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="MainPage" component={MainPage} />
                <Stack.Screen name="BackendTest" component={BackendTest} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default App;
