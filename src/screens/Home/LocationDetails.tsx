import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {fonts, colors, screenSize} from '../../styles'
import {formatNumberDigits} from '../../utils/helpers'
import {type Ilocation} from './index'

const {fullHeight} = screenSize

export interface ILocationDetails {
  location: Ilocation | undefined | null
  distance: number | undefined | null
}

const LocationDetails = (props: ILocationDetails) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.text}>Heading</Text>
        <Text style={styles.text}>Longitude</Text>
        <Text style={styles.text}>Latitude</Text>
        <Text style={styles.text}>Distance</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.text}>{`${
          props.location?.coords?.heading || 0
        } degree`}</Text>
        <Text style={styles.text}>{`${
          props.location?.coords?.longitude || 0
        } degree`}</Text>
        <Text style={styles.text}>{`${
          props.location?.coords?.latitude || 0
        } degree`}</Text>
        <Text style={styles.text}>
          {formatNumberDigits(props.distance, 1)} miles
        </Text>
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
    width: '45%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  right: {
    width: '45%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  text: {
    fontFamily: fonts.mediumItalic,
  },
})

export default LocationDetails
