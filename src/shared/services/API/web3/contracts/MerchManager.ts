import Web3 from 'web3';
import { ContractInstance } from 'shared/connectors/web3/functions';
import config from 'shared/connectors/web3/config';

const MAX_PRIO_FEE = '50';

const merchManager = (network) => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.MERCH_MANAGER;
  const metadata = require('shared/connectors/web3/contracts/MerchandisingManager.json');

  const registerNewMerch = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any,
    maxPrioFee: string
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      // try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log('Getting gas....', contractAddress, account, payload);
        const gas = await contract.methods
          .registerNewMerchandisingToSell(
            payload.v_,
            payload.r_,
            payload.s_,
            // payload.collection,
            {},
            payload.uris,
            payload.prices,
            payload.totalSupplies,
            payload.deadline,
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
          .registerNewMerchandisingToSell(
            payload.v_,
            payload.r_,
            payload.s_,
            payload.collection,
            payload.uris,
            payload.prices,
            payload.totalSupplies,
            payload.deadline,
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
      // } catch (e) {
      //   console.log(e);
      //   resolve(null);
      // }
    });
  };

  const registerMerch = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any,
    maxPrioFee: string
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log('Getting gas....', contractAddress, account, payload);
        const gas = await contract.methods
          .registerMerchandisingToSell(
            payload.uris,
            payload.prices,
            payload.totalSupplies,
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
          .registerMerchandisingToSell(
            payload.uris,
            payload.prices,
            payload.totalSupplies,
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
    registerNewMerch,
    registerMerch,
  };
};

export default merchManager;
