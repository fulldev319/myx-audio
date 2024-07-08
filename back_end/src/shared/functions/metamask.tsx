declare const window: any;

const chainInfoMap = {
  137: {
    chainName: 'Polygon Mainnet',
    rpcUrls: ['https://rpc-mumbai.matic.today/'],
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    blockExplorerUrls: ['https://polygonscan.com/']
  },
  80001: {
    chainName: 'Mumbai Testnet',
    rpcUrls: ['https://rpc-mumbai.matic.today/'],
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    blockExplorerUrls: ['https://explorer-mumbai.maticvigil.com']
  },
  1: {
    chainName: 'Ethereum Mainnet',
    rpcUrls: ['https://main-light.eth.linkpool.io/'],
    nativeCurrency: {
      name: 'ETHEREUM',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorerUrls: ['https://etherscan.io/']
  },
  3: {
    chainName: 'Ropsten Testnet',
    rpcUrls: ['https://ropsten-light.eth.linkpool.io/'],
    nativeCurrency: {
      name: 'ETHEREUM',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorerUrls: ['https://ropsten.etherscan.io/']
  },
  4: {
    chainName: 'Rinkeby Testnet',
    rpcUrls: ['https://rinkeby-light.eth.linkpool.io/'],
    nativeCurrency: {
      name: 'ETHEREUM',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorerUrls: ['https://rinkeby.etherscan.io/']
  },
  56: {
    chainName: 'Binance Smart Chain',
    rpcUrls: [
      'https://bsc-dataseed.binance.org',
      'https://bsc-dataseed1.ninicoin.io',
      'https://bsc-dataseed1.defibit.io'
    ],
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    blockExplorerUrls: ['https://bscscan.com/']
  },
  97: {
    chainName: 'Binance Smart Chain Testnet',
    rpcUrls: [
      'https://data-seed-prebsc-1-s1.binance.org:8545',
      'https://data-seed-prebsc-2-s1.binance.org:8545',
      'https://data-seed-prebsc-1-s2.binance.org:8545'
    ],
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    blockExplorerUrls: ['https://testnet.bscscan.com/']
  }
};

export const switchNetwork = (chainId: number): Promise<any> => {
  return new Promise(async (resolve) => {
    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
      resolve(true);
    } catch (error) {
      if (error.code === 4092) {
        try {
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                ...chainInfoMap[chainId]
              }
            ]
          });
          resolve(true);
        } catch (error) {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    }
  });
};

export const getTokenBalances = async (chainId: number, address: string) => {
  try {
    const response = await fetch(
      `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`,
      {
        headers: {
          Authorization: 'Basic Y2tleV8zYzJkMzZlZGRhYTI0Y2FmYTY0ZDRiYWEyOWI6'
        }
      }
    );
    const json = response.json();

    return json;
  } catch (err) {
    console.log('fetching balance error: ' + err.message);
  }
  return [];
};
