import React, {useEffect, useState, useRef} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
//import MapViewDirections from 'react-native-maps-directions'
//import Config from 'react-native-config'
//import * as Location from 'expo-location'
import {screenSize} from '../../styles/size'
import Button from '../Button'

const Map = (props: any, children: any) => {
  const [region, setRegion] = useState({
    latitude: 37.32482594,
    longitude: -122.01972075,
    latitudeDelta: 0.1,
    longitudeDelta: 0.08,
  })
  const [navigating, setNavigating] = useState(false)
  const mapRef = useRef<MapView>(null)
  const {location} = props

  const handleRegionChange = (newRegion: any) => {
    setRegion(newRegion)
  }

  const animateToRegion = () => {
    const reg = {
      latitude: location?.latitude,
      longitude: location?.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.08,
    }
    mapRef?.current?.animateToRegion(reg, 1000)
  }

  const startNavigation = () => {
    setNavigating(true)
    mapRef.current?.fitToCoordinates(
      [{latitude: location?.latitude, longitude: location?.longitude}],
      {
        edgePadding: {top: 50, bottom: 50, left: 50, right: 50},
        animated: true,
      },
    )
  }

  if (!location) {
    return <Text>Loading Map...</Text>
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        initialRegion={region}
        showsUserLocation
        followsUserLocation={true}
        onRegionChange={handleRegionChange}
        style={styles.map}
        provider={PROVIDER_GOOGLE}>
        <Marker
          coordinate={{
            latitude: location?.latitude || 37.32482594,
            longitude: location?.longitude || -122.01972075,
          }}
        />
        {/*navigating && (
          <MapViewDirections
            origin={{latitude: 37.32482594, longitude: -122.01972075}}
            destination={{
              latitude: location?.latitude,
              longitude: location?.longitude,
            }}
            apikey={Config.GOOGLE_MAPS_API_KEY}
            strokeWidth={3}
            strokeColor="hotpink"
          />
          )*/}
      </MapView>
      <Button title="CENTER" onPress={animateToRegion} style={styles.btn} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: screenSize.fullHeight * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  btn: {
    position: 'absolute',
    bottom: screenSize.fullWidth * 0.1,
    left: screenSize.fullWidth * 0.1,
    backgroundColor: 'cyan',
  },
})

export default Map
