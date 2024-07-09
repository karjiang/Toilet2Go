import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Button, StyleSheet } from 'react-native';
import Login from './Login';
import SignUp from './SignUp';
import MainPage from './MainPage';
import BackendTest from './backendTest';
import UserProfile from './UserProfile';
import EditProfile from './EditProfile';
import { UserProvider } from './UserContext';


const HomeScreen = ({ navigation }) => {
    const handlePress = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <Button title="Enter App" onPress={handlePress} />
        </View>
    );
};

const Stack = createStackNavigator();

const App = () => {
    return (
        <UserProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="SignUp" component={SignUp} />
                    <Stack.Screen name="MainPage" component={MainPage} />
                    <Stack.Screen name="BackendTest" component={BackendTest} />
                    <Stack.Screen name="UserProfile" component={UserProfile} />
                    <Stack.Screen name="EditProfile" component={EditProfile} />
                </Stack.Navigator>
            </NavigationContainer>
        </UserProvider>
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
