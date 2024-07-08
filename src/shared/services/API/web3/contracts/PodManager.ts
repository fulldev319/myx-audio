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

const podManager = (network) => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.POD_MANAGER;
  const copyrightTokenAddress =
    config[network].CONTRACT_ADDRESSES.COPYRIGHT_TOKEN;

  const metadata = require('shared/connectors/web3/contracts/PodManager.json');
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
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        const stableDecimals = await api(network).Erc20[
          payload.FundingToken
        ].decimals(web3);

        const pod = {
          owners: payload.Collabs.map((collab) => collab.address) || [],
          podAddress: contractAddress,
          fundingDate: payload.WithFunding
            ? payload.FundingDate
            : Math.floor(Date.now() / 1000 + 3600 * 24),
          fundingToken:
            config[network].TOKEN_ADDRESSES[payload.FundingToken || 'USDT'],
          fundingTokenPrice: payload.WithFunding
            ? toNDecimals(
                +payload.FundingTarget / +payload.TotalSupply,
                stableDecimals
              )
            : 1,
          fundingTarget: payload.WithFunding
            ? toNDecimals(payload.FundingTarget, stableDecimals)
            : 0
        };

        const mediaIds =
          payload.Medias?.map((media) => web3.utils.keccak256(media.Title)) ||
          [];
        const royaltyPercentage = payload.Royalty || 0;
        const podDescription = {
          podTokenName: payload.TokenName,
          podTokenSymbol: payload.TokenSymbol
        };
        const investorShare = payload.WithFunding ? payload.InvestorShare : '0';
        const copyrightAllocation = [
          ...payload.Collabs.map((data) => data.sharingPercent),
          payload.InvestorShare || '0'
        ];
        const totalSupply = toNDecimals(payload.TotalSupply, 18);

        console.log('Getting gas....');
        const gas = await contract.methods
          .registerPodProposal(
            pod,
            mediaIds,
            royaltyPercentage,
            podDescription,
            investorShare,
            copyrightAllocation,
            totalSupply
          )
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .registerPodProposal(
            pod,
            mediaIds,
            royaltyPercentage,
            podDescription,
            investorShare,
            copyrightAllocation,
            totalSupply
          )
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
          data: {
            podAddress: response.events.CreatePod
              ? response.events.CreatePod.returnValues.podAddress
              : null,
            id: response.events.PodProposalCreated.returnValues.id,
            hash: response.transactionHash
          }
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const voteForPodProposal = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any,
    maxPrioFee: string
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { id } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log('Getting gas....');
        const gas = await contract.methods
          .voteForPodProposal(id)
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .voteForPodProposal(id)
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
            id: response.events.ProposalVoted.returnValues.id,
            voter: response.events.ProposalVoted.returnValues.voter,
            podAddress: response.events.CreatePod
              ? response.events.CreatePod.returnValues.podAddress
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

  const investPod = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any,
    maxPrioFee: string
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { podAddress, amount, fundingToken } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const stableDecimals = await api(network).Erc20[fundingToken].decimals(
          web3
        );

        console.log('Getting gas....');
        const gas = await contract.methods
          .investPod(podAddress, amount)
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .investPod(podAddress, amount)
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
          data: {
            amount: +toDecimals(
              response.events.InvestPod.returnValues.amount,
              stableDecimals
            )
          },
          hash: response.transactionHash
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const claimPodTokens = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any,
    maxPrioFee: string
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { podAddress } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log('Getting gas....');
        const gas = await contract.methods
          .claimPodTokens(podAddress)
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .claimPodTokens(podAddress)
          .send({
            from: account,
            gas: gas,
            maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, 'gwei')
          })
          .on('transactionHash', (hash) => {
            setHash(hash);
          });
        console.log('transaction succeed');
        if (response) {
          resolve({
            success: true,
            data: {
              hash: response.transactionHash
            }
          });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const disposePod = async (
    web3: Web3,
    account: string,
    payload: any
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { podAddress } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log('Getting gas....');
        const gas = await contract.methods
          .disposePod(podAddress)
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .disposePod(podAddress)
          .send({ from: account, gas: gas });
        console.log('transaction succeed');

        if (response) {
          resolve({
            success: true,
            data: {
              hash: response.transactionHash
            }
          });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({
          success: false,
          error: e
        });
      }
    });
  };

  const getPodInfo = async (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { podAddress, fundingToken } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const stableDecimals = await api(network).Erc20[fundingToken].decimals(
          web3
        );
        const copyrightDecimals = await api(network).Erc20[
          'COPYRIGHT'
        ].decimals(web3, copyrightTokenAddress);
        const response = await contract.methods.getPodInfo(podAddress).call();

        resolve({
          copyrightSupplyInvestors: +toDecimals(
            response.copyrightSupplyInvestors,
            copyrightDecimals
          ),
          copyrightToken: response.copyrightToken,
          copyrightNftContract: response.copyrightNftContract,
          copyrightTokenSupply: +response.copyrightTokenSupply,
          distributionManagerAddress: response.distributionManagerAddress,
          mediaIds: response.mediaIds,
          nftContract: response.nftContract,
          fundingDate: response.pod.fundingDate,
          fundingTarget: +toDecimals(
            response.pod.fundingTarget,
            stableDecimals
          ),
          fundingToken: response.pod.fundingToken,
          fundingTokenPrice: +toDecimals(
            response.pod.fundingTokenPrice,
            stableDecimals
          ),
          podAddress: response.pod.podAddress,
          raisedFunds: +toDecimals(response.raisedFunds, stableDecimals)
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const uploadMedia = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any,
    maxPrioFee: string
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { podAddress, mediaId, uri, isStreaming, nftAddress } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        const erc721Contract = ContractInstance(
          web3,
          erc721Metadata.abi,
          nftAddress
        );

        console.log('Getting gas....');
        const gas = await contract.methods
          .uploadMedia(podAddress, mediaId, uri, isStreaming)
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .uploadMedia(podAddress, mediaId, uri, isStreaming)
          .send({
            from: account,
            gas: gas,
            maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, 'gwei')
          })
          .on('transactionHash', (hash) => {
            setHash(hash);
          });
        console.log('transaction succeed', response);

        if (response) {
          const transferEvents = await erc721Contract.getPastEvents(
            'Transfer',
            {
              fromBlock: response.blockNumber,
              toBlock: response.blockNumber
            }
          );

          resolve({
            success: true,
            data: {
              tokenId: transferEvents.length
                ? transferEvents[0].returnValues.tokenId
                : null,
              hash: response.transactionHash
            }
          });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };
  return {
    registerPodProposal,
    voteForPodProposal,
    investPod,
    claimPodTokens,
    getPodInfo,
    disposePod,
    uploadMedia
  };
};

export default podManager;
