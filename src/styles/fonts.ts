import {screenSize} from './size'
import {PixelRatio} from 'react-native'

const getResponsiveFontSize = (baseFontSize: number) => {
  const {fullWidth, fullHeight} = screenSize
  // pixel density scale
  const fontScaleFactor = PixelRatio.getFontScale()
  // Use iPhone 8 as base size which is 375 x 667
  const baseWidth = 375
  const baseHeight = 667
  // dimension scale
  const scaleWidth = fullWidth / baseWidth
  const scaleHeight = fullHeight / baseHeight
  const dimensionScale = Math.min(scaleWidth, scaleHeight)

  const responsiveFontSize = baseFontSize * dimensionScale * fontScaleFactor
  return responsiveFontSize
}

export const font = {
  size: {
    xxs: getResponsiveFontSize(10),
    xs: getResponsiveFontSize(12),
    s: getResponsiveFontSize(14),
    m: getResponsiveFontSize(16),
    l: getResponsiveFontSize(18),
    xl: getResponsiveFontSize(20),
    xxl: getResponsiveFontSize(22),
    xxxl: getResponsiveFontSize(24),
  },
  family: {
    thin: 'Trirong-Thin',
    thinItalic: 'Trirong-ThinItalic',
    extraLight: 'Trirong-ExtraLight',
    extraLightItalic: 'Trirong-ExtraLightItalic',
    light: 'Trirong-Light',
    lightItalic: 'Trirong-LightItalic',
    regular: 'Trirong-Regular',
    medium: 'Trirong-Medium',
    mediumItalic: 'Trirong-MediumItalic',
    semiBold: 'Trirong-SemiBold',
    semiBoldItalic: 'Trirong-SemiBoldItalic',
    bold: 'Trirong-Bold',
    boldItalic: 'Trirong-BoldItalic',
    extraBold: 'Trirong-ExtraBold',
    extraBoldItalic: 'Trirong-ExtraBoldItalic',
    black: 'Trirong-Black',
    blackItalic: 'Trirong-BlackItalic',
  },
}

export const fonts = {
  thin: 'Trirong-Thin',
  thinItalic: 'Trirong-ThinItalic',
  extraLight: 'Trirong-ExtraLight',
  extraLightItalic: 'Trirong-ExtraLightItalic',
  light: 'Trirong-Light',
  lightItalic: 'Trirong-LightItalic',
  regular: 'Trirong-Regular',
  medium: 'Trirong-Medium',
  mediumItalic: 'Trirong-MediumItalic',
  semiBold: 'Trirong-SemiBold',
  semiBoldItalic: 'Trirong-SemiBoldItalic',
  bold: 'Trirong-Bold',
  boldItalic: 'Trirong-BoldItalic',
  extraBold: 'Trirong-ExtraBold',
  extraBoldItalic: 'Trirong-ExtraBoldItalic',
  black: 'Trirong-Black',
  blackItalic: 'Trirong-BlackItalic',
}
