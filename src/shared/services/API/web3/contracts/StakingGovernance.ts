import Web3 from 'web3';
import { ContractInstance } from 'shared/connectors/web3/functions';
import config from 'shared/connectors/web3/config';

const MAX_PRIO_FEE = '50';

const stakingGovernance = (network) => {
  const metadata = require('shared/connectors/web3/contracts/StakingGovernance.json');
  const opensalesManagerMetadata = require('shared/connectors/web3/contracts/OpenSalesManager.json');
  const opensalesManagerContractAddress =
    config[network].CONTRACT_ADDRESSES.OPEN_SALES_MANAGER;

  const propose = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any,
    maxPrioFee: string
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const {
          contractAddress,
          targets,
          values,
          calldatas,
          description,
          secretWalletData
        } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const gas = await contract.methods
          .propose(targets, values, calldatas, description, secretWalletData)
          .estimateGas({ from: account });

        const response = await contract.methods
          .propose(targets, values, calldatas, description, secretWalletData)
          .send({
            from: account,
            gas,
            maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, 'gwei')
          })
          .on('transactionHash', (hash) => {
            setHash(hash);
          });

        resolve({
          success: true,
          data: {
            proposalId: response.events.ProposalCreated.returnValues.proposalId,
            description:
              response.events.ProposalCreated.returnValues.description,
            startBlock: response.events.ProposalCreated.returnValues.startBlock,
            endBlock: response.events.ProposalCreated.returnValues.endBlock,
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

  const proposalDeadline = async (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { contractAddress, proposalId } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const response = await contract.methods
          .proposalDeadline(proposalId)
          .call();
        resolve(response);
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const proposalVotes = async (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { contractAddress, proposalId } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const response = await contract.methods
          .proposalVotes(proposalId)
          .call();

        resolve(response);
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const proposalSnapshot = async (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { contractAddress, proposalId } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const response = await contract.methods
          .proposalSnapshot(proposalId)
          .call();

        resolve(response);
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const castVote = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any,
    maxPrioFee: string
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { contractAddress, proposalId, support } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const gas = await contract.methods
          .castVote(proposalId, support)
          .estimateGas({ from: account });

        const response = await contract.methods
          .castVote(proposalId, support)
          .send({
            from: account,
            gas,
            maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, 'gwei')
          })
          .on('transactionHash', (hash) => {
            setHash(hash);
          });

        resolve({
          success: true,
          data: {
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

  const execute = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any,
    maxPrioFee: string
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const {
          contractAddress,
          targets,
          values,
          calldatas,
          description
        } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        const openSalesManagerContract = ContractInstance(
          web3,
          opensalesManagerMetadata,
          opensalesManagerContractAddress
        );

        const gas = await contract.methods
          .execute(targets, values, calldatas, description)
          .estimateGas({ from: account });

        const response = await contract.methods
          .execute(targets, values, calldatas, description)
          .send({
            from: account,
            gas,
            maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, 'gwei')
          })
          .on('transactionHash', (hash) => {
            setHash(hash);
          });

        if (response) {
          const proposedEvents = await openSalesManagerContract.getPastEvents(
            'SaleProposed',
            {
              fromBlock: response.blockNumber,
              toBlock: response.blockNumber
            }
          );
          resolve({
            success: true,
            data: {
              ...(proposedEvents.length
                ? {
                    tokenId: proposedEvents[0].returnValues.tokenId,
                    fromSeller: proposedEvents[0].returnValues.fromSeller,
                    collection: proposedEvents[0].returnValues.collection,
                    paymentToken: proposedEvents[0].returnValues.paymentToken,
                    price: proposedEvents[0].returnValues.price
                  }
                : {}),
              hash: response.transactionHash
            }
          });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({
          success: false
        });
      }
    });
  };

  return {
    propose,
    proposalDeadline,
    proposalVotes,
    proposalSnapshot,
    castVote,
    execute
  };
};

export default stakingGovernance;
