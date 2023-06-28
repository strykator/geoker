import React, {useState, useEffect} from 'react'
import {StyleSheet} from 'react-native'
import Animated, {
  Easing,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'
import {fonts, font, fontSize, screenSize, colors} from '../../styles'
import {formatNumberDigits} from '../../utils/helpers'
import Text from '../../components/Text'

const {fullWidth} = screenSize
const speedometerSide = fullWidth * 0.3

interface ISpeedometer {
  speed: number | undefined
}

const Speedometer = ({speed = 0}: ISpeedometer) => {
  const [, setUpdate] = useState<number>(0)
  const animatedValue = useSharedValue(speed)

  useEffect(() => {
    animatedValue.value = withTiming(speed, {
      duration: 500,
      easing: Easing.linear,
    })
    setUpdate(speed)
  }, [speed])

  const animatedStyles = useAnimatedStyle(() => {
    let backgroundColor = colors.disabled
    if (speed >= 1 && speed <= 45) {
      backgroundColor = colors.success
    } else if (speed > 45 && speed <= 65) {
      backgroundColor = colors.tomato
    } else if (speed > 65) {
      backgroundColor = colors.warning
    }

    return {
      width: speedometerSide + animatedValue.value / 1.1,
      height: speedometerSide + animatedValue.value / 1.1,
      borderRadius: speedometerSide / 2 + animatedValue.value / 1.1,
      backgroundColor,
    }
  })

  return (
    <Animated.View style={[styles.speedometer, animatedStyles]}>
      <Text
        title={formatNumberDigits(speed, 0)}
        fontFamily={font.family.bold}
        fontSize={50}
      />
      <Text title="mph" fontFamily={font.family.bold} fontSize={font.size.xl} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  speedometer: {
    width: speedometerSide,
    height: speedometerSide,
    backgroundColor: colors.disabled,
    borderRadius: speedometerSide / 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: screenSize.fullHeight * 0.05,
  },
  speedometerText: {
    fontSize: fontSize.xxxl,
    fontFamily: fonts.extraBold,
  },
  speedometerUnits: {
    fontSize: fontSize.l,
    fontFamily: fonts.extraBold,
  },
})

export default Speedometer
