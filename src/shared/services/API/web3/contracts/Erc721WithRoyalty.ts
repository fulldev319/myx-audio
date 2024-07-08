import Web3 from 'web3';
import { ContractInstance } from 'shared/connectors/web3/functions';
import config from 'shared/connectors/web3/config';

const MAX_PRIO_FEE = '50';

const erc721WithRoyalty = (network) => {
  const metadata = require('shared/connectors/web3/contracts/ERC721WithRoyalty.json');

  const mintWithRoyalty = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any,
    maxPrioFee: number
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const {
          contractAddress,
          uri,
          royaltyAddress,
          bps,
          proofOfAuthenticity
        } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log('Getting gas....');
        const gas = await contract.methods
          .mintWithRoyalty(
            account,
            uri,
            royaltyAddress,
            bps,
            proofOfAuthenticity
          )
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .mintWithRoyalty(
            account,
            uri,
            royaltyAddress,
            bps,
            proofOfAuthenticity
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
          success: true,
          data: {
            tokenId: response.events.Transfer.returnValues.tokenId,
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

  const mintBatchWithRoyalty = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const {
          contractAddress,
          amount,
          uri,
          royaltyAddress,
          bps,
          proofOfAuthenticity
        } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log('Getting gas....');
        const gas = await contract.methods
          .mintBatchWithRoyalty(
            account,
            amount,
            uri,
            royaltyAddress,
            bps,
            proofOfAuthenticity
          )
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .mintBatchWithRoyalty(
            account,
            amount,
            uri,
            royaltyAddress,
            bps,
            proofOfAuthenticity
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
          success: true,
          data: {
            tokenId: response.events.Transfer[0].returnValues.tokenId,
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

  const mintMasterNFT = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any,
    maxPrioFee: number
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { contractAddress, to, songData, royaltyData } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log(payload);
        console.log('Getting gas....');
        const gas = await contract.methods
          .mintMasterNFT(to, songData, royaltyData)
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .mintMasterNFT(to, songData, royaltyData)
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
            tokenId: response.events.MasterNFT.returnValues.tokenId,
            songId: response.events.MasterNFT.returnValues.songId,
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

  const mintEditions = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any,
    maxPrioFee: number
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { contractAddress, songId } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log('Getting gas....');
        const gas = await contract.methods
          .mintEditions(songId)
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .mintEditions(songId)
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
            hash: response.transactionHash,
            tokenIds:
              response.events.Transfer &&
              ((response.events.Transfer.returnValues && [
                response.events.Transfer.returnValues.tokenId
              ]) ||
                (response.events.Transfer.length > 0 &&
                  response.events.Transfer.map((t) => t.returnValues.tokenId)))
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
    mintWithRoyalty,
    mintBatchWithRoyalty,
    mintMasterNFT,
    mintEditions
  };
};

export default erc721WithRoyalty;
