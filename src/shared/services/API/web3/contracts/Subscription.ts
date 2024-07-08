import Web3 from 'web3';
import { ContractInstance } from 'shared/connectors/web3/functions';
import config from 'shared/connectors/web3/config';

const subscription = (network) => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.Subscription;

  const metadata = require('shared/connectors/web3/contracts/Subscription_Implementation.json');

  const rewardContractAddress =
    config[network].CONTRACT_ADDRESSES.SubscriptionReward;

  const rewardMetadata = require('shared/connectors/web3/contracts/SubscriptionReward_Implementation.json');

  const whatDoIGet = async (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { amount } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const response = await contract.methods.whatDoIGet(amount).call();

        resolve({
          hours: +response.hoursOfSubscription,
          reward: response.traxReward
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const subscribe = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { amount } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        const rewardContract = ContractInstance(
          web3,
          rewardMetadata.abi,
          rewardContractAddress
        );

        const gas = await contract.methods
          .subscribe(amount)
          .estimateGas({ from: account });

        const response = await contract.methods
          .subscribe(amount)
          .send({ from: account, gas })
          .on('transactionHash', (hash) => {
            setHash(hash);
          });

        const transferEvents = await rewardContract.getPastEvents('Transfer', {
          fromBlock: response.blockNumber,
          toBlock: response.blockNumber
        });

        resolve({
          success: true,
          data: {
            hoursOfSubscription:
              response.events.Subscribed.returnValues.hoursOfSubscription,
            traxReward: response.events.Subscribed.returnValues.traxReward,
            hash: response.transactionHash,
            tokenId: transferEvents.length
              ? transferEvents[0].returnValues.tokenId
              : null
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

  return {
    whatDoIGet,
    subscribe
  };
};

export default subscription;
