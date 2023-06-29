import React, {useState, useEffect} from 'react'
import {View, StyleSheet, TextInput} from 'react-native'
import Modal from 'react-native-modal'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'
import Button from '../../components/Button'
import Text from '../../components/Text'
import {colors, screenSize, font} from '../../styles'
import {getAddressFromReversedGeocode} from '../../utils/helpers'
import {STORAGE_FAVORITE_KEY, TOAST_TYPES} from '../../utils/constants'
import {getCurrentLocation} from './utils'

const {fullHeight, fullWidth} = screenSize

const initSnapshotLocation = {
  latitude: undefined,
  longitude: undefined,
  timestamp: undefined,
  address: '',
}

interface ISnapshotLocation {
  latitude: number | undefined
  longitude: number | undefined
  timestamp: number | undefined
  address: string
}

interface IFavoriteModal {
  toggleModal: () => void
  isModalVisible: boolean
}

const FavoriteModal = ({toggleModal, isModalVisible}: IFavoriteModal) => {
  const [title, onChangeTitle] = useState('')
  const [snapshotLocation, setSnapshotLocation] =
    useState<ISnapshotLocation>(initSnapshotLocation)

  useEffect(() => {
    if (isModalVisible) {
      showLocationInfo()
    }
  }, [isModalVisible])

  const showLocationInfo = async () => {
    const currentLocation = await getCurrentLocation()
    const latitude = currentLocation?.coords?.latitude
    const longitude = currentLocation?.coords?.longitude
    const timestamp = currentLocation?.timestamp
    let temp: Array<Location.LocationGeocodedAddress> = []
    if (latitude && longitude) {
      temp = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      })
    }
    setSnapshotLocation({
      latitude,
      longitude,
      address: getAddressFromReversedGeocode(temp[0]),
      timestamp,
    })
  }

  const storeFavoriteLocation = async () => {
    if (!snapshotLocation.latitude) return

    const {latitude, longitude, address, timestamp} = snapshotLocation
    let formattedData = []
    try {
      const storedFavoriteData = await getFavoriteData()
      if (storedFavoriteData !== null) {
        formattedData = [
          {
            title,
            latitude,
            longitude,
            address,
            timestamp,
          },
          ...storedFavoriteData,
        ]
      } else {
        formattedData.push({
          title,
          latitude,
          longitude,
          address,
          timestamp,
        })
      }

      const jsonValue = JSON.stringify(formattedData)
      await AsyncStorage.setItem(STORAGE_FAVORITE_KEY, jsonValue)
    } catch (e) {
      // handle error
      Toast.show({
        type: TOAST_TYPES.ERROR,
        text1: 'Could not store the current location',
        text2: 'Please try again later',
        topOffset: fullHeight * 0.03,
        visibilityTime: 3000,
      })
    }
    onChangeTitle('')
    setSnapshotLocation(initSnapshotLocation)
    toggleModal()
  }

  const getFavoriteData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_FAVORITE_KEY)
      if (jsonValue !== null) {
        // value previously stored
        const value = JSON.parse(jsonValue)
        return value
      }
    } catch (e) {
      // error reading value
      Toast.show({
        type: TOAST_TYPES.ERROR,
        text1: 'Could not access the favorite location',
        text2: 'Please try again later',
        topOffset: fullHeight * 0.03,
        visibilityTime: 5000,
      })
    }

    return null
  }

  return (
    <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeTitle}
          value={title}
          placeholder="My Favorite Place"
        />
        <View style={styles.infoContainer}>
          <Text
            title={`Latitude: ${snapshotLocation.latitude || ''}`}
            titleColor={colors.snow}
          />
          <Text
            title={`Longitude: ${snapshotLocation.longitude || ''}`}
            titleColor={colors.snow}
          />
          <Text
            title={`Near: ${snapshotLocation.address || ''}`}
            titleColor={colors.snow}
          />
        </View>
        <View style={styles.space} />
        <Button
          title="Save"
          onPress={storeFavoriteLocation}
          disabled={!title}
          width={fullWidth * 0.4}
          height={fullHeight * 0.05}
          bgColor={colors.snow}
          titleColor={colors.sapphire}
        />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    height: fullHeight * 0.34,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sapphire,
    borderRadius: 5,
  },
  input: {
    height: 40,
    width: '85%',
    margin: 12,
    borderWidth: 0,
    padding: 10,
    borderRadius: 5,
    backgroundColor: colors.snow,
    fontFamily: font.family.regular,
    fontSize: font.size.s,
  },
  infoContainer: {
    width: '85%',
    height: fullHeight * 0.12,
  },
  space: {
    height: fullHeight * 0.02,
    width: '100%',
  },
})

export default FavoriteModal
