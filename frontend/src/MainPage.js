import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TouchableWithoutFeedback, Animated, Dimensions } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { MAPBOX_ACCESS_TOKEN } from '@env';
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
  const screenWidth = Dimensions.get('window').width;
  const slideAnim = useRef(new Animated.Value(-screenWidth / 3)).current; // Initial value for sliding menu

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
  };

  const handleNavigateToBackendTest = () => {
    navigation.navigate('BackendTest');
  };

  const handleNavigateToUserProfile = () => {
    navigation.navigate('UserProfile');
  };

  const closeModal = () => {
    setSelectedRestroom(null);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    Animated.timing(slideAnim, {
      toValue: menuOpen ? -screenWidth / 3 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
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
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
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
      )}

      <Animated.View style={[styles.sideMenu, { width: screenWidth / 3, transform: [{ translateX: slideAnim }] }]}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Search')}>
          <Text style={styles.menuText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleNavigateToUserProfile}>
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity style={styles.circleButton} onPress={toggleMenu}>
        <Text style={styles.circleButtonText}>≡</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    backgroundColor: 'white',
    padding: 20,
    elevation: 20,
    zIndex: 1000,
  },
  menuItem: {
    marginVertical: 10,
  },
  menuText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  circleButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  circleButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default MainPage;
