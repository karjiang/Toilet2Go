import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';

const SuggestRestroom = ({ navigation }) => {
    const [name, setName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    const handleSuggestRestroom = async () => {
        if (!name || !latitude || !longitude) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);

        if (selectedImage) {
            formData.append('image', {
                uri: selectedImage.uri,
                type: selectedImage.type,
                name: selectedImage.fileName,
            });
        }

        try {
            const response = await axios.post('http://localhost:5000/suggest', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            Alert.alert('Success', 'Restroom suggestion submitted successfully.');
            navigation.navigate('MainPage');
        } catch (error) {
            console.error('Error suggesting restroom:', error);
            Alert.alert('Error', 'Failed to submit restroom suggestion');
        }
    };

    const selectImage = () => {
        ImagePicker.launchImageLibrary({}, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.error('ImagePicker Error: ', response.error);
            } else {
                setSelectedImage(response.assets[0]);
            }
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Suggest Restroom</Text>
            <TextInput
                style={styles.input}
                placeholder="Restroom Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Latitude"
                value={latitude}
                onChangeText={setLatitude}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Longitude"
                value={longitude}
                onChangeText={setLongitude}
                keyboardType="numeric"
            />
            <Button title="Select Image" onPress={selectImage} />
            {selectedImage && (
                <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
                </View>
            )}
            <Button title="Suggest Restroom" onPress={handleSuggestRestroom} />
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
    imagePreviewContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    imagePreview: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
});

export default SuggestRestroom;
