import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView } from 'react-native';
import { getRestrooms, addRestroom, addReview, addUserReview } from './api';
import { UserContext } from './UserContext';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';

const BackendTest = () => {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [reviewImage, setReviewImage] = useState(null);
  const [restroomImage, setRestroomImage] = useState(null);
  const [restroomIdForImage, setRestroomIdForImage] = useState('');
  const [restrooms, setRestrooms] = useState([]);

  const [reviewRestroomId, setReviewRestroomId] = useState('');
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
    if (!name || !latitude || !longitude) {
      alert('Please fill in all fields');
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
      const response = await axios.post('http://localhost:5000/restrooms', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newRestroom = response.data;
      setRestrooms([...restrooms, newRestroom]);

      // Reset fields
      setName('');
      setLatitude('');
      setLongitude('');
      setSelectedImage(null);
    } catch (error) {
      console.error('Error adding restroom:', error.response ? error.response.data : error.message); // Log the error message
    }
  };

  const handleAddReview = async () => {
    if (!reviewRestroomId || !reviewRating || !reviewComment) {
      alert('Please fill in all fields');
      return;
    }

    const rating = parseFloat(reviewRating);
    if (isNaN(rating)) {
      alert('Please enter a valid number for rating');
      return;
    }

    const formData = new FormData();
    formData.append('user', user.username);
    formData.append('rating', rating); // Ensure rating is parsed as a float
    formData.append('comment', reviewComment);

    if (reviewImage) {
      formData.append('image', {
        uri: reviewImage.uri,
        type: reviewImage.type,
        name: reviewImage.fileName,
      });
    }

    try {
      const response = await axios.post(`http://localhost:5000/restrooms/${reviewRestroomId}/reviews`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newReview = response.data.review;

      // Add review to the user
      await addUserReview(user.id, { restroomId: parseInt(reviewRestroomId), rating: rating, comment: reviewComment, image: newReview.image });

      // Update the user context with the new review
      setUser(prevUser => ({
        ...prevUser,
        reviews: [...prevUser.reviews, { restroomId: parseInt(reviewRestroomId), rating: rating, comment: reviewComment, image: newReview.image }]
      }));

      // Reset review fields
      setReviewRestroomId('');
      setReviewRating('');
      setReviewComment('');
      setReviewImage(null);
    } catch (error) {
      console.error('Error adding review:', error.response ? error.response.data : error.message); // Log the error message
    }
  };

  const handleUploadRestroomImage = async () => {
    if (!restroomIdForImage || !restroomImage) {
      alert('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('image', {
      uri: restroomImage.uri,
      type: restroomImage.type,
      name: restroomImage.fileName,
    });

    try {
      const response = await axios.post(`http://localhost:5000/restrooms/${restroomIdForImage}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedRestroom = response.data;

      // Update the restrooms state
      setRestrooms(prevRestrooms => prevRestrooms.map(restroom => restroom.id === updatedRestroom.id ? updatedRestroom : restroom));

      // Reset fields
      setRestroomIdForImage('');
      setRestroomImage(null);
    } catch (error) {
      console.error('Error uploading image:', error.response ? error.response.data : error.message); // Log the error message
    }
  };

  const selectImage = (setImage) => {
    ImagePicker.launchImageLibrary({}, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error: ', response.error);
      } else {
        setImage(response.assets[0]);
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Add Restroom</Text>
      <TextInput
        style={styles.input}
        placeholder="Restroom Name"
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
      <Button title="Select Image" onPress={() => selectImage(setSelectedImage)} />
      {selectedImage && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
        </View>
      )}
      <Button title="Add Restroom" onPress={handleAddRestroom} />

      <Text style={styles.sectionTitle}>Add Review</Text>
      <TextInput
        style={styles.input}
        placeholder="Restroom ID"
        value={reviewRestroomId}
        onChangeText={setReviewRestroomId}
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
      <Button title="Select Review Image" onPress={() => selectImage(setReviewImage)} />
      {reviewImage && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: reviewImage.uri }} style={styles.imagePreview} />
        </View>
      )}
      <Button title="Add Review" onPress={handleAddReview} />

      <Text style={styles.sectionTitle}>Upload Image to Restroom</Text>
      <TextInput
        style={styles.input}
        placeholder="Restroom ID"
        value={restroomIdForImage}
        onChangeText={setRestroomIdForImage}
        autoCapitalize="none"
        keyboardType="numeric"
      />
      <Button title="Select Image" onPress={() => selectImage(setRestroomImage)} />
      {restroomImage && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: restroomImage.uri }} style={styles.imagePreview} />
        </View>
      )}
      <Button title="Upload Image" onPress={handleUploadRestroomImage} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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

export default BackendTest;
