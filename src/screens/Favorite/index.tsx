import React, {useCallback, useState} from 'react'
import {View, Text, FlatList, StyleSheet, ListRenderItem} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'
import {useFocusEffect} from '@react-navigation/native'
import {TOAST_TYPES, STORAGE_FAVORITE_KEY} from '../../utils/constants'
import {screenSize, fonts, fontSize} from '../../styles'
import SwipeableCard from './SwipeableCard'

const {fullHeight} = screenSize

export interface IStorageItem {
  title: string
  latitude: number
  longitude: number
  address: string
  timestamp: number
}

const Favorite = () => {
  const [data, setData] = useState([])

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
        text1: 'Error accessing favorite places',
        text2: 'Please try again later',
        topOffset: fullHeight * 0.03,
        visibilityTime: 5000,
      })
    }
  }

  const removeItem = async (id: number) => {
    const temp = await getFavoriteData()
    const updatedData = temp.filter((item: any) => item.timestamp !== id)
    setData(updatedData)
    try {
      const jsonValue = JSON.stringify(updatedData)
      await AsyncStorage.setItem(STORAGE_FAVORITE_KEY, jsonValue)
    } catch (e) {
      // error reading value
      Toast.show({
        type: TOAST_TYPES.ERROR,
        text1: 'Error deleting favorite place',
        text2: 'Please try again later',
        topOffset: fullHeight * 0.03,
        visibilityTime: 5000,
      })
    }
  }

  useFocusEffect(
    useCallback(() => {
      const updateData = async () => {
        const storageData = await getFavoriteData()
        setData(storageData)
      }
      updateData()
    }, []),
  )

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No Favorite Place Available</Text>
      </View>
    )
  }

  const renderItem: ListRenderItem<IStorageItem> = ({item}) => (
    <SwipeableCard key={item.timestamp} item={item} removeItem={removeItem} />
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item: IStorageItem) => `${item.timestamp}`}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.s,
    fontFamily: fonts.mediumItalic,
  },
})

export default Favorite
