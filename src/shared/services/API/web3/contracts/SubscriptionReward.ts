import Web3 from 'web3';
import { ContractInstance } from 'shared/connectors/web3/functions';
import config from 'shared/connectors/web3/config';

const subscriptionReward = (network) => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.SubscriptionReward;

  const metadata = require('shared/connectors/web3/contracts/SubscriptionReward_Implementation.json');

  const claimAccruedReward = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { tokenId } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const gas = await contract.methods
          .claimAccruedReward(tokenId)
          .estimateGas({ from: account });

        const response = await contract.methods
          .claimAccruedReward(tokenId)
          .send({ from: account, gas })
          .on('transactionHash', (hash) => {
            setHash(hash);
          });

        console.log(response);
        resolve({
          success: true,
          data: {
            reward: response.events.AccruedRewardClaimed.returnValues.amount,
            hash: response.transactionHash
          }
        });
      } catch (e) {
        console.log(e);
        resolve({
          success: false
        });
      }
    });
  };

  return { claimAccruedReward };
};

export default subscriptionReward;
