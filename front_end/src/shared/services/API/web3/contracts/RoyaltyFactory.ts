import Web3 from 'web3';
import { ContractInstance } from 'shared/connectors/web3/functions';
import config from 'shared/connectors/web3/config';

const MAX_PRIO_FEE = '50';

const royaltyFactory = (network) => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.ROYALTY_FACTORY;
  const contractAddress1155 =
    config[network].CONTRACT_ADDRESSES.ROYALTY_FACTORY_1155;
  const metadata = require('shared/connectors/web3/contracts/RoyaltyFactory.json');
  const metadata_1155 = require('shared/connectors/web3/contracts/RoyaltyFactory1155.json');

  const createRoyaltyERC721 = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any,
    maxPrioFee: number
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const {
          name,
          symbol,
          uri,
          royaltyAddress,
          bps,
          proofOfAuthenticity
        } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log('Getting gas....');
        const gas = await contract.methods
          .createRoyaltyERC721(
            name,
            symbol,
            uri,
            royaltyAddress,
            bps,
            proofOfAuthenticity
          )
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .createRoyaltyERC721(
            name,
            symbol,
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
            nftAddress: response.events.LoyaltyERC721Created.returnValues.nft,
            hash: response.transactionHash,
            maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, 'gwei')
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

  const createRoyaltyERC721Batch = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const {
          name,
          symbol,
          amount,
          uri,
          royaltyAddress,
          bps,
          proofOfAuthenticity
        } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log('Getting gas....');
        const gas = await contract.methods
          .createRoyaltyERC721Batch(
            name,
            symbol,
            amount,
            uri,
            royaltyAddress,
            bps,
            proofOfAuthenticity
          )
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .createRoyaltyERC721Batch(
            name,
            symbol,
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
            nftAddress: response.events.LoyaltyERC721Created.returnValues.nft,
            hash: response.transactionHash,
            maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, 'gwei')
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

  const mintMaster = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any,
    maxPrioFee: number
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const { name, symbol, songData, royaltyData } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log('Getting gas....');
        const gas = await contract.methods
          .mintMaster(name, symbol, songData, royaltyData)
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .mintMaster(name, symbol, songData, royaltyData)
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
            nftAddress: response.events.LoyaltyERC721Created.returnValues.nft,
            songId: response.events.MasterMinted.returnValues.songId,
            tokenId:
              response.events.LoyaltyERC721Created.returnValues.initialId,
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

  return {
    createRoyaltyERC721,
    createRoyaltyERC721Batch,
    mintMaster
  };
};

export default royaltyFactory;
