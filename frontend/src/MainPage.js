import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { MAPBOX_ACCESS_TOKEN } from '@env';

// Set the Mapbox access token]
MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

console.log('Mapbox Access Token:', MAPBOX_ACCESS_TOKEN); // Add this line to debug

const MainPage = () => {
  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera
          zoomLevel={14}
          centerCoordinate={[-118.2842911, 34.0213524]} // Coordinates for New York City
        />
      </MapboxGL.MapView>
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
});

export default MainPage;
