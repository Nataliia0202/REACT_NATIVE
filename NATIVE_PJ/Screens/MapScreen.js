import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export const Map = ({ route }) => {
  const [region, setRegion] = useState({
    latitude: 50.34855795212235,
    longitude: 30.420385218904713,
    latitudeDelta: 0.01,
    longitudeDelta: 0.06,
  });
  console.log(route.params);
  // let latitude = 50.34855795212235;
  // let longitude = 30.420385218904713;
  // if (route.params.location) {
  //   latitude = route.params.location.latitude;
  //   longitude = route.params.location.longitude;
  // }
  return (
    <View style={styles.container}>
      <MapView
        style={{ flex: 1 }}
        region={region}
        onRegionChange={(region) => setRegion( region )}
      >
        <Marker
          title="I am here"
          coordinate={{ latitude: region.latitude, longitude: region.longitude }}
          description="Hello"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
