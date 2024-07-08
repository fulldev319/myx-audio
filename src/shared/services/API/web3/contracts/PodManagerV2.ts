import Web3 from 'web3';
import { ContractInstance } from 'shared/connectors/web3/functions';
import config from 'shared/connectors/web3/config';
import api from '../api';
import { toDecimals, toNDecimals } from 'shared/functions/web3';
import { useMaxPrioFee } from 'shared/contexts/MaxPrioFeeContext';

const MAX_PRIO_FEE = '50';

export const POD_STATUS = {
  FUNDING_STATE: 'FUNDING_STATE',
  FUNDED: 'FUDED',
  DISPOSED: 'DISPOSED'
};

const podManagerV2 = (network) => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.POD_MANAGER_V2;
  const copyrightTokenAddress =
    config[network].CONTRACT_ADDRESSES.COPYRIGHT_TOKEN;

  const metadata = require('shared/connectors/web3/contracts/PodManagerV2.json');
  const erc721Metadata = require('shared/connectors/web3/contracts/ERC721WithRoyalty.json');

  const registerPodProposal = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any,
    maxPrioFee: string
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { PodDefinition, MediaWithRoyalty } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        console.log(
          PodDefinition,
          MediaWithRoyalty,
          contract,
          web3.currentProvider
        );

        console.log('Getting gas....');
        const gas = await contract.methods
          .proposeNewPod(PodDefinition, MediaWithRoyalty)
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .proposeNewPod(PodDefinition, MediaWithRoyalty)
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
            podId: response.events.PodRegistered?.returnValues?.podId,
            hash: response.transactionHash
          }
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const votePodProposal = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any,
    maxPrioFee: string
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { proposalId, ownerIndex, support } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        console.log(proposalId, ownerIndex, support, contract);

        console.log('Getting gas....');
        const gas = await contract.methods
          .votePodProposal(proposalId, ownerIndex, support)
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .votePodProposal(proposalId, ownerIndex, support)
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
    registerPodProposal,
    votePodProposal
  };
};

export default podManagerV2;
