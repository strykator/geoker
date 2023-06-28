import React from 'react'
import {View, Text, TouchableOpacity, Platform} from 'react-native'
import styled from 'styled-components'
import {colors, font, screenSize} from '../../styles'

const {fullWidth, fullHeight} = screenSize

type roundType = 'square' | 'round' | 'half'
type btnType = 'text' | 'filled' | 'outlined'
interface IButton {
  title: string
  onPress(): void
  children?: React.ReactNode
  bgColor?: string
  titleColor?: string
  disabled?: boolean
  elevated?: boolean
  width?: number
  height?: number
  roundness?: roundType
  type?: btnType
}

export default function Button({
  title,
  onPress,
  children,
  bgColor,
  titleColor,
  disabled,
  elevated,
  width,
  height,
  roundness = 'round',
  type = 'filled',
  ...props
}: IButton) {
  const renderContent = () => {
    return (
      <ContentContainer>
        <Title titleColor={titleColor} disabled={disabled}>
          {title}
        </Title>
      </ContentContainer>
    )
  }
  return (
    <Container
      activeOpacity={0.7}
      bgColor={bgColor}
      elevated={elevated}
      width={width}
      height={height}
      roundness={roundness}
      type={type}
      disabled={disabled}
      onPress={onPress}
      {...props}>
      {children ? children : renderContent()}
    </Container>
  )
}
const Container = styled(TouchableOpacity)<{
  bgColor?: string
  elevated?: boolean
  width?: number
  height?: number
  roundness: string
  type: string
  disabled?: boolean
}>`
  justify-content: center;
  align-items: center;
  background-color: ${({bgColor, disabled, type}) => {
    if (disabled) return colors.bgDisabled
    if (type !== 'filled') return 'transparent'
    return bgColor ? bgColor : colors.primary
  }};
  padding: ${fullWidth * 0.015}px ${fullWidth * 0.025}px;
  border-width: ${({type}) => (type === 'outlined' ? '1.3px' : '0px')};
  border-color: ${({type, bgColor}) => {
    if (type === 'outlined') return bgColor ? bgColor : colors.primary
    return 'transparent'
  }};
  border-radius: ${({roundness}) => {
    if (roundness === 'round') {
      return '5px'
    } else if (roundness === 'half') {
      return '50%'
    } else {
      return '0px'
    }
  }};
  width: ${({width}) => (width ? `${width}px` : 'auto')};
  height: ${({height}) => (height ? `${height}px` : 'auto')};
  ${({elevated}) =>
    elevated
      ? Platform.select({
          ios: `
      shadow-color: ${colors.black};
      shadow-offset: 0px 2px;
      shadow-opacity: 0.2;
      shadow-radius: 2px;
    `,
          android: `
      elevation: 2;
    `,
        })
      : null}
`
const ContentContainer = styled(View)`
  justify-content: center;
  align-items: center;
  background-color: transparent;
`
const Title = styled(Text)<{titleColor?: string; disabled?: boolean}>`
  color: ${({titleColor, disabled}) => {
    if (disabled) return colors.textDisabled
    return titleColor ? titleColor : colors.background
  }};
  font-size: ${font.size.xxxl}px;
  font-family: ${font.family.bold};
`
