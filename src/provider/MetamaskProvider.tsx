import React, { useEffect, useState } from 'react';
import { Injected } from './connectors';
import { useWeb3React } from '@web3-react/core';

function MetamaskProvider({ children }) {
  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork
  } = useWeb3React();
  const [isError, setIsError] = useState<boolean>(false);
  useEffect(() => {
    Injected.isAuthorized()
      .then((isAuthorized) => {
        if (isAuthorized && !networkActive && !networkError) {
          activateNetwork(Injected);
        }
      })
      .catch(() => {
        setIsError(true);
      });
  }, [activateNetwork, networkActive, networkError]);
  if (isError)
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        There is an issue connecting to Metamask provider. Please try reloading
        page
      </div>
    );
  return children;
}

export default MetamaskProvider;
