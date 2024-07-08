import Web3 from 'web3';
import { ContractInstance } from 'shared/connectors/web3/functions';
import api from '../api';
import { toNDecimals } from 'shared/functions/web3';

const MAX_PRIO_FEE = '50';

const distributionManager = (network) => {
  const metadata = require('shared/connectors/web3/contracts/DistributionManager.json');

  const stakeCopyrightFractions = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any,
    maxPrioFee: string
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { amount, contractAddress, token } = payload;

        const copyrightDecimals = await api(network).Erc20[
          'COPYRIGHT'
        ].decimals(web3, token);

        const approve = await api(network).Erc20['COPYRIGHT'].approve(
          web3,
          account,
          token,
          contractAddress,
          toNDecimals(amount, copyrightDecimals),
          MAX_PRIO_FEE
        );

        if (!approve) {
          resolve({ success: false });
        }

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log('Getting gas....');
        const gas = await contract.methods
          .stakeCopyrightFractions(toNDecimals(amount, copyrightDecimals))
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .stakeCopyrightFractions(toNDecimals(amount, copyrightDecimals))
          .send({
            from: account,
            gas,
            maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, 'gwei')
          })
          .on('transactionHash', (hash) => {
            setHash(hash);
          });
        console.log('transaction succeed');
        resolve({
          success: true,
          data: {
            amount,
            tokenId: response.events.CopyrightStaked.returnValues.tokenId,
            staker: response.events.CopyrightStaked.returnValues.staker
          }
        });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const unstakeCopyrightFractions = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any,
    maxPrioFee: string
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { amount, contractAddress, token, id } = payload;

        const copyrightDecimals = await api(network).Erc20[
          'COPYRIGHT'
        ].decimals(web3, token);

        const approve = await api(network).Erc20['COPYRIGHT'].approve(
          web3,
          account,
          token,
          contractAddress,
          toNDecimals(amount, copyrightDecimals),
          MAX_PRIO_FEE
        );

        if (!approve) {
          resolve({ success: false });
        }

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log('Getting gas....');
        const gas = await contract.methods
          .unstakeCopyrightFractions(id, toNDecimals(amount, copyrightDecimals))
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .unstakeCopyrightFractions(id, toNDecimals(amount, copyrightDecimals))
          .send({
            from: account,
            gas: gas,
            maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, 'gwei')
          })
          .on('transactionHash', (hash) => {
            setHash(hash);
          });
        console.log('transaction succeed');
        resolve({
          success: true,
          data: {
            amount,
            tokenId: response.events.CopyrightUnstaked.returnValues.tokenId,
            destination:
              response.events.CopyrightUnstaked.returnValues.destination
          }
        });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const stakeCopyrightNFT = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any,
    maxPrioFee: string
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { contractAddress, tokenId } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log('Getting gas....');
        const gas = await contract.methods
          .stakeCopyrightNFT(tokenId)
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .stakeCopyrightNFT(tokenId)
          .send({
            from: account,
            gas: gas,
            maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, 'gwei')
          })
          .on('transactionHash', (hash) => {
            setHash(hash);
          });
        console.log('transaction succeed');
        resolve({
          success: true,
          data: {
            tokenId: response.events.CopyrightStaked.returnValues.tokenId
          }
        });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const unstakeCopyrightNFT = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any,
    maxPrioFee: string
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { contractAddress, id } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log('Getting gas....');
        const gas = await contract.methods
          .unstakeCopyrightNFT(id)
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .unstakeCopyrightNFT(id)
          .send({
            from: account,
            gas: gas,
            maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, 'gwei')
          })
          .on('transactionHash', (hash) => {
            setHash(hash);
          });
        console.log('transaction succeed');
        resolve({
          success: true
        });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const claimCopyrightFractionRewards = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any,
    maxPrioFee: string
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { id, contractAddress } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log('Getting gas....');
        const gas = await contract.methods
          .claimCopyrightFractionRewards(id)
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .claimCopyrightFractionRewards(id)
          .send({
            from: account,
            gas: gas,
            maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, 'gwei')
          })
          .on('transactionHash', (hash) => {
            setHash(hash);
          });
        console.log('transaction succeed');
        resolve({
          success: true,
          data: {
            reward: response.events.RewardsClaimed.returnValues.reward
          }
        });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const getCopyrightRewards = async (
    web3: Web3,
    payload: any
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { id, contractAddress } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const response = await contract.methods.getCopyrightRewards(id).call();

        if (response) {
          resolve(response);
        } else {
          response(null);
        }
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const getCopyrightStakingPositions = async (
    web3: Web3,
    account: string,
    payload: any
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { contractAddress } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const response = await contract.methods
          .getCopyrightStakingPositions(account)
          .call();

        if (response) {
          resolve(response);
        } else {
          response(null);
        }
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const stakingGovernance = async (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { contractAddress } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const response = await contract.methods.stakingGovernance().call();

        if (response) {
          resolve(response);
        } else {
          response(null);
        }
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const stakingERC721 = async (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { contractAddress } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const response = await contract.methods
          .copyrightFractionStakingNFT()
          .call();

        if (response) {
          resolve(response);
        } else {
          response(null);
        }
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  return {
    stakeCopyrightFractions,
    unstakeCopyrightFractions,
    stakeCopyrightNFT,
    unstakeCopyrightNFT,
    claimCopyrightFractionRewards,
    getCopyrightRewards,
    getCopyrightStakingPositions,
    stakingGovernance,
    stakingERC721
  };
};

export default distributionManager;
