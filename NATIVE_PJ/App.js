import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './redux/store';

import { NavigationContainer } from '@react-navigation/native';
import { Rout } from './router';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
          'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (appIsReady === false) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <View
          style={styles.container}
          onLayout={onLayoutRootView}>
          <Rout />
        </View>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backfaceVisibility: '#fff',
  },
});
