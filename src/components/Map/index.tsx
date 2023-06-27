import React, {useEffect, useState, useRef} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
//import MapViewDirections from 'react-native-maps-directions'
//import Config from 'react-native-config'
//import * as Location from 'expo-location'
import {screenSize} from '../../styles/size'
import Button from '../Button'

interface IMap {
  coords: {
    latitude: number
    longitude: number
    heading: number
    speed: number
  }
  children?: React.ReactNode
}

const Map = ({coords, children}: IMap) => {
  const [region, setRegion] = useState()
  const [navigating, setNavigating] = useState(false)
  const mapRef = useRef<MapView>(null)
  const {latitude, longitude} = coords

  useEffect(() => {
    if (!latitude) return
    const reg = {
      latitude,
      longitude,
      latitudeDelta: 0.009,
      longitudeDelta: 0.005,
    }
    setRegion(reg)
    mapRef?.current?.animateToRegion(reg, 1000)
  }, [latitude, longitude])

  const handleRegionChange = (newRegion: any) => {
    setRegion(newRegion)
  }

  if (!latitude) {
    return <Text>Wating for GPS Coordinates...</Text>
  }

  const animateToRegion = () => {
    const reg = {
      latitude,
      longitude,
      latitudeDelta: 0.003,
      longitudeDelta: 0.002,
    }
    mapRef?.current?.animateToRegion(reg, 1000)
  }

  const startNavigation = () => {
    setNavigating(true)
    mapRef.current?.fitToCoordinates([{latitude, longitude}], {
      edgePadding: {top: 50, bottom: 50, left: 50, right: 50},
      animated: true,
    })
  }

  return (
    <View style={styles.container}>
      {region && (
        <>
          <MapView
            ref={mapRef}
            initialRegion={region}
            showsUserLocation
            followsUserLocation
            onRegionChange={handleRegionChange}
            style={styles.map}
            provider={PROVIDER_GOOGLE}>
            <Marker coordinate={region} />
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
        </>
      )}
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
