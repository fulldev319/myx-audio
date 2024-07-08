import axios from 'axios';
import URL from 'shared/functions/getURL';
import URLTraxSongRecognizer from 'shared/functions/getURLMusicSongRecognizer';
import { getMusicWallet } from 'shared/helpers/wallet';
import { signPayload } from '../WalletSign';
import { IAPIRequestProps } from 'shared/types/Media';
import {
  IInvestPod,
  IRegisterMedia,
  IBuySellPodTokens
} from 'shared/services/API';
import { IUploadMedia } from './PodMediaAPI';

// posts
export async function musicDAOInitiatePod(payload: Object): Promise<any> {
  try {
    // const { address, privateKey } = await getMusicWallet();
    // const { signature } = await signPayload("initiatePod", address, payload, privateKey);
    // const requestData: IAPIRequestProps = {
    //   Function: "initiatePod",
    //   Address: userAddress,
    //   Signature: "",
    //   Payload: payload,
    // };
    // const body = {
    //   Data: requestData,
    //   AdditionalData: additionalData,
    // };
    const response = await axios.post(
      `${URL()}/musicDao/new/pod/initiatePod`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function initiatePodWithMultipleEditions(
  payload: Object
): Promise<any> {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/pod/initiatePodWithMultipleEditions`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDAOChangePodImage(
  podId,
  payload: Object
): Promise<any> {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/new/pod/updatePodImage/${podId}`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoRegisterPodProposal(payload: any) {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/new/pod/registerPodProposal`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function addCollabsToPod(payload: any) {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/new/pod/addCollabsToPod`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function deleteCollabFromPod(payload: any) {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/new/pod/deleteCollabFromPod`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoVoteForPodProposal(payload: any) {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/new/pod/voteForPodProposal`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoExecutePod(payload: any) {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/new/pod/executePod`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoInvestPod(payload: any) {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/new/pod/invest`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetMyInvestments(lastId: string) {
  try {
    const response = await axios.get(
      `${URL()}/musicDao/new/pod/getMyInvestments/${lastId}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoClaimPodTokens(payload: any) {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/new/pod/claimPodTokens`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoStakeMediaFractions(payload: any) {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/new/pod/stakeMediaFractions`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoUnstakeMediaFractions(payload: any) {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/new/pod/unstakeMediaFractions`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoCreateCopyrightNFT(payload: any) {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/new/pod/createCopyrightNFT`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetCopyrightNFTsByPod(id: any) {
  const response = await axios.get(`${URL()}/musicDao/new/pod/copyrightNFTs`, {
    params: {
      podId: id
    }
  });
  return response.data;
}

export async function musicDaoClaimReward(payload: any) {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/new/pod/claimReward`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetStaking(id: any) {
  try {
    const response = await axios.get(`${URL()}/musicDao/new/pod/staking`, {
      params: {
        podId: id
      }
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
}

export async function musicDaoCreateWithdrawProposal(
  payload: any
): Promise<any> {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/new/pod/createWithdrawProposal`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetWithdrawProposals(
  podId: string
): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/musicDao/new/pod/getWithdrawProposals?podId=${podId}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoVoteForWithdrawProposal(
  payload: any
): Promise<any> {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/new/pod/voteForWithdrawProposals`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoFollowPod(
  userId: string,
  podId: string
): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/musicDao/pod/followPod`, {
      userId,
      podId
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
}

export async function musicDaoUnfollowPod(
  userId: string,
  podId: string
): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/musicDao/pod/unfollowPod`, {
      userId,
      podId
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

// export async function musicDaoInvestPod(payload: IInvestPod, additionalData: Object): Promise<any> {
//   try {
//     const { address, privateKey } = await getMusicWallet();
//     const { signature } = await signPayload("investPod", address, payload, privateKey);
//     const requestData: IAPIRequestProps = {
//       Function: "investPod",
//       Address: address,
//       Signature: signature,
//       Payload: payload,
//     };
//     const body = {
//       Data: requestData,
//       AdditionalData: additionalData,
//     };
//     const response = await axios.post(`${URL()}/musicDao/pod/investPod`, body);
//     return response.data;
//   } catch (e : any) {
//     console.log(e);
//     throw new Error(e.message);
//   }
// }

export async function musicDaoUploadMedia(
  payload: IUploadMedia,
  additionalData: Object
): Promise<any> {
  try {
    const { address, privateKey } = await getMusicWallet();
    const { signature } = await signPayload(
      'uploadMedia',
      address,
      payload,
      privateKey
    );
    const requestData: IAPIRequestProps = {
      Function: 'uploadMedia',
      Address: address,
      Signature: signature,
      Payload: payload
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData
    };
    const response = await axios.post(
      `${URL()}/musicDao/pod/uploadMedia`,
      body
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoBuyPodTokens(
  payload: IBuySellPodTokens,
  additionalData: Object
): Promise<any> {
  try {
    const { address, privateKey } = await getMusicWallet();
    const { signature } = await signPayload(
      'buyPodTokens',
      address,
      payload,
      privateKey
    );
    const requestData: IAPIRequestProps = {
      Function: 'buyPodTokens',
      Address: address,
      Signature: signature,
      Payload: payload
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData
    };
    const response = await axios.post(
      `${URL()}/musicDao/pod/buyPodTokens`,
      body
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDAORegisterMedia(
  payload: IRegisterMedia,
  additionalData: Object
): Promise<any> {
  try {
    const { address, privateKey } = await getMusicWallet();
    const { signature } = await signPayload(
      'registerMedia',
      address,
      payload,
      privateKey
    );
    const requestData: IAPIRequestProps = {
      Function: 'registerMedia',
      Address: address,
      Signature: signature,
      Payload: payload
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData
    };
    const response = await axios.post(
      `${URL()}/musicDao/pod/registerMedia`,
      body
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoSellPodTokens(
  payload: IBuySellPodTokens,
  additionalData: Object
): Promise<any> {
  try {
    const { address, privateKey } = await getMusicWallet();
    const { signature } = await signPayload(
      'sellPodTokens',
      address,
      payload,
      privateKey
    );
    const requestData: IAPIRequestProps = {
      Function: 'sellPodTokens',
      Address: address,
      Signature: signature,
      Payload: payload
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData
    };
    const response = await axios.post(
      `${URL()}/musicDao/pod/sellPodTokens`,
      body
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

// gets
export async function musicDaoGetTrendingPods(
  isNew: boolean,
  isHot: boolean,
  searchValue
): Promise<any> {
  try {
    const config = {
      params: {
        isNew,
        isHot,
        searchValue
      }
    };
    const response = await axios.get(
      `${URL()}/musicDao/pod/getTrendingPods`,
      config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetPodsProposal(
  userAddress,
  searchStr,
  lastId
): Promise<any> {
  try {
    const config = {
      params: {
        userAddress,
        searchStr,
        lastId
      }
    };
    const response = await axios.get(
      `${URL()}/musicDao/pod/getMediaPodProposals`,
      config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetRaisedTrendingPods(): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/musicDao/pod/getRaisedTrendingPods`
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetPods(
  filterOption: string,
  lastId?: string
): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/musicDao/pod/getPods/${filterOption.toLowerCase()}/${lastId}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getMyxPods(
  filterOption: string,
  lastId?: string
): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/musicDao/pod/getMyxPods/${filterOption.toLowerCase()}/${lastId}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoRemovePod(podId: string): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/musicDao/pod/removePod`, {
      podId
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetPodsOfArtist(
  artistId: string,
  lastId: string,
  search: string | undefined = undefined
): Promise<any> {
  try {
    const config = {
      params: {
        lastId,
        search
      }
    };
    const response = await axios.get(
      `${URL()}/musicDao/pod/getPodsOfArtist/${artistId}`,
      config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaogGetPodPriceHistory(
  podAddress: string,
  numPoints: number
): Promise<any> {
  try {
    const config = {
      params: {
        PodAddress: podAddress,
        numPoints
      }
    };
    const response = await axios.get(
      `${URL()}/musicDao/pod/getPriceHistory`,
      config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetPodInvestmentTransactions(
  podAddress: string
): Promise<any> {
  try {
    const config = {
      params: {
        PodAddress: podAddress
      }
    };
    const response = await axios.get(
      `${URL()}/musicDao/pod/getInvestmentTransactions`,
      config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetBuySellTransactions(
  podAddress: string
): Promise<any> {
  try {
    const config = {
      params: {
        PodAddress: podAddress
      }
    };
    const response = await axios.get(
      `${URL()}/musicDao/pod/getBuySellTransactions`,
      config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetPodDistributionInfo(
  podAddress: string
): Promise<any> {
  try {
    const config = {
      params: {
        PodAddress: podAddress
      }
    };
    const response = await axios.get(
      `${URL()}/musicDao/pod/getDistributionInfo`,
      config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetPod(podAddress: string): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/musicDao/pod/getPod?podAddress=${podAddress}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoAcceptInvitation(payload: any): Promise<any> {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/new/pod/acceptInvitation`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoSendInvitation(payload: any): Promise<any> {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/new/pod/sendInvitation`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetBuyingPodFundingTokenAmount(
  podAddress: string,
  amount: number
): Promise<any> {
  try {
    const config = {
      params: {
        PodAddress: podAddress,
        Amount: amount
      }
    };
    const response = await axios.get(
      `${URL()}/musicDao/pod/getBuyingPodFundingTokenAmount`,
      config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetSellingPodFundingTokenAmount(
  podAddress: string,
  amount: number
): Promise<any> {
  try {
    const config = {
      params: {
        PodAddress: podAddress,
        Amount: amount
      }
    };
    const response = await axios.get(
      `${URL()}/musicDao/pod/getSellingPodFundingTokenAmount`,
      config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoFruitPod(
  userId: string,
  podId: string,
  fruitId: number
): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/musicDao/pod/fruit`, {
      userId,
      podId,
      fruitId
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

/////////////////////////////// Media Staking-Liquidity //////////////////////
export interface IStakeMediaFunds {
  TokenSymbol: string;
  RewardToken: string;
  Address: string;
  Amount: string;
}

export async function stakeMediaFunds(
  payload: IStakeMediaFunds,
  additionalData: Object
): Promise<any> {
  try {
    const { address, privateKey } = await getMusicWallet();
    const { signature } = await signPayload(
      'stakeMediaFunds',
      address,
      payload,
      privateKey
    );
    const requestData: IAPIRequestProps = {
      Function: 'stakeMediaFunds',
      Address: address,
      Signature: signature,
      Payload: payload
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData
    };
    const response = await axios.post(
      `${URL()}/musicDao/staking/stakeMediaFunds`,
      body
    );
    if (response.data.success) {
      return response.data.data;
    } else {
      console.error(response.data.error);
      throw new Error(response.data.error);
    }
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IUnstakeOrPayFunds {
  Id: string;
  Address: string;
  Amount: string;
}

export async function unstakeMediaFunds(
  payload: IUnstakeOrPayFunds,
  additionalData: Object
): Promise<any> {
  try {
    const { address, privateKey } = await getMusicWallet();
    const { signature } = await signPayload(
      'unstakeMediaFunds',
      address,
      payload,
      privateKey
    );
    const requestData: IAPIRequestProps = {
      Function: 'unstakeMediaFunds',
      Address: address,
      Signature: signature,
      Payload: payload
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData
    };
    const response = await axios.post(
      `${URL()}/musicDao/staking/unstakeMediaFunds`,
      body
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function payMediaStakingFunds(
  payload: IUnstakeOrPayFunds,
  additionalData: Object
): Promise<any> {
  try {
    const { address, privateKey } = await getMusicWallet();
    const { signature } = await signPayload(
      'payMediaStakingFunds',
      address,
      payload,
      privateKey
    );
    const requestData: IAPIRequestProps = {
      Function: 'payMediaStakingFunds',
      Address: address,
      Signature: signature,
      Payload: payload
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData
    };
    const response = await axios.post(
      `${URL()}/musicDao/staking/payMediaStakingFunds`,
      body
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IStakeLiquidityMediaFunds {
  TokenSymbol: string;
  RewardToken: string;
  RangeFrom: number;
  RangeTo: number;
  Address: string;
  Amount: string;
}

export async function stakeLiquidityMediaFunds(
  payload: IStakeLiquidityMediaFunds,
  additionalData: Object
): Promise<any> {
  try {
    const { address, privateKey } = await getMusicWallet();
    const { signature } = await signPayload(
      'stakeLiquidityMediaFunds',
      address,
      payload,
      privateKey
    );
    const requestData: IAPIRequestProps = {
      Function: 'stakeLiquidityMediaFunds',
      Address: address,
      Signature: signature,
      Payload: payload
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData
    };
    const response = await axios.post(
      `${URL()}/musicDao/staking/stakeLiquidityMediaFunds`,
      body
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function unstakeLiquidityMediaFunds(
  payload: IUnstakeOrPayFunds,
  additionalData: Object
): Promise<any> {
  try {
    const { address, privateKey } = await getMusicWallet();
    const { signature } = await signPayload(
      'unstakeLiquidityMediaFunds',
      address,
      payload,
      privateKey
    );
    const requestData: IAPIRequestProps = {
      Function: 'unstakeLiquidityMediaFunds',
      Address: address,
      Signature: signature,
      Payload: payload
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData
    };
    const response = await axios.post(
      `${URL()}/musicDao/staking/unstakeLiquidityMediaFunds`,
      body
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function payLiquidityMediaFunds(
  payload: IUnstakeOrPayFunds,
  additionalData: Object
): Promise<any> {
  try {
    const { address, privateKey } = await getMusicWallet();
    const { signature } = await signPayload(
      'payLiquidityMediaFunds',
      address,
      payload,
      privateKey
    );
    const requestData: IAPIRequestProps = {
      Function: 'payLiquidityMediaFunds',
      Address: address,
      Signature: signature,
      Payload: payload
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData
    };
    const response = await axios.post(
      `${URL()}/musicDao/staking/payLiquidityMediaFunds`,
      body
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IBorrowMediaStakingTokens {
  LiquidityId: string;
  Address: string;
  Days: number;
  Amount: number;
}

export async function borrowMediaStakingTokens(
  payload: IBorrowMediaStakingTokens,
  additionalData: Object
): Promise<any> {
  try {
    const { address, privateKey } = await getMusicWallet();
    const { signature } = await signPayload(
      'borrowMediaStakingTokens',
      address,
      payload,
      privateKey
    );
    const requestData: IAPIRequestProps = {
      Function: 'borrowMediaStakingTokens',
      Address: address,
      Signature: signature,
      Payload: payload
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData
    };
    const response = await axios.post(
      `${URL()}/musicDao/staking/borrowMediaStakingTokens`,
      body
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IClaimRewardTokens {
  LiquidityId: string;
  Address: string;
  Days: number;
  Amount: number;
}

export async function claimRewardTokens(
  payload: IClaimRewardTokens,
  additionalData: Object
): Promise<any> {
  try {
    const { address, privateKey } = await getMusicWallet();
    const { signature } = await signPayload(
      'claimRewardTokens',
      address,
      payload,
      privateKey
    );
    const requestData: IAPIRequestProps = {
      Function: 'claimRewardTokens',
      Address: address,
      Signature: signature,
      Payload: payload
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData
    };
    const response = await axios.post(
      `${URL()}/musicDao/staking/claimRewardTokens`,
      body
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export const getMediaStakingsOfAddress = async (address: string) => {
  try {
    const response = await axios.get(
      `${URL()}/musicDao/staking/getMediaStakingsOfAddress`,
      {
        params: {
          Address: address
        }
      }
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.error);
  } catch (e) {
    throw new Error(e.message || 'getMediaStakingsOfAddress error');
  }
};

export const musicDaoSubscribe = async (payload: any) => {
  try {
    const response = await axios.post(`${URL()}/musicDao/subscribe`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};

export const musicDaoGetSubscription = async () => {
  try {
    const response = await axios.get(`${URL()}/musicDao/subscription`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};

export const musicDaoSubscriptionClaimReward = async (payload: any) => {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/claimSubscriptionReward`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};

export async function musicDaoGetCopyrightNFTs(id: string) {
  try {
    const response = await axios.get(`${URL()}/musicDao/copyrightNFTs/${id}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetHoldingPods(id: string) {
  try {
    const response = await axios.get(`${URL()}/musicDao/holdingPods/${id}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetEditionsOfSong(id: string) {
  try {
    const response = await axios.get(
      `${URL()}/musicDao/getEditionsOfSong/${id}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetEditionsOfSongAggregated(id: string) {
  try {
    const response = await axios.get(
      `${URL()}/musicDao/getEditionsOfSongAggregated/${id}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetSongNFts(
  pagination?: number,
  kind?: string,
  genre?: string,
  edition?: string,
  search?: string
) {
  try {
    const config = {
      params: {
        pagination,
        kind: kind?.toUpperCase().includes('ALL') ? 'ALL' : kind?.toUpperCase(),
        genre: genre?.toUpperCase().startsWith('ALL') ? 'ALL' : genre,
        edition: edition?.toUpperCase().includes('ALL') ? 'ALL' : edition,
        search
      }
    };
    const response = await axios.get(`${URL()}/musicDao/getSongNFTs`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetNewestSongNFts(): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/musicDao/getNewestSongNFTs`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetOwnedSongNFts(userId, lastId?: string) {
  try {
    const config = {
      params: {
        lastId
      }
    };
    const response = await axios.get(
      `${URL()}/musicDao/getOwnedSongNFTs/${userId}`,
      config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetCreatedSongNFts(
  userId,
  owner = false,
  lastStamp?: any,
  kind?: string,
  genre?: string,
  edition?: string
) {
  try {
    const config = {
      params: {
        lastStamp,
        kind: kind?.toUpperCase().includes('ALL') ? 'ALL' : kind?.toUpperCase(),
        genre: genre?.toUpperCase().includes('ALL') ? 'ALL' : genre,
        edition: edition?.toUpperCase().includes('ALL') ? 'ALL' : edition
      }
    };
    const url = owner
      ? `${URL()}/musicDao/getMyCreatedSongNFTs`
      : `${URL()}/musicDao/getCreatedSongNFTs/${userId}`;

    const response = await axios.get(url, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetCreatedDraftSongs(userId, lastStamp?: string) {
  try {
    const config = {
      params: {
        lastStamp
      }
    };
    const url = `${URL()}/musicDao/getCreatedDraftSongs/${userId}`;

    const response = await axios.get(url, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoSignProofOfAuthenticity(file: any) {
  /*try {
    const formData = new FormData();
    formData.append('audio', file);
    const response = await axios.post(
      `${URLTraxSongRecognizer()}/songs/getFingerPrint`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }*/
  const response = JSON.parse(
    '{"success":true,"fingerprint":"not-calced","duration":"0"}'
  );
  return response;
}

export async function musicDaoGetSongNFTDetail(id: string): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/musicDao/song/getSongNFTDetail?id=${id}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetSongNFTBySongId(songId: string): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/musicDao/song/getSongNftBySongId?songId=${songId}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetSongNFTComments(
  songId: string,
  lastDate: number
): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/musicDao/song/getSongNftComments`,
      {
        params: {
          songId,
          lastDate
        }
      }
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoFruitSongNFT(
  userId: string,
  id: string,
  fruitId: number
): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/musicDao/song/fruit`, {
      userId,
      id,
      fruitId
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoFruitPost(
  userId: string,
  id: string,
  fruitId: number
): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/user/wall/fruitPost`, {
      userId,
      id,
      fruitId
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoCreateSellingProposal(payload): Promise<any> {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/sellProposal`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetSellingProposals(podId: string): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/musicDao/sellProposals`, {
      params: {
        podId
      }
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoVoteSellingProposal(payload): Promise<any> {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/voteSellProposal`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoExecuteSellProposal(payload): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/musicDao/sellProposal/update`, {
      ...payload,
      status: {
        executed: true,
        claimed: false
      }
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoClaimSellProposal(payload): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/musicDao/sellProposal/update`, {
      ...payload,
      status: {
        executed: true,
        claimed: true
      }
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoSongFeed(songId): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/musicDao/songFeed/${songId}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetSongListenDetail(songId): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/musicDao/getSongListenDetail/${songId}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetSongFeed(songId, params = {}): Promise<any> {
  try {
    const config = { params };
    const response = await axios.get(
      `${URL()}/musicDao/getSongFeed/${songId}`,
      config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetSongRanking(
  songId,
  params = {}
): Promise<any> {
  try {
    const config = { params };
    const response = await axios.get(
      `${URL()}/musicDao/getSongRanking/${songId}`,
      config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetAlbums(params): Promise<any> {
  try {
    const config = { params };
    const response = await axios.get(`${URL()}/musicDao/getAlbums`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetTopAlbums(): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/musicDao/getTopAlbums`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetAlbumsOfArtist(
  artistId: string,
  lastId?: string,
  getAll: boolean = false
): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/musicDao/getAlbumsOfArtist/${artistId}?lastId=${lastId}`,
      {
        params: {
          getAll
        }
      }
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetAlbumDetail(
  id: string,
  userId?: string
): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/musicDao/getAlbum/${id}`, {
      params: {
        userId
      }
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
export async function musicDaoGetPlayerAlbumDetail(id: string): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/musicDao/getPlayerAlbum/${id}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetAlbumSongs(id: string, params): Promise<any> {
  try {
    const config = { params };
    const response = await axios.get(
      `${URL()}/musicDao/getAlbumSongs/${id}`,
      config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
export async function musicDaoGetPlayerAlbumSongs(
  id: string,
  params
): Promise<any> {
  try {
    const config = { params };
    const response = await axios.get(
      `${URL()}/musicDao/getPlayerAlbumSongs/${id}`,
      config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
export async function musicDaoGetPlayerGenreInfo(id: string): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/musicDao/getPlayerGenreInfo/${id}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetPlayerGenreSongs(
  id: string,
  params
): Promise<any> {
  try {
    const config = { params };
    const response = await axios.get(
      `${URL()}/musicDao/getPlayerGenreSongs/${id}`,
      config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
export async function musicDaoGetPlayerSearchedGenreSongs(
  id: string,
  params
): Promise<any> {
  try {
    const config = { params };
    const response = await axios.get(
      `${URL()}/musicDao/getPlayerSearchedGenreSongs/${id}`,
      config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGenerateWallet(payload): Promise<any> {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/generateWallet`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoListingOnOpensea(payload): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/musicDao/listing`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoClaimFundOnOpensea(payload): Promise<any> {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/sellProposal/claim`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetPlayerAlbums(lastStamp, search) {
  try {
    const config = {
      params: {
        lastStamp,
        search
      }
    };
    const response = await axios.get(
      `${URL()}/musicDao/getPlayerAlbums`,
      config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetFruitSongs(payload): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/musicDao/getFruitSongs`, {
      params: payload
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
export async function musicDaoGetFruitArtists(payload): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/musicDao/getFruitArtists`, {
      params: payload
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
export async function musicDaoGetFruitPlaylists(payload): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/musicDao/getFruitPlaylists`, {
      params: payload
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
export async function musicDaoGetFruitAlbums(payload): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/musicDao/getFruitAlbums`, {
      params: payload
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetUnfinishedMinting(): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/musicDao/unfinishedMinting`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetPodListings(id: any) {
  try {
    const response = await axios.get(`${URL()}/musicDao/listings`, {
      params: {
        podId: id
      }
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
}

export async function musicDaoAddChainInfo(payload: any) {
  try {
    const response = await axios.post(
      `${URL()}/musicDao/addChainInfoToPod`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
}

export function musicDaoUpdatePlayCount(payload: any) {
  try {
    // const response = await axios.post(
    //   `${URL()}/musicDao/updateSongPlayCount`,
    //   payload
    // );
    // return response.data;
    return true;
  } catch (e) {
    console.log(e);
  }
}

export async function musicDaoGetTopOwners(podId: string): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/musicDao/getTopOwners/${podId}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetRecentPodSales(podId: string): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/musicDao/getRecentPodSales/${podId}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoUpdateSongViewCount(
  songId: string
): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/musicDao/updteSongViewCount`, {
      songId
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoCheckPodProposalCreation(
  podId: string,
  metadataURI: string
) {
  try {
    const config = new URLSearchParams({
      podId,
      metadataURI
    });
    const response = await axios.get(
      `${URL()}/musicDao/pod/checkPodProposalCreation?` + config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoCheckPodCreation(
  proposalId: string,
  isProposal?: boolean
) {
  try {
    const config = new URLSearchParams({
      proposalId,
      isProposal: isProposal ? '1' : '0'
    });
    const response = await axios.get(
      `${URL()}/musicDao/pod/checkPodCreation?` + config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoLikeSongNFT(
  userId: string,
  id: string,
  type: string
): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/musicDao/song/like`, {
      userId,
      id,
      type
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetPlayerTracks(
  pagination?: number,
  // kind?: string,
  mood?: string,
  genre?: string,
  // edition?: string,
  search?: string
) {
  try {
    const config = {
      params: {
        pagination,
        // kind: kind?.toUpperCase().includes('ALL') ? 'ALL' : kind?.toUpperCase(),
        genre: genre?.toUpperCase().startsWith('ALL') ? 'ALL' : genre,
        mood: mood?.toUpperCase().includes('ALL') ? 'ALL' : mood?.toUpperCase(),
        // edition: edition?.toUpperCase().includes('ALL') ? 'ALL' : edition,
        search
      }
    };
    const response = await axios.get(
      `${URL()}/musicDao/getPlayerTracks`,
      config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetPodEditionSoldCount(
  podId: string,
  mediaIndex: number,
  editionIndex: number
) {
  try {
    const response = await axios.get(
      `${URL()}/musicDao/pod/getPodEditionSoldCount?podId=${podId}&mediaIndex=${mediaIndex}&editionIndex=${editionIndex}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoCheckSaleOfferExist(
  trackId: string,
  marketplace?: boolean
) {
  try {
    const config = new URLSearchParams({
      trackId,
      marketplace: marketplace ? '1' : '0'
    });
    const response = await axios.get(
      `${URL()}/musicDao/track/hasSaleOffer?` + config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoCheckBuyOfferExist(
  trackId: string,
  offerId: string,
  marketplace?: boolean
) {
  try {
    const config = new URLSearchParams({
      trackId,
      offerId,
      marketplace: marketplace ? '1' : '0'
    });
    const response = await axios.get(
      `${URL()}/musicDao/track/hasBuyOffer?` + config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoCheckOwnerChanged(
  trackId: string,
  owner: string,
  marketplace?: boolean
) {
  try {
    const config = new URLSearchParams({
      trackId,
      owner,
      marketplace: marketplace ? '1' : '0'
    });
    const response = await axios.get(
      `${URL()}/musicDao/track/checkOwnerChanged?` + config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
