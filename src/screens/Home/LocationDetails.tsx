import React from 'react'
import {View, StyleSheet} from 'react-native'
import {colors, screenSize, font} from '../../styles'
import {formatNumberDigits} from '../../utils/helpers'
import {type Ilocation} from './index'
import {calculateDirection} from './utils'
import Text from '../../components/Text'

const {fullHeight} = screenSize
const titleFontFamily = font.family.medium
const valueFontFamily = font.family.light

export interface ILocationDetails {
  location: Ilocation | undefined | null
  distance: number | undefined | null
}

const LocationDetails = (props: ILocationDetails) => {
  const getHeading = () => {
    return `${props.location?.coords?.heading || 0} degree ${calculateDirection(
      props.location?.coords?.heading,
    )}`
  }
  const getLatitude = () =>
    `${formatNumberDigits(props.location?.coords?.latitude, 5) || 0} degree`
  const getLongitude = () =>
    `${formatNumberDigits(props.location?.coords?.longitude, 5) || 0} degree`
  const getDistance = () => `${formatNumberDigits(props.distance, 1)} miles`
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text title="Heading" fontFamily={titleFontFamily} />
        <Text title="Latitude" fontFamily={titleFontFamily} />
        <Text title="Longitude" fontFamily={titleFontFamily} />
        <Text title="Distance" fontFamily={titleFontFamily} />
      </View>
      <View style={styles.right}>
        <Text title={getHeading()} fontFamily={valueFontFamily} />
        <Text title={getLatitude()} fontFamily={valueFontFamily} />
        <Text title={getLongitude()} fontFamily={valueFontFamily} />
        <Text title={getDistance()} fontFamily={valueFontFamily} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.warmLight,
    borderRadius: 5,
    paddingVertical: fullHeight * 0.04,
  },
  left: {
    width: '35%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  right: {
    width: '55%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
})

export default LocationDetails
