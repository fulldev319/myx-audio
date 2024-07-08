import Web3 from 'web3';
import { ContractInstance } from 'shared/connectors/web3/functions';

const stakingERC721 = (network) => {
  const metadata = require('shared/connectors/web3/contracts/StakingERC721.json');

  const getPastTotalSupply = async (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { contractAddress, blockNumber } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const response = await contract.methods
          .getPastTotalSupply(blockNumber)
          .call();

        resolve(response);
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  return { getPastTotalSupply };
};

export default stakingERC721;
