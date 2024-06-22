import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, TextInput, Animated, TouchableWithoutFeedback } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { MAPBOX_ACCESS_TOKEN } from '@env';
import axios from 'axios';
import { getRestrooms } from './api';
import 'react-native-console-time-polyfill';
import { useNavigation } from '@react-navigation/native';

// Set the Mapbox access token
MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const MainPage = () => {
  const navigation = useNavigation();
  const mapViewRef = useRef(null);
  const cameraRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(14);
  const [restrooms, setRestrooms] = useState([]);
  const [selectedRestroom, setSelectedRestroom] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-1)).current; // Initial value for sliding menu
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchRestrooms();
  }, []);

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
    setSelectedRestroom(null);
    setModalVisible(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    Animated.timing(slideAnim, {
      toValue: menuOpen ? -1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    setMenuOpen(false);
    Animated.timing(slideAnim, {
      toValue: -1,
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
          animationDuration: 1000, // 1 second animation duration
        });
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
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
                centerCoordinate: [-118.2842911, 34.0213524], // Coordinates for Los Angeles
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
        <TouchableOpacity style={styles.navigateButton} onPress={handleNavigateToBackendTest}>
          <Text style={styles.navigateText}>Backend</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigateButton} onPress={handleNavigateToUserProfile}>
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
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedRestroom.name}</Text>
              <Text>ID: {selectedRestroom.id}</Text>
              <Text>Latitude: {selectedRestroom.latitude}</Text>
              <Text>Longitude: {selectedRestroom.longitude}</Text>
              <Text>Rating: {selectedRestroom.rating.toFixed(2)}</Text>
              <Text>Reviews:</Text>
              {selectedRestroom.reviews.map((review, index) => (
                <View key={index} style={styles.review}>
                  <Text>User: {review.user}</Text>
                  <Text>Rating: {review.rating}</Text>
                  <Text>Comment: {review.comment}</Text>
                </View>
              ))}
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
    width: 45, // Set the width to create a square
    height: 45, // Set the height to match the width
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  navigateText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  zoomButton: {
    backgroundColor: 'white',
    borderRadius: 5,
    width: 45, // Set the width to create a square
    height: 45, // Set the height to match the width
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
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20, // Adjusted top padding
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'flex-start', // Align items to the top
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  review: {
    marginBottom: 10,
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '33%', // 1/3 of the width
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
    width: 30, // 2/3 of original 45
    height: 30, // 2/3 of original 45
    borderRadius: 15, // 2/3 of original 22.5
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    marginRight: 10,
  },
  circleButtonText: {
    color: 'white',
    fontSize: 16, // 2/3 of original 24
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
});

export default MainPage;
