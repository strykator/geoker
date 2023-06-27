import React, {useEffect, useCallback} from 'react'
import {SafeAreaView, StyleSheet} from 'react-native'
import BottomTabNavigator from './src/navigators/BottomTabNavigator'
import {ActionSheetProvider} from '@expo/react-native-action-sheet'
import Toast, {BaseToast} from 'react-native-toast-message'
import {useFonts} from 'expo-font'
import {StatusBar} from 'expo-status-bar'
import {Provider} from 'react-redux'
import {store} from './src/store'
//import SplashScreen from 'react-native-splash-screen'
import {colors, fontSize, fonts, screenSize} from './src/styles'

const text1Style = {
  fontSize: fontSize.s,
  fontFamily: fonts.light,
}
const text2Style = {
  fontSize: fontSize.xs,
  fontFamily: fonts.light,
}

const toastConfig = {
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.primary,
        height: screenSize.fullHeight * 0.2,
      }}
      text1Style={text1Style}
      text2Style={text2Style}
      text1NumberOfLines={0}
      text2NumberOfLines={0}
    />
  ),
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.success,
        height: screenSize.fullHeight * 0.2,
      }}
      text1Style={text1Style}
      text2Style={text2Style}
      text1NumberOfLines={0}
      text2NumberOfLines={0}
    />
  ),
  error: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.warning,
        height: screenSize.fullHeight * 0.2,
      }}
      text1Style={text1Style}
      text2Style={text2Style}
      text1NumberOfLines={0}
      text2NumberOfLines={0}
    />
  ),
}

const App = () => {
  const [fontsLoaded] = useFonts({
    'Trirong-Thin': require('./assets/fonts/Trirong-Thin.ttf'),
    'Trirong-ThinItalic': require('./assets/fonts/Trirong-ThinItalic.ttf'),
    'Trirong-ExtraLight': require('./assets/fonts/Trirong-ExtraLight.ttf'),
    'Trirong-ExtraLightItalic': require('./assets/fonts/Trirong-ExtraLightItalic.ttf'),
    'Trirong-Light': require('./assets/fonts/Trirong-Light.ttf'),
    'Trirong-LightItalic': require('./assets/fonts/Trirong-LightItalic.ttf'),
    'Trirong-Regular': require('./assets/fonts/Trirong-Regular.ttf'),
    'Trirong-Medium': require('./assets/fonts/Trirong-Medium.ttf'),
    'Trirong-MediumItalic': require('./assets/fonts/Trirong-MediumItalic.ttf'),
    'Trirong-SemiBold': require('./assets/fonts/Trirong-SemiBold.ttf'),
    'Trirong-SemiBoldItalic': require('./assets/fonts/Trirong-SemiBoldItalic.ttf'),
    'Trirong-Bold': require('./assets/fonts/Trirong-Bold.ttf'),
    'Trirong-BoldItalic': require('./assets/fonts/Trirong-BoldItalic.ttf'),
    'Trirong-ExtraBold': require('./assets/fonts/Trirong-ExtraBold.ttf'),
    'Trirong-ExtraBoldItalic': require('./assets/fonts/Trirong-ExtraBoldItalic.ttf'),
    'Trirong-Black': require('./assets/fonts/Trirong-Black.ttf'),
    'Trirong-BlackItalic': require('./assets/fonts/Trirong-BlackItalic.ttf'),
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      //await SplashScreen.hideAsync();
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar />
      <Provider store={store}>
        <ActionSheetProvider>
          <>
            <BottomTabNavigator />
            <Toast config={toastConfig} />
          </>
        </ActionSheetProvider>
      </Provider>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
})

export default App
