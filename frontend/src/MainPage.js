import React, { useRef, useState, useEffect, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, TextInput, Animated, TouchableWithoutFeedback, Image, ScrollView } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { MAPBOX_ACCESS_TOKEN } from '@env';
import axios from 'axios';
import { getRestrooms, addUserFavorite, removeUserFavorite } from './api';
import 'react-native-console-time-polyfill';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from './UserContext';

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const MainPage = () => {
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext);
  const mapViewRef = useRef(null);
  const cameraRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(14);
  const [restrooms, setRestrooms] = useState([]);
  const [selectedRestroom, setSelectedRestroom] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [localFavorites, setLocalFavorites] = useState(new Set(user.favoriteRestrooms || []));

  useEffect(() => {
    fetchRestrooms();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', updateUserFavorites);
    return unsubscribe;
  }, [navigation, localFavorites]);

  const fetchRestrooms = async () => {
    try {
      const data = await getRestrooms();
      setRestrooms(data);
    } catch (error) {
      console.error('Error fetching restrooms:', error);
    }
  };

  const handleZoomIn = () => {
    const newZoomLevel = Math.min(zoomLevel + 1, 20);
    setZoomLevel(newZoomLevel);
    cameraRef.current.setCamera({
      zoomLevel: newZoomLevel,
      animationDuration: 300,
    });
  };

  const handleZoomOut = () => {
    const newZoomLevel = Math.max(zoomLevel - 1, 0);
    setZoomLevel(newZoomLevel);
    cameraRef.current.setCamera({
      zoomLevel: newZoomLevel,
      animationDuration: 300,
    });
  };

  const handlePinPress = (restroom) => {
    setSelectedRestroom(restroom);
    setModalVisible(true);
  };

  const handleNavigateToBackendTest = () => {
    navigation.navigate('BackendTest');
  };

  const handleNavigateToUserProfile = () => {
    navigation.navigate('UserProfile');
  };

  const handleNavigateToFavorites = () => {
    navigation.navigate('Favorites');
  };

  const handleNavigateToReviews = () => {
    navigation.navigate('Reviews');
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRestroom(null);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    Animated.timing(slideAnim, {
      toValue: menuOpen ? -100 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    setMenuOpen(false);
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSearchSubmit = async () => {
    try {
      const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_ACCESS_TOKEN}`);
      if (response.data.features.length > 0) {
        const [longitude, latitude] = response.data.features[0].center;
        cameraRef.current.setCamera({
          centerCoordinate: [longitude, latitude],
          zoomLevel: 14,
          animationDuration: 1000,
        });
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  const handleToggleFavorite = () => {
    const newFavorites = new Set(localFavorites);
    if (newFavorites.has(selectedRestroom.id)) {
      newFavorites.delete(selectedRestroom.id);
    } else {
      newFavorites.add(selectedRestroom.id);
    }
    setLocalFavorites(newFavorites);
  };

  const updateUserFavorites = async () => {
    try {
      const favoritesArray = Array.from(localFavorites);
      const newUser = { ...user, favoriteRestrooms: favoritesArray };
      setUser(newUser);

      const addFavoritePromises = favoritesArray
        .filter(id => !user.favoriteRestrooms?.includes(id))
        .map(id => addUserFavorite(user.id, id));

      const removeFavoritePromises = (user.favoriteRestrooms || [])
        .filter(id => !favoritesArray.includes(id))
        .map(id => removeUserFavorite(user.id, id));

      await Promise.all([...addFavoritePromises, ...removeFavoritePromises]);
    } catch (error) {
      console.error('Error updating user favorites:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.circleButton} onPress={toggleMenu}>
          <Text style={styles.circleButtonText}>≡</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          autoCapitalize="none"
        />
      </View>

      {menuOpen && (
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.mapContainer}>
          <MapboxGL.MapView
            ref={mapViewRef}
            style={styles.map}
            zoomEnabled={true}
            onMapIdle={() => console.log('Map is idle')}
          >
            <MapboxGL.Camera
              defaultSettings={{
                centerCoordinate: [-118.2842911, 34.0213524],
                zoomLevel: 14,
              }}
              ref={cameraRef}
              zoomLevel={zoomLevel}
            />
            {restrooms.map((restroom, index) => (
              <MapboxGL.PointAnnotation
                key={`pin-${index}`}
                id={`pin-${index}`}
                coordinate={[parseFloat(restroom.longitude), parseFloat(restroom.latitude)]}
                onSelected={() => handlePinPress(restroom)}
              >
                <View style={styles.annotationContainer}>
                  <View style={styles.annotationFill} />
                </View>
              </MapboxGL.PointAnnotation>
            ))}
          </MapboxGL.MapView>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomButton} onPress={handleNavigateToBackendTest}>
          <Text style={styles.navigateText}>Backend</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={handleNavigateToUserProfile}>
          <Text style={styles.navigateText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
          <Text style={styles.zoomText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
          <Text style={styles.zoomText}>-</Text>
        </TouchableOpacity>
      </View>

      {selectedRestroom && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedRestroom.name} ({selectedRestroom.rating.toFixed(1)}*)</Text>
              <Image
                source={{ uri: 'https://via.placeholder.com/150' }}
                style={styles.tempImage}
              />
              <Text style={styles.modalSectionTitle}>Reviews:</Text>
              <View style={styles.separator} />
              {selectedRestroom.reviews.map((review, index) => (
                <View key={index} style={styles.review}>
                  <Text style={styles.reviewUser}>{review.user}:</Text>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.favoriteButtonContainer}>
              <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
                <Text style={styles.favoriteButtonText}>
                  {localFavorites.has(selectedRestroom.id) ? 'Unfavorite' : 'Favorite'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <Animated.View style={[styles.sideMenu, { transform: [{ translateX: slideAnim.interpolate({ inputRange: [-1, 0], outputRange: [-100, 0] }) }] }]}>
        <TouchableOpacity style={styles.menuItem} onPress={handleNavigateToUserProfile}>
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleNavigateToFavorites}>
          <Text style={styles.menuText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleNavigateToReviews}>
          <Text style={styles.menuText}>Reviews</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    elevation: 10,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  zoomControls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
  },
  navigateButton: {
    backgroundColor: 'white',
    borderRadius: 5,
    width: 60,
    height: 45,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  navigateText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  zoomButton: {
    backgroundColor: 'white',
    borderRadius: 5,
    width: 45,
    height: 45,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  zoomText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  annotationContainer: {
    width: 30,
    height: 30,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007cbf',
    borderRadius: 15,
    overflow: 'hidden',
  },
  annotationFill: {
    width: 30,
    height: 30,
    backgroundColor: '#007cbf',
    transform: [{ scale: 0.6 }],
    borderRadius: 15,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'flex-start',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  tempImage: {
    width: '100%',
    height: 100,
    marginVertical: 10,
    backgroundColor: '#ccc',
  },
  separator: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  review: {
    marginBottom: 10,
  },
  reviewUser: {
    fontWeight: 'bold',
  },
  reviewComment: {
    marginLeft: 10,
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '33%',
    backgroundColor: 'white',
    padding: 20,
    elevation: 20,
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  menuItem: {
    marginVertical: 10,
  },
  menuText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  circleButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    marginRight: 10,
  },
  circleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchBar: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  favoriteButtonContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  favoriteButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  favoriteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MainPage;
