import { ethers } from 'ethers';

export const simpleRpcProvider = new ethers.providers.JsonRpcProvider(
  'https://data-seed-prebsc-1-s1.binance.org:8545/'
);

export default null;
