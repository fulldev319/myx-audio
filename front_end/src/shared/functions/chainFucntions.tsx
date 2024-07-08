export const getLoanChainImageUrl = (chain, blockchainNetwork) => {
  if (chain) {
    return require(`assets/tokenImages/${chain}.webp`);
  } else if (blockchainNetwork.includes('Polygon')) {
    return require('assets/tokenImages/POLYGON.webp');
  } else if (blockchainNetwork.includes('Ethereum')) {
    return require('assets/tokenImages/ETH.webp');
  }
  return require('assets/tokenImages/POLYGON.webp');
};

export const getChainImageUrl = (blockchain) => {
  if (!blockchain) {
    return require('assets/tokenImages/POLYGON.webp');
  }
  if (blockchain.toLowerCase().includes('polygon')) {
    return require('assets/tokenImages/POLYGON.webp');
  } else if (blockchain.toLowerCase().includes('ethereum')) {
    return require('assets/tokenImages/ETH.webp');
  } else if (blockchain.toLowerCase().includes('wax')) {
    return require('assets/tokenImages/WAX.webp');
  } else if (blockchain.toLowerCase().includes('hicetnunc')) {
    return require('assets/tokenImages/HICETNUNC.webp');
  } else if (blockchain.toLowerCase().includes('binance')) {
    return require('assets/tokenImages/BNB.webp');
  }
  return require('assets/tokenImages/POLYGON.webp');
};
