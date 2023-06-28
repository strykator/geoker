import React, {useRef} from 'react'
import {StyleSheet, View, Alert, I18nManager} from 'react-native'
import Animated, {FadeInDown} from 'react-native-reanimated'
import {RectButton} from 'react-native-gesture-handler'
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment'
import {font, screenSize, colors} from '../../styles'
import {IStorageData} from '../../utils/helpers'
import Button from '../../components/Button'
import Text from '../../components/Text'

const {fullHeight, fullWidth} = screenSize
const ICON_SIDE = fullWidth * 0.08
const titleFontFamily = font.family.medium
const valueFontFamily = font.family.light

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
            <Text title="Start:" fontFamily={titleFontFamily} />
            <Text title="Stop:" fontFamily={titleFontFamily} />
            <Text title="Total:" fontFamily={titleFontFamily} />
            <Text title="Distance:" fontFamily={titleFontFamily} />
            <Text title="Locations:" fontFamily={titleFontFamily} />
          </View>
          <View style={styles.right}>
            <Text
              title={moment(item.start).format('hh:mm:ss a')}
              fontFamily={valueFontFamily}
            />
            <Text
              title={moment(item.stop).format('hh:mm:ss a')}
              fontFamily={valueFontFamily}
            />
            <Text
              title={moment.utc(item.stop - item.start).format('HH:mm:ss')}
              fontFamily={valueFontFamily}
            />
            <Text
              title={`${item.mile.toFixed(1)} miles`}
              fontFamily={valueFontFamily}
            />
            <Button
              title="Show"
              onPress={() => showLocation()}
              width={fullWidth * 0.16}
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
  left: {
    alignItems: 'flex-start',
  },
  right: {
    alignItems: 'flex-end',
  },
})

export default SwipeableCard
