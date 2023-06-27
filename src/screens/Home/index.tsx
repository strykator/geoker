import React, {useState, useEffect, useRef} from 'react'
import {View, StyleSheet, Text} from 'react-native'
import getDistance from 'geolib/es/getDistance'
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import * as Linking from 'expo-linking'
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'
import Toast from 'react-native-toast-message'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../store'
import {updateGeo, resetGeo} from '../../store/geo/geoSlice'
import Button from '../../components/Button'
import {fonts, colors, screenSize} from '../../styles'
import {
  TASK_NAME,
  STORAGE_HISTORY_KEY,
  TOAST_TYPES,
} from '../../utils/constants'
import {meterToMile} from '../../utils/helpers'
import {getCurrentLocation} from './utils'
import Speedometer from './Speedometer'
import LocationDetails from './LocationDetails'
import FavoriteModal from './FavoriteModal'
import Map from '../../components/Map'
import {formatNumberDigits} from '../../utils/helpers'

const {fullHeight, fullWidth} = screenSize

export interface Ilocation {
  coords: {
    accuracy: number | undefined | null
    altitude: number | undefined | null
    altitudeAccuracy: number | undefined | null
    heading: number | undefined | null
    latitude: number | undefined | null
    longitude: number | undefined | null
    speed: number | undefined | null
  }
  timestamp: number | undefined | null
}

const showPermissionErrorMessage = () => {
  Toast.show({
    type: TOAST_TYPES.ERROR,
    text1: 'Permission to access location was denied',
    text2: 'Tap here to open Settings - Choose Always',
    topOffset: fullHeight * 0.03,
    visibilityTime: 5000,
    onPress: () => Linking.openSettings(),
  })
}

const Home = () => {
  const [update, setUpdate] = useState({})
  const [start, setStart] = useState(moment().valueOf())
  const [stop, setStop] = useState(true)
  const [isModalVisible, setModalVisible] = useState(false)
  const [startLocation, setStartLocation] = useState<Location.LocationObject>()
  const [intervalId, setIntervalId] = useState<any>(null)
  const [multiplier, setMultiplier] = useState<number>(2)
  const location = useRef<Ilocation | null>(null)
  const distance = useRef(0)
  const appState = useSelector((state: RootState) => state)
  const dispatch = useDispatch()

  // TaskManager.defineTask(TASK_NAME, ({data: {locations}, error}: any) => {
  //   if (error) {
  //     // check `error.message` for more details.
  //     setUpdate(JSON.stringify(error))
  //     return
  //   }

  // if (location.current && locations) {
  //   const newDistance = getDistance(
  //     {
  //       lat: location.current?.coords?.latitude,
  //       lon: location.current?.coords?.longitude,
  //     },
  //     {
  //       lat: locations[0].coords?.latitude,
  //       lon: locations[0].coords?.longitude,
  //     },
  //   )
  //   distance.current = distance.current + meterToMile(newDistance)
  // }
  // location.current = locations[0]
  // // 2 cents to rerender screen
  // setUpdate(locations[0])
  // })

  useEffect(() => {
    ;(async () => {
      const hasPermission = await requestPermission()
      if (!hasPermission) return
      let currentLocation = await Location.getCurrentPositionAsync({})
      location.current = currentLocation
    })()

    return () => {
      Location.stopLocationUpdatesAsync(TASK_NAME)
    }
  }, [])

  useEffect(() => {
    const getLocationAsync = async () => {
      try {
        const hasPermission = await requestPermission()
        if (!hasPermission) return

        const id = setInterval(async () => {
          const locationData = await Location.getCurrentPositionAsync({})
          if (!stop) {
            if (location.current && locationData) {
              const newDistance = getDistance(
                {
                  lat: location.current?.coords?.latitude,
                  lon: location.current?.coords?.longitude,
                },
                {
                  lat: locationData.coords?.latitude,
                  lon: locationData.coords?.longitude,
                },
              )
              distance.current = distance.current + meterToMile(newDistance)
            }
            location.current = locationData
            // 2 cents to rerender screen
            setUpdate(locationData)
            if (locationData.coords?.latitude) {
              dispatch(
                updateGeo({
                  latitude: locationData.coords.latitude,
                  longitude: locationData.coords.longitude,
                  speed: locationData.coords.speed ?? 0,
                  heading: locationData.coords.heading ?? 0,
                }),
              )
            }
          }
        }, 2000) // Update location every 3 seconds
        setIntervalId(id)
      } catch (error) {
        console.log('Error getting location:', error)
      }
    }

    getLocationAsync()
  }, [stop])

  const requestPermission = async () => {
    const foregound = await Location.requestForegroundPermissionsAsync()
    if (foregound.status !== 'granted') {
      showPermissionErrorMessage()
      return false
    }
    // const background = await Location.requestBackgroundPermissionsAsync()
    // if (background.status !== 'granted') {
    //   showPermissionErrorMessage()
    //   return false
    // }
    return true
  }

  const startBackgroundTracking = async () => {
    setStop(false)
    setStart(new Date().getTime())
    location.current = null
    // const background = await Location.requestBackgroundPermissionsAsync()
    // if (background.status !== 'granted') {
    //   showPermissionErrorMessage()
    //   return
    // }

    const currentLocation = await getCurrentLocation()
    setStartLocation(currentLocation)

    // Don't track if it is already running in background
    // const hasStarted = await Location.hasStartedLocationUpdatesAsync(TASK_NAME)
    // if (hasStarted) return

    // await Location.startLocationUpdatesAsync(TASK_NAME, {
    //   showsBackgroundLocationIndicator: true,
    //   accuracy: Location.Accuracy.BestForNavigation,
    //   timeInterval: 5000,
    //   distanceInterval: 5,
    //   foregroundService: {
    //     notificationTitle: 'Location',
    //     notificationBody: 'Location tracking in background',
    //     notificationColor: colors.background,
    //   },
    // })
  }

  // Stop location tracking in background
  const stopBackgroundTracking = async () => {
    setStop(true)
    if (intervalId) {
      clearInterval(intervalId)
      dispatch(resetGeo())
    }
    const lastLocation = await getCurrentLocation()

    storeData(distance.current, lastLocation)
    // const hasStarted = await Location.hasStartedLocationUpdatesAsync(TASK_NAME)
    // if (hasStarted) {
    //   await Location.stopLocationUpdatesAsync(TASK_NAME)
    // }

    reset()
  }

  const reset = async () => {
    distance.current = 0
    location.current = null
    setUpdate({})
  }

  const storeData = async (
    value: number,
    lastLocation: Location.LocationObject | undefined,
  ) => {
    try {
      const storedData = await getData()
      let temp
      if (storedData) {
        temp = [
          ...storedData,
          {
            date: moment(start).format('MM-DD-YYYY'),
            start,
            stop: moment().valueOf(),
            startLocation: {
              latitude: startLocation?.coords?.latitude,
              longitude: startLocation?.coords?.longitude,
            },
            stopLocation: {
              latitude: lastLocation?.coords?.latitude,
              longitude: lastLocation?.coords?.longitude,
            },
            mile: value,
          },
        ]
      } else {
        temp = [
          {
            date: moment(start).format('MM-DD-YYYY'),
            start,
            stop: moment().valueOf(),
            startLocation: {
              latitude: startLocation?.coords?.latitude,
              longitude: startLocation?.coords?.longitude,
            },
            stopLocation: {
              latitude: lastLocation?.coords?.latitude,
              longitude: lastLocation?.coords?.longitude,
            },
            mile: value,
          },
        ]
      }

      const jsonValue = JSON.stringify(temp)
      await AsyncStorage.setItem(STORAGE_HISTORY_KEY, jsonValue)
    } catch (e) {
      // handle error
      Toast.show({
        type: TOAST_TYPES.ERROR,
        text1: 'Could not store the current trip',
        text2: 'Please write down current total distance',
        topOffset: fullHeight * 0.03,
        visibilityTime: 5000,
      })
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_HISTORY_KEY)
      if (jsonValue !== null) {
        // value previously stored
        const value = JSON.parse(jsonValue)
        return value
      }
    } catch (e) {
      // error reading value
      Toast.show({
        type: TOAST_TYPES.ERROR,
        text1: 'Could not access the trip history',
        text2: 'Please try again later',
        topOffset: fullHeight * 0.03,
        visibilityTime: 5000,
      })
    }

    return null
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  }
  const getSpeed = () => {
    if (stop || !location.current?.coords?.speed) return 0
    return location.current?.coords?.speed * multiplier
  }
  const increaseSpeedMutiplier = () => setMultiplier(multiplier + 0.1)
  const decreaseSpeedMutiplier = () => setMultiplier(multiplier - 0.1)
  // <Text>{JSON.stringify(update || 'nothing')}</Text>
  return (
    <View style={styles.container}>
      <Map location={location.current?.coords} />
      <Speedometer speed={getSpeed()} />
      <LocationDetails
        location={location.current}
        distance={distance.current}
      />
      <View style={styles.btnGroup}>
        <Button
          title="increase"
          onPress={increaseSpeedMutiplier}
          style={styles.startBtn}
        />
        <Text>{formatNumberDigits(multiplier, 1)}</Text>
        <Button
          title="decrease"
          onPress={decreaseSpeedMutiplier}
          style={styles.stopBtn}
        />
      </View>
      <View style={styles.btnGroup}>
        <Button
          title="Start"
          onPress={startBackgroundTracking}
          style={styles.startBtn}
          disabled={!stop}
        />
        <Button
          title="Stop"
          onPress={stopBackgroundTracking}
          style={styles.stopBtn}
          disabled={stop}
        />
        <Button
          title="Favorite"
          onPress={toggleModal}
          style={styles.favoriteBtn}
          textStyle={styles.favoriteText}
        />
      </View>
      <FavoriteModal
        toggleModal={toggleModal}
        isModalVisible={isModalVisible}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontFamily: fonts.mediumItalic,
  },
  btnGroup: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: fullHeight * 0.02,
  },
  startBtn: {
    backgroundColor: colors.success,
    width: fullWidth * 0.25,
  },
  stopBtn: {
    backgroundColor: colors.tomato,
    width: fullWidth * 0.25,
  },
  favoriteBtn: {
    backgroundColor: colors.sapphire,
    width: fullWidth * 0.25,
  },
  favoriteText: {
    color: colors.snow,
    fontFamily: fonts.bold,
  },
})

export default Home
