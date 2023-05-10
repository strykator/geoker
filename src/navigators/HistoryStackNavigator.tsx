import React from 'react'
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
import LocationInfo from '../components/LocationInfo'
import History from '../screens/History'
import {colors} from '../styles'

export type HistoryStackParamList = {
  HistoryList: undefined
  LocationHistory: {
    startLocation: {
      latitude: number
      longitude: number
    }
    stopLocation: {
      latitude: number
      longitude: number
    }
  }
}

export type LocationHistoryStackProps = NativeStackScreenProps<
  HistoryStackParamList,
  'LocationHistory'
>

export type HistoryListStackProps = NativeStackScreenProps<
  HistoryStackParamList,
  'HistoryList'
>

const Stack = createNativeStackNavigator<HistoryStackParamList>()

const HistoryStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HistoryList"
        component={History}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LocationHistory"
        component={LocationInfo}
        options={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
    </Stack.Navigator>
  )
}

export default HistoryStackNavigator
