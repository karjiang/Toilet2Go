import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { MAPBOX_ACCESS_TOKEN } from '@env';
import { getRestrooms } from './api';
import 'react-native-console-time-polyfill';

// Set the Mapbox access token
MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const MainPage = () => {
  const mapViewRef = useRef(null);
  const cameraRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(14);
  const [restrooms, setRestrooms] = useState([]);
  const [selectedRestroom, setSelectedRestroom] = useState(null);

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

  return (
    <View style={styles.container}>
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
            {selectedRestroom && selectedRestroom._id === restroom._id && (
              <MapboxGL.Callout title={`Lat: ${restroom.latitude}, Lon: ${restroom.longitude}`} />
            )}
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>
      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
          <Text style={styles.zoomText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
          <Text style={styles.zoomText}>-</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
});

export default MainPage;
