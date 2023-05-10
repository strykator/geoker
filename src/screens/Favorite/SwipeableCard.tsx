import React, {useRef} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Alert,
  I18nManager,
  Platform,
} from 'react-native'
import Animated, {FadeInDown} from 'react-native-reanimated'
import {RectButton} from 'react-native-gesture-handler'
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment'
import * as Linking from 'expo-linking'
import {fonts, fontSize, screenSize, colors} from '../../styles'
import Button from '../../components/Button'
import {IStorageItem} from '.'

const {fullHeight, fullWidth} = screenSize
const ICON_SIDE = fullWidth * 0.08

const AnimatedIcon = Animated.createAnimatedComponent(Icon)

interface ISwipeableCard {
  item: IStorageItem
  removeItem: Function
}

const SwipeableCard = ({item, removeItem}: ISwipeableCard) => {
  const swipeRef = useRef<Swipeable>(null)

  if (!item) {
    return <></>
  }

  const renderRightActions = () => {
    return (
      <RectButton style={styles.rightAction}>
        <AnimatedIcon
          name="delete-forever"
          size={ICON_SIDE}
          color={colors.snow}
          style={styles.actionIcon}
        />
      </RectButton>
    )
  }

  const close = () => {
    swipeRef.current?.close()
  }

  const navigate = (destination: {
    title: string
    latitude: number
    longitude: number
  }) => {
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='})
    const latLng = `${destination.latitude},${destination.longitude}`
    const label = destination.title
    const url =
      Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      }) || ''

    Linking.openURL(url)
  }

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={swipeRef}
        renderRightActions={renderRightActions}
        useNativeAnimations
        onSwipeableOpen={() => {
          Alert.alert('Are you sure?', '', [
            {
              text: 'Yes',
              onPress: () => {
                removeItem(item.timestamp)
              },
            },
            {
              text: 'No',
              onPress: () => close(),
            },
          ])
        }}>
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.container}>
          <View style={styles.left}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.locationText}>
              {`${item.latitude}, ${item.longitude}`}
            </Text>
            <Text style={styles.locationText}>{item.address}</Text>
            <Text style={styles.dateText}>
              {moment(item.timestamp).format('MM-DD-YYYY')}
            </Text>
          </View>
          <View style={styles.right}>
            <Button
              title="Navigate"
              onPress={() =>
                navigate({
                  title: item.title,
                  latitude: item.latitude,
                  longitude: item.longitude,
                })
              }
              style={styles.navigateBtn}
              textStyle={styles.btnText}
            />
          </View>
        </Animated.View>
      </Swipeable>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.sapphire,
    padding: fullWidth * 0.02,
    marginVertical: fullHeight * 0.01,
    width: fullWidth * 0.9,
    borderRadius: 5,
  },
  rightAction: {
    alignItems: 'center',
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    backgroundColor: colors.warning,
    width: '100%',
    marginVertical: fullHeight * 0.01,
    borderRadius: 5,
    justifyContent: 'flex-end',
  },
  actionIcon: {
    width: ICON_SIDE,
    marginHorizontal: fullWidth * 0.02,
    height: ICON_SIDE,
  },
  title: {
    fontSize: fontSize.s,
    fontFamily: fonts.bold,
    color: colors.snow,
  },
  left: {
    alignSelf: 'flex-start',
    marginLeft: fullWidth * 0.05,
  },
  right: {
    alignSelf: 'flex-end',
  },
  navigateBtn: {
    padding: 2,
    width: fullWidth * 0.2,
    backgroundColor: colors.snow,
  },
  btnText: {
    color: colors.sapphire,
  },
  locationText: {
    fontSize: fontSize.xs,
    fontFamily: fonts.lightItalic,
    color: colors.snow,
  },
  dateText: {
    fontSize: fontSize.xxs,
    fontFamily: fonts.extraLight,
    color: colors.snow,
  },
})

export default SwipeableCard
