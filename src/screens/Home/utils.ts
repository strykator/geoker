import * as Location from 'expo-location'
import Toast from 'react-native-toast-message'
import {TOAST_TYPES} from '../../utils/constants'
import {screenSize} from '../../styles'

const {fullHeight} = screenSize

export const getCurrentLocation = async () => {
  try {
    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: 6,
      distanceInterval: 1,
    })

    return currentLocation
  } catch (error) {
    // handle error
    Toast.show({
      type: TOAST_TYPES.ERROR,
      text1: 'Could not get current location',
      topOffset: fullHeight * 0.03,
      visibilityTime: 2000,
    })
  }
}

export const calculateDirection = (heading: any) => {
  if (!heading) return ''

  if (heading >= 337.5 || heading < 22.5) {
    return 'North'
  } else if (heading >= 22.5 && heading < 67.5) {
    return 'Northeast'
  } else if (heading >= 67.5 && heading < 112.5) {
    return 'East'
  } else if (heading >= 112.5 && heading < 157.5) {
    return 'Southeast'
  } else if (heading >= 157.5 && heading < 202.5) {
    return 'South'
  } else if (heading >= 202.5 && heading < 247.5) {
    return 'Southwest'
  } else if (heading >= 247.5 && heading < 292.5) {
    return 'West'
  } else if (heading >= 292.5 && heading < 337.5) {
    return 'Northwest'
  } else {
    return 'Unknown'
  }
}
