import Web3 from 'web3';
import { ContractInstance } from 'shared/connectors/web3/functions';
import config from 'shared/connectors/web3/config';

const MAX_PRIO_FEE = '50';

const openSalesManager = (network) => {
  const metadata = require('shared/connectors/web3/contracts/OpenSalesManager.json');
  const contractAddress = config[network].CONTRACT_ADDRESSES.OPEN_SALES_MANAGER;
  const contractAddress_1155 =
    config[network].CONTRACT_ADDRESSES.OPEN_SALES_MANAGER_1155;

  const approvePurchase = async (
    web3: Web3,
    account: string,
    isPurchase: boolean,
    isERC721: boolean,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const contract = ContractInstance(
          web3,
          metadata.abi,
          isERC721 ? contractAddress : contractAddress_1155
        );
        console.log('Getting gas....');
        const gas = await contract.methods
          .approvePurchase(
            payload.collection,
            payload.tokenId,
            payload.paymentToken,
            payload.price,
            payload.beneficiary,
            payload.sellerToMatch,
            365 * 24 * 60 * 60
          )
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .approvePurchase(
            payload.collection,
            payload.tokenId,
            payload.paymentToken,
            payload.price,
            payload.beneficiary,
            payload.sellerToMatch,
            365 * 24 * 60 * 60
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
        if (
          (isPurchase && response?.events?.PurchaseCompleted) ||
          (!isPurchase && response?.events?.PurchaseProposed)
        )
          resolve({ success: true, hash: response.transactionHash });
        else
          resolve({
            success: false
          });
      } catch (e) {
        console.log(e);
        resolve({
          success: false
        });
      }
    });
  };

  const approveSale = async (
    web3: Web3,
    account: string,
    isSale: boolean,
    isERC721: boolean,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const contract = ContractInstance(
          web3,
          metadata.abi,
          isERC721 ? contractAddress : contractAddress_1155
        );
        console.log('Getting gas....');
        const gas = await contract.methods
          .approveSale(
            payload.collection,
            payload.tokenId,
            payload.paymentToken,
            payload.price,
            payload.beneficiary,
            payload.buyerToMatch,
            365 * 24 * 60 * 60
          )
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        let hash = '';
        const response = await contract.methods
          .approveSale(
            payload.collection,
            payload.tokenId,
            payload.paymentToken,
            payload.price,
            payload.beneficiary,
            payload.buyerToMatch,
            365 * 24 * 60 * 60
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
        if (
          (isSale && response?.events?.SaleCompleted) ||
          (!isSale && response?.events?.SaleProposed)
        )
          resolve({ success: true, hash: response.transactionHash });
        else
          resolve({
            success: false
          });
      } catch (e) {
        console.log(e);
        resolve({
          success: false
        });
      }
    });
  };

  const cancelSaleProposal = async (
    web3: Web3,
    account: string,
    isERC721: boolean,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const contract = ContractInstance(
          web3,
          metadata.abi,
          isERC721 ? contractAddress : contractAddress_1155
        );
        console.log('Getting gas....');
        const gas = await contract.methods
          .cancelSaleProposal(
            payload.collection,
            payload.tokenId,
            payload.paymentToken,
            payload.price,
            payload.owner
          )
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .cancelSaleProposal(
            payload.collection,
            payload.tokenId,
            payload.paymentToken,
            payload.price,
            payload.owner
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

        resolve({ success: true });
      } catch (e) {
        console.log(e);
        resolve({
          success: false
        });
      }
    });
  };

  const cancelPurchaseProposal = async (
    web3: Web3,
    account: string,
    isERC721: boolean,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      try {
        const contract = ContractInstance(
          web3,
          metadata.abi,
          isERC721 ? contractAddress : contractAddress_1155
        );
        console.log('Getting gas....');
        const gas = await contract.methods
          .cancelPurchaseProposal(
            payload.collection,
            payload.tokenId,
            payload.paymentToken,
            payload.price,
            payload.beneficiary
          )
          .estimateGas({ from: account });
        console.log('calced gas price is.... ', gas);
        const response = await contract.methods
          .cancelPurchaseProposal(
            payload.collection,
            payload.tokenId,
            payload.paymentToken,
            payload.price,
            payload.beneficiary
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

        resolve({ success: true });
      } catch (e) {
        console.log(e);
        resolve({
          success: false
        });
      }
    });
  };

  return {
    approvePurchase,
    approveSale,
    cancelSaleProposal,
    cancelPurchaseProposal
  };
};

export default openSalesManager;
