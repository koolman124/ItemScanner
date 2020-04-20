import React, { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import {Dimensions, StyleSheet} from 'react-native';

export default function MapScreen({ route, navigation }) {
    const {stores} = route.params;
    const {user_coords} = route.params;
    const { width, height } = Dimensions.get('window');
    const ASPECT_RATIO = width / height;

    const lat = parseFloat(user_coords.latitude);
    const lng = parseFloat(user_coords.longitude);
    const northeastLat = parseFloat(user_coords.latitude);
    const southwestLat = parseFloat(user_coords.latitude);
    const latDelta = northeastLat - southwestLat;
    const lngDelta = latDelta * ASPECT_RATIO;

    const region = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: .3,
        longitudeDelta: .3
    }

    console.log(region);

    return (
        <MapView
            style={styles.map}
            region={region}
            showsUserLocation={true}
            >
            {stores.map(marker => (
                <Marker
                    coordinate={{"latitude":marker.store_coords.lat,"longitude":marker.store_coords.lng}}
                    title={marker.store_name}
                    description={marker.store_address}
                    key={marker.store_name}
                />
            ))}
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  });
