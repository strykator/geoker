import React, {useCallback, useState} from 'react'
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useFocusEffect} from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import SwipeableCard from './SwipeableCard'
import {useActionSheet} from '@expo/react-native-action-sheet'
import {fonts, fontSize, screenSize, colors} from '../../styles'
import {STORAGE_HISTORY_KEY, TOAST_TYPES} from '../../utils/constants'
import {formatData, IData, IStorageData} from '../../utils/helpers'
import {HistoryListStackProps} from '../../navigators/HistoryStackNavigator'

const {fullHeight, fullWidth} = screenSize
const FLOAT_BUTTON_SIDE = fullWidth * 0.14

const History = ({navigation}: HistoryListStackProps) => {
  const [data, setData] = useState<IData[]>([])
  const {showActionSheetWithOptions} = useActionSheet()

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
        text1: 'Error accessing the trip history',
        text2: 'Please try again later',
        topOffset: fullHeight * 0.03,
        visibilityTime: 5000,
      })
    }
  }

  const removeData = () => {
    const deleteData = async () => {
      try {
        await AsyncStorage.removeItem(STORAGE_HISTORY_KEY)
        setData([])
      } catch (error) {
        // handle error
        Toast.show({
          type: TOAST_TYPES.ERROR,
          text1: 'Could not delete the trip history',
          text2: 'Please try again later',
          topOffset: fullHeight * 0.03,
          visibilityTime: 5000,
        })
      }
    }

    const options = ['Delete All', 'Cancel']
    const destructiveButtonIndex = 0
    const cancelButtonIndex = 1
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        showSeparators: true,
      },
      (selectedIndex: number | undefined) => {
        switch (selectedIndex) {
          case destructiveButtonIndex:
            deleteData()
            break
          case cancelButtonIndex:
            // Canceled
            break
          default:
          // Do nothing
        }
      },
    )
  }

  const removeItem = async (start: number) => {
    const temp = await getData()
    const updatedData = temp.filter((item: any) => item.start !== start)
    setData(formatData(updatedData))
    try {
      const jsonValue = JSON.stringify(updatedData)
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

  useFocusEffect(
    useCallback(() => {
      const updateData = async () => {
        const storageData = await getData()
        setData(formatData(storageData))
      }
      updateData()
    }, []),
  )

  if (!data.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No History Available</Text>
      </View>
    )
  }

  const showLocation = (item: IStorageData) => {
    const {startLocation, stopLocation} = item
    navigation.navigate('LocationHistory', {
      startLocation,
      stopLocation,
    })
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={data}
        showsVerticalScrollIndicator={true}
        keyExtractor={(item, index) => item.start.toString() + index}
        renderItem={({item}) => (
          <SwipeableCard
            key={item.start}
            item={item}
            removeItem={removeItem}
            showLocation={() => showLocation(item)}
          />
        )}
        renderSectionHeader={({section: {title}}) => (
          <View style={styles.headerContainer}>
            <Text style={styles.header}>{title}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.floatingBtn} onPress={removeData}>
        <Text style={styles.btnText}>Clear</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingTop: fullHeight * 0.01,
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: fontSize.l,
    fontFamily: fonts.medium,
  },
  title: {
    fontSize: fontSize.s,
    fontFamily: fonts.mediumItalic,
  },
  floatingBtn: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: FLOAT_BUTTON_SIDE,
    height: FLOAT_BUTTON_SIDE,
    borderRadius: FLOAT_BUTTON_SIDE / 2,
    backgroundColor: colors.warning,
    bottom: fullHeight * 0.05,
    right: fullWidth * 0.05,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: FLOAT_BUTTON_SIDE / 2,
    elevation: 2,
  },
  btnText: {
    color: colors.background,
    fontSize: fontSize.s,
    fontFamily: fonts.mediumItalic,
  },
})

export default History
