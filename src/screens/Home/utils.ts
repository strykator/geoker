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
