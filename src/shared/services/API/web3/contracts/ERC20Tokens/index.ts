// import usdt from "./USDT";
// import usdc from "./USDC";
// import eth from "./ETH";
// import dai from "./DAI";
import erc20_standard from './ERC20Standard';
import config from 'shared/connectors/web3/config';
import copyright from './COPYRIGHT';

const erc20 = (network) => {
  //   return {
  //     USDT: usdt(network),
  //     USDC: usdc(network),
  //     ETH: eth(network),
  //     TRAX: trax(network),
  //     DAI: dai(network),
  //   };
  let instance = {};
  Object.keys(config[network].TOKEN_ADDRESSES).forEach((token) => {
    instance[token] = erc20_standard(network, token);
  });
  instance['COPYRIGHT'] = copyright(network);
  return instance;
};

export default erc20;
