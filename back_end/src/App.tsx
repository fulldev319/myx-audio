import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { Web3ReactProvider as Web3Provider } from '@web3-react/core';
import { UseWalletProvider as WalletProvider } from 'use-wallet';
import { CookiesProvider } from 'react-cookie';
import { store } from 'store/store';
import Auth from 'components/Login/Auth';
import getLibrary from 'shared/functions/getLibrary';
import Interceptor from 'store/interceptor/interceptor';
import { walletConnect, chainId } from 'shared/constants/constants';
import { SnackbarProvider } from 'notistack';
import MetamaskProvider from './provider/MetamaskProvider';
import { MaxPrioFeeContextProvider } from 'shared/contexts/MaxPrioFeeContext';

Interceptor.interceptor(store);

const App = () => {
  return (
    <WalletProvider chainId={chainId} connectors={walletConnect}>
      <Web3Provider getLibrary={getLibrary}>
        <MetamaskProvider>
          <StoreProvider store={store}>
            <SnackbarProvider maxSnack={3}>
              <MaxPrioFeeContextProvider>
                <CookiesProvider>
                  <Auth />
                </CookiesProvider>
              </MaxPrioFeeContextProvider>
            </SnackbarProvider>
          </StoreProvider>
        </MetamaskProvider>
      </Web3Provider>
    </WalletProvider>
  );
};

export default process.env.NODE_ENV === 'development' ? hot(App) : App;
