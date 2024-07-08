import Web3 from 'web3';
import { ContractInstance } from 'shared/connectors/polygon/functions';
import { BigNumber } from 'ethers';
import { toNDecimals } from 'shared/functions/web3';

const MAX_PRIO_FEE = '50';

const copyright = (network) => {
  const metadata = require('shared/connectors/web3/contracts/CopyrightToken.json');

  const approve = async (
    web3: Web3,
    account: string,
    token: string,
    address: string,
    amount: BigNumber,
    maxPrioFee: string
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const approveAmount = amount || toNDecimals(1, 30);

        const contract = ContractInstance(web3, metadata.abi, token);
        console.log('Getting gas....');
        const gas = await contract.methods
          .approve(address, approveAmount)
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        await contract.methods.approve(address, approveAmount).send({
          from: account,
          gas: gas,
          maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, 'gwei')
        });
        console.log('transaction succeed');
        resolve(true);
      } catch (e) {
        console.log(e);
        resolve(false);
      }
    });
  };

  const allowance = async (
    web3: Web3,
    token: string,
    payload: any
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const contract = ContractInstance(web3, metadata.abi, token);
        contract.methods
          .allowance(payload.owner, payload.spender)
          .call((err, result) => {
            if (err) {
              console.log(err);
              resolve(null);
            } else {
              console.log('transaction succeed ', result);
              resolve(result);
            }
          });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const balanceOf = async (
    web3: Web3,
    token: string,
    payload: any
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const contract = ContractInstance(web3, metadata.abi, token);
        contract.methods.balanceOf(payload.account).call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            console.log('transaction succeed ', result);
            resolve(result);
          }
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const decimals = async (web3: Web3, token: string): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const contract = ContractInstance(web3, metadata.abi, token);
        contract.methods.decimals().call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            console.log('transaction succeed ', result);
            resolve(result);
          }
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const combine = async (
    web3: Web3,
    account: string,
    token: string,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const contract = ContractInstance(web3, metadata.abi, token);
        console.log('Getting gas....');
        const gas = await contract.methods
          .combine(payload.amount, payload.uri)
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .combine(payload.amount, payload.uri)
          .send({ from: account, gas: gas })
          .on('transactionHash', (hash) => {
            setHash(hash);
          });
        console.log('transaction succeed');

        resolve({
          success: true,
          data: {
            tokenAddress: response.events.Combined.returnValues.nft,
            tokenId: response.events.Combined.returnValues.nftId
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

  const transfer = async (
    web3: Web3,
    account: string,
    token: string,
    address: string,
    amount: BigNumber,
    setHash: any
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const contract = ContractInstance(web3, metadata.abi, token);
        console.log('Getting gas....');
        const gas = await contract.methods
          .transfer(address, amount)
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        await contract.methods
          .transfer(address, amount)
          .send({ from: account, gas: gas })
          .on('transactionHash', (hash) => {
            setHash(hash);
          });
        console.log('transaction succeed');
        resolve(true);
      } catch (e) {
        console.log(e);
        resolve(false);
      }
    });
  };

  return { approve, allowance, balanceOf, decimals, combine, transfer };
};

export default copyright;
