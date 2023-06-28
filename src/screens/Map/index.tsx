import React from 'react'
import {View, StyleSheet, SafeAreaView, Platform} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../store'
import {
  selectGeoLatitude,
  selectGeoLongitude,
  selectGeoHeading,
  selectGeoSpeed,
} from '../../store/geo/geoSlice'
import Map from '../../components/Map'

export default function MapScreen() {
  const latitude = useSelector((state: RootState) => selectGeoLatitude(state))
  const longitude = useSelector((state: RootState) => selectGeoLongitude(state))
  const heading = useSelector((state: RootState) => selectGeoHeading(state))
  const speed = useSelector((state: RootState) => selectGeoSpeed(state))
  const coords = {latitude, longitude, heading, speed}

  return (
    <SafeAreaView style={styles.container}>
      <Map coords={coords} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? 50 : 0,
  },
})
