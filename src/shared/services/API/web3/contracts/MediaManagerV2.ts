import Web3 from 'web3';
import { ContractInstance } from 'shared/connectors/web3/functions';
import config from 'shared/connectors/web3/config';

const MAX_PRIO_FEE = '50';

const mediaManagerV2 = (network) => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.MEDIA_MANAGER_V2;
  const metadata = require('shared/connectors/web3/contracts/MediaManagerV2.json');

  const buyMediaEdition = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any,
    maxPrioFee: string
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log('Getting gas....');
        const gas = await contract.methods
          .buyMediaEdition(
            payload.podId,
            payload.mediaIndex,
            payload.editionIndex,
          )
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        //return success manually after 40 secs
        setInterval(function() {
          if(gas){
            console.log('hit')
            resolve({
              success: true,
              data: {
                hash: ''
              }
            });
          }
        }, 40000);
        const response = await contract.methods
          .buyMediaEdition(
            payload.podId,
            payload.mediaIndex,
            payload.editionIndex,
          )
          .send({
            from: account,
            gas: gas,
            maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, 'gwei')
          })
          .on('transactionHash', (hash) => {
            setHash(hash);
          });
        console.log('transaction succeed', response);
        resolve({
          success: true,
          data: {
            hash: response.transactionHash
          }
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  return {
    buyMediaEdition,
  };
};

export default mediaManagerV2;
