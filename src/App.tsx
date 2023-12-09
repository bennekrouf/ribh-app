import React, {useRef} from 'react';
import {SafeAreaView, ScrollView, StatusBar} from 'react-native';
import {Header} from './components';
import {AccountProvider, ConnectionProvider} from './providers';
import {Wallet} from './screens';
import {Provider} from 'react-redux';
import AppNavigator from './navigations/AppNavigation';
import { configureStore } from '@reduxjs/toolkit'
import AppReducer from './reducers';

const store = configureStore({ reducer: AppReducer })

export const App = () => {
  // const scrollViewRef = useRef<null | ScrollView>(null);

  return (
    <Provider store={store}>
       <AccountProvider>
            <ConnectionProvider>
              <AppNavigator />
            </ConnectionProvider>
          </AccountProvider>
    </Provider>

    // <>
    //   <StatusBar barStyle="dark-content" />
    //   <Header />
    //   <SafeAreaView>
    //     <ScrollView
    //       ref={ref => (scrollViewRef.current = ref)}
    //       contentInsetAdjustmentBehavior="automatic">
          // <AccountProvider>
          //   <ConnectionProvider>
          //     <Wallet />
          //   </ConnectionProvider>
          // </AccountProvider>
    //     </ScrollView>
    //   </SafeAreaView>
    // </>
  );
};

export default App;
