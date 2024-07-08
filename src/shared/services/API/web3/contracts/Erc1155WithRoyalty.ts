import Web3 from 'web3';
import { ContractInstance } from 'shared/connectors/web3/functions';
import config from 'shared/connectors/web3/config';

const erc1155WithRoyalty = (network) => {
  const metadata = require('shared/connectors/web3/contracts/ERC1155WithRoyalty.json');

  const mintWithRoyalty = async (
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
          .mintWithRoyalty(
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
          .mintWithRoyalty(
            account,
            amount,
            uri,
            royaltyAddress,
            bps,
            proofOfAuthenticity
          )
          .send({ from: account, gas: gas })
          .on('transactionHash', (hash) => {
            setHash(hash);
          });
        console.log('transaction succeed');
        resolve({
          success: true,
          data: {
            tokenId: response.events.RoyaltyNFT.returnValues.id,
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
    mintWithRoyalty
  };
};

export default erc1155WithRoyalty;
