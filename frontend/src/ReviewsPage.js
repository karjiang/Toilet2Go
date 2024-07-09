import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { UserContext } from './UserContext';
import { getRestrooms } from './api';

const ReviewsPage = () => {
    const { user } = useContext(UserContext);
    const [reviewedRestrooms, setReviewedRestrooms] = useState([]);

    useEffect(() => {
        fetchReviewedRestrooms();
    }, []);

    const fetchReviewedRestrooms = async () => {
        try {
            const restrooms = await getRestrooms();
            const reviewedRestrooms = restrooms.filter(restroom => 
                user.reviews.some(review => review.restroomId === restroom.id)
            );
            setReviewedRestrooms(reviewedRestrooms);
        } catch (error) {
            console.error('Error fetching reviewed restrooms:', error);
        }
    };

    const renderItem = ({ item }) => {
        const review = user.reviews.find(review => review.restroomId === item.id);
        return (
            <View style={styles.restroomContainer}>
                <Text style={styles.restroomName}>{item.name}</Text>
                <Text style={styles.restroomDetails}>Rating: {item.rating.toFixed(1)}</Text>
                <Text style={styles.reviewComment}>Your review: {review.comment}</Text>
                <Text style={styles.reviewRating}>Your rating: {review.rating}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reviewed Restrooms</Text>
            <FlatList
                data={reviewedRestrooms}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.emptyText}>No reviewed restrooms found.</Text>}
            />
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
    restroomContainer: {
        padding: 16,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    restroomName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    restroomDetails: {
        fontSize: 16,
        color: '#666',
    },
    reviewComment: {
        fontSize: 14,
        marginTop: 5,
    },
    reviewRating: {
        fontSize: 14,
        marginTop: 5,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ReviewsPage;
