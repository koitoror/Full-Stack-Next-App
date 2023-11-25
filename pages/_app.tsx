import React from 'react';
import '../styles/globals.less';
import Layout from '../components/layout';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '../store';
import '../firebase';

// Explicitly specify the types for Component and pageProps
interface AppProps {
  Component: React.ComponentType<any>;
  pageProps: any;
}

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PersistGate>
    </Provider>
  );
};

export default MyApp;
