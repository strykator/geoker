import React from 'react'
import {Text, StyleSheet, TouchableOpacity} from 'react-native'
import {fonts, colors} from '../../styles'

const Button = (props: any) => {
  const {onPress, title, style, textStyle, disabled} = props

  const backgroundStyle = disabled
    ? {backgroundColor: 'lightgrey'}
    : {backgroundColor: style?.backgroundColor || colors.primary}

  const disbaledTextStyle = disabled
    ? {color: colors.slate}
    : {color: textStyle?.color ? textStyle?.color : 'black'}

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, {...style}, backgroundStyle]}>
      <Text style={[styles.text, {...textStyle}, disbaledTextStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  text: {
    fontFamily: fonts.medium,
  },
})

export default Button
