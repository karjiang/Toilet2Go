import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { MAPBOX_ACCESS_TOKEN } from '@env';

// Set the Mapbox access token
MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const MainPage = () => {
  const cameraRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(14);

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

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera
          defaultSettings={{
            centerCoordinate: [-118.2842911, 34.0213524], // Coordinates for Los Angeles
            zoomLevel: 14,
          }}
          ref={cameraRef}
          zoomLevel={zoomLevel}
        />
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
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  zoomText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default MainPage;
