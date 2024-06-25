import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import { getRestrooms, addRestroom, addReview } from './api';
import { UserContext } from './UserContext';

const BackendTest = () => {
    const { user } = useContext(UserContext);
    const [name, setName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [restrooms, setRestrooms] = useState([]);

    const [reviewRestaurantId, setReviewRestaurantId] = useState('');
    const [reviewRating, setReviewRating] = useState('');
    const [reviewComment, setReviewComment] = useState('');

    useEffect(() => {
        handleFetchRestrooms();
    }, []);

    const handleFetchRestrooms = async () => {
        try {
            const data = await getRestrooms();
            setRestrooms(data);
        } catch (error) {
            console.error('Error fetching restrooms:', error);
        }
    };

    const handleAddRestroom = async () => {
        try {
            const data = await addRestroom({ name, latitude, longitude, rating: 0, reviews: [] });
            setRestrooms([...restrooms, data]);
            setName('');
            setLatitude('');
            setLongitude('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAddReview = async () => {
        try {
            const data = await addReview(reviewRestaurantId, { user: user.username, rating: parseFloat(reviewRating), comment: reviewComment });
            setRestrooms(restrooms.map(restroom => {
                if (restroom.id === parseInt(reviewRestaurantId)) {
                    return { ...restroom, reviews: [...restroom.reviews, data], rating: (restroom.reviews.reduce((sum, review) => sum + review.rating, 0) + parseFloat(reviewRating)) / (restroom.reviews.length + 1) };
                }
                return restroom;
            }));
            setReviewRestaurantId('');
            setReviewRating('');
            setReviewComment('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Add Restaurant</Text>
            <TextInput
                style={styles.input}
                placeholder="Restaurant Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Latitude"
                value={latitude}
                onChangeText={setLatitude}
                autoCapitalize="none"
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Longitude"
                value={longitude}
                onChangeText={setLongitude}
                autoCapitalize="none"
                keyboardType="numeric"
            />
            <Button title="Add Restaurant" onPress={handleAddRestroom} />

            <Text style={styles.sectionTitle}>Add Review</Text>
            <TextInput
                style={styles.input}
                placeholder="Restaurant ID"
                value={reviewRestaurantId}
                onChangeText={setReviewRestaurantId}
                autoCapitalize="none"
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Rating"
                value={reviewRating}
                onChangeText={setReviewRating}
                autoCapitalize="none"
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Comment"
                value={reviewComment}
                onChangeText={setReviewComment}
                autoCapitalize="none"
            />
            <Button title="Add Review" onPress={handleAddReview} />

            <FlatList
                data={restrooms}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.restroom}>
                        <Text>ID: {item.id}</Text>
                        <Text>Name: {item.name}</Text>
                        <Text>Latitude: {item.latitude}</Text>
                        <Text>Longitude: {item.longitude}</Text>
                        <Text>Rating: {item.rating}</Text>
                        {item.reviews.length > 0 && (
                            <View style={styles.reviews}>
                                <Text>Reviews:</Text>
                                {item.reviews.map((review, index) => (
                                    <View key={index} style={styles.review}>
                                        <Text>User: {review.user}</Text>
                                        <Text>Rating: {review.rating}</Text>
                                        <Text>Comment: {review.comment}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        padding: 8,
    },
    restroom: {
        padding: 16,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
    reviews: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    review: {
        marginBottom: 10,
    },
});

export default BackendTest;
