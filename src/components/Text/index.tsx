import React from 'react'
import {Text as RText} from 'react-native'
import styled from 'styled-components'
import {colors, font} from '../../styles'

interface IText {
  title: string
  titleColor?: string
  fontSize?: number
  fontFamily?: string
  children?: React.ReactNode
}

export default function Text({
  title,
  titleColor,
  fontSize,
  fontFamily,
  children,
  ...props
}: IText) {
  return (
    <StyledText
      titleColor={titleColor}
      fontSize={fontSize}
      fontFamily={fontFamily}
      {...props}>
      {children ? children : title}
    </StyledText>
  )
}

const StyledText = styled(RText)<{
  titleColor?: string
  fontSize?: number
  fontFamily?: string
}>`
  color: ${({titleColor}) => (titleColor ? titleColor : colors.text)};
  font-size: ${({fontSize}) =>
    fontSize ? `${fontSize}px` : `${font.size.s}px`};
  font-family: ${({fontFamily}) =>
    fontFamily ? fontFamily : font.family.regular};
`
