import React, {useRef} from 'react'
import {StyleSheet, View, Text, Alert, I18nManager} from 'react-native'
import Animated, {FadeInDown} from 'react-native-reanimated'
import {RectButton} from 'react-native-gesture-handler'
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment'
import {fonts, fontSize, screenSize, colors} from '../../styles'
import {IStorageData} from '../../utils/helpers'
import Button from '../../components/Button'

const {fullHeight, fullWidth} = screenSize
const ICON_SIDE = fullWidth * 0.08

const AnimatedIcon = Animated.createAnimatedComponent(Icon)

interface ISwipeableCard {
  item: IStorageData | undefined
  removeItem: Function
  showLocation: Function
}

const SwipeableCard = ({item, removeItem, showLocation}: ISwipeableCard) => {
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
                removeItem(item.start)
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
            <Text style={styles.title}>Start:</Text>
            <Text style={styles.title}>Stop:</Text>
            <Text style={styles.title}>Total:</Text>
            <Text style={styles.title}>Distance:</Text>
            <Text style={styles.title}>Locations:</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.title}>
              {moment(item.start).format('hh:mm:ss a')}
            </Text>
            <Text style={styles.title}>
              {moment(item.stop).format('hh:mm:ss a')}
            </Text>
            <Text style={styles.title}>
              {moment.utc(item.stop - item.start).format('HH:mm:ss')}
            </Text>
            <Text style={styles.title}>{item.mile.toFixed(1)} miles</Text>
            <Button
              title="Show"
              onPress={() => showLocation()}
              width={fullWidth * 0.2}
              bgColor={colors.sapphire}
            />
          </View>
        </Animated.View>
      </Swipeable>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.card,
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
    fontFamily: fonts.mediumItalic,
  },
  left: {
    alignItems: 'flex-start',
  },
  right: {
    alignItems: 'flex-end',
  },
})

export default SwipeableCard
