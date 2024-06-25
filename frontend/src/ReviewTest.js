import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { addReview } from './api';
import { UserContext } from './UserContext';

const ReviewTest = () => {
    const { user } = useContext(UserContext);
    const [reviewRestaurantId, setReviewRestaurantId] = useState('');
    const [reviewRating, setReviewRating] = useState('');
    const [reviewComment, setReviewComment] = useState('');

    const handleAddReview = async () => {
        try {
            const data = await addReview(reviewRestaurantId, { user: user.username, rating: parseFloat(reviewRating), comment: reviewComment });
            setReviewRestaurantId('');
            setReviewRating('');
            setReviewComment('');
            alert('Review added successfully!');
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding review');
        }
    };

    return (
        <View style={styles.container}>
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
});

export default ReviewTest;
