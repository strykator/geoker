import {Dimensions} from 'react-native'

const WINDOW_WIDTH = Dimensions.get('window').width
const WINDOW_HEIGHT = Dimensions.get('window').width

export const screenSize = {
  fullWidth: WINDOW_WIDTH,
  fullHeight: WINDOW_HEIGHT,
}

export const fontSize = {
  xxs: WINDOW_WIDTH * 0.03,
  xs: WINDOW_WIDTH * 0.035,
  s: WINDOW_WIDTH * 0.04,
  m: WINDOW_WIDTH * 0.045,
  l: WINDOW_WIDTH * 0.05,
  xl: WINDOW_WIDTH * 0.06,
  xxl: WINDOW_WIDTH * 0.07,
  xxxl: WINDOW_WIDTH * 0.08,
}
