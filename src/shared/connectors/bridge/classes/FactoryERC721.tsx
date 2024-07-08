import Web3 from 'web3';
import MUSICPodERC721FactoryContractJson from 'shared/contracts/ABI_V5/MUSICPodERC721Factory.json';

export class FactoryERC721 {
  // Show first n digits and last n digits of Ethereum address
  shortenAddres(address: String, slicer: number = 4, dotter: number = 4) {
    if (address) {
      return (
        address.slice(0, slicer + 2) +
        '.'.repeat(dotter) +
        address.slice(slicer * -1)
      );
    } else {
      return '';
    }
  }

  private getFactory(
    web3: Web3,
    chainId: any
  ): { address: string; contract: any } {
    const MUSICPodERC721FactoryAddress =
      MUSICPodERC721FactoryContractJson.networks[String(chainId)]['address'];
    const MUSICPodERC721FactoryABI: any = MUSICPodERC721FactoryContractJson.abi;
    const MUSICPodERC721FactoryContract = new web3.eth.Contract(
      MUSICPodERC721FactoryABI,
      MUSICPodERC721FactoryAddress
    );
    return {
      address: MUSICPodERC721FactoryAddress,
      contract: MUSICPodERC721FactoryContract
    };
  }

  async createPod(
    web3: Web3,
    fromAccount: string,
    podAddress: string,
    podTokenName: string,
    podTokenSymbol: string
  ): Promise<any> {
    console.log(
      'createPod 721:',
      fromAccount,
      podAddress,
      podTokenName,
      podTokenSymbol
    );
    const chainId = await web3.eth.getChainId();
    const factory = this.getFactory(web3, chainId);

    return await factory.contract.methods
      .createPod(
        podAddress,
        podTokenName,
        podTokenSymbol,
        'URI_' + podTokenSymbol
      )
      .send({ from: fromAccount })
      .on('receipt', function (receipt) {
        console.log('FactoryERC721 createPod:', ' receipt:', receipt);
        return receipt;
      });
  }

  async getDeployedPodTokenAddressOnEth(
    web3: Web3,
    podAddress: string
  ): Promise<string> {
    const chainId = await web3.eth.getChainId();
    const factory = this.getFactory(web3, chainId);
    const deployedPodAddress = await factory.contract.methods
      .getPodAddressById(podAddress)
      .call();
    return deployedPodAddress;
  }

  async getTotalPodCreatedOnEth(web3: Web3): Promise<Number> {
    const chainId = await web3.eth.getChainId();
    const factory = this.getFactory(web3, chainId);
    const numberOfDeployedPods = await factory.contract.methods
      .totalPodCreated()
      .call();
    return numberOfDeployedPods;
  }
}

export default FactoryERC721;
