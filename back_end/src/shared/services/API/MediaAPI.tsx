import axios, { CancelTokenSource } from 'axios';
import URL from 'shared/functions/getURL';
import { UserInfo } from 'store/actions/UsersInfo';
import { getRandomAvatarForUserIdWithMemoization } from '../user/getUserAvatar';
import { removeUndef } from 'shared/helpers/fp';
import { removeAllUnnecessaryZeros } from 'shared/functions/commonFunctions';
import { ICreateMediaPayload } from 'shared/types';

export enum MediaType {
  Video = 'VIDEO_TYPE',
  LiveVideo = 'LIVE_VIDEO_TYPE',
  Audio = 'AUDIO_TYPE',
  LiveAudio = 'LIVE_AUDIO_TYPE',
  Blog = 'BLOG_TYPE',
  BlogSnap = 'BLOG_SNAP_TYPE',
  DigitalArt = 'DIGITAL_ART_TYPE'
}

// TODO: fix this
export enum BlockchainType {
  // chains
  Wax = 'WAX',
  Music = 'MUSIC',
  Eth = 'eth',
  Klaytn = 'Klaytn',
  Binance = 'Binance',
  Polygon = 'Polygon',
  Hicetnunc = 'Hicetnunc'
}

export enum PlatformType {
  // platforms
  Music = 'MUSIC',
  Wax = 'WAX',
  Hicetnunc = 'Hicetnunc',
  Binance = 'Binance',
  Zora = 'Zora',
  Mirror = 'Mirror',
  Opensea = 'Opensea',
  Topshot = 'Topshot',
  Showtime = 'Showtime',
  Foundation = 'Foundation'
}

export enum MediaStatus {
  All = 'all',
  BuyNow = 'buyNow',
  OnAuction = 'auction',
  LiveNow = 'liveNow',
  New = 'new'
}

export enum PaymentType {
  Dynamic = 'DYNAMIC',
  Fixed = 'FIXED'
}

export enum MediaSource {
  Music = 'music',
  Eth = 'eth'
}

export type Media = MusicMedia | EthMedia;

export type MusicMedia = MusicMediaDTO & {
  source: MediaSource.Music;
  eth: false;
  ImageUrl?: string;
  Artist?: {
    name: string;
    imageURL: string;
    urlSlug: string;
  };
  SavedCollabs?: Array<{
    id: string;
    name: string;
    imageURL: string;
    urlSlug: string;
    [key: string]: any;
  }>;
  usdPrice: string;
  price: string;
  Url: string;
  UrlMainPhoto: string;
  IsUploaded?: boolean;
};

export type EthMedia = EthMediaDTO & {
  source: MediaSource.Eth;
  eth: true;
  randomAvatar: string;
  usdPrice: string;
  dimensions: any;
  IsUploaded?: boolean;
};

const isMusicMediaDTO = (
  dto: MusicMediaDTO | EthMediaDTO
): dto is MusicMediaDTO => dto['blockchain'] === 'MUSIC';

export type MusicMediaDTO = {
  blockchain: 'MUSIC';
  Collabs: Record<string, string>;
  Creator: string;
  CreatorId: string;
  Copies: number;
  CountStreamers: number;
  CountWatchers: number;
  EditorPages?: Array<any>;
  EndedTime: number;
  EndingTime: number;
  ExpectedDuration: number;
  FundingToken: string;
  HasPhoto: boolean;
  id: string;
  IsRecord: boolean;
  Likes: string[];
  LimitedEdition: any[];
  MainStreamer: string;
  MediaDescription: string;
  MediaName: string;
  MediaSymbol: string;
  Moderators: any[];
  NumLikes: number;
  OnlineModerators: any[];
  OnlineStreamers: string[];
  PaymentType: PaymentType;
  PodAddress: string;
  Price: number;
  PricePerSecond: any;
  PriceType: string;
  RecordCopies: number;
  RecordPaymentType: string;
  RecordPrice: number;
  RecordPricePerSecond: number;
  RecordRoyalty: number;
  RecordToken: string;
  ReleaseDate: number;
  Requester: string;
  Rewards: string;
  RoomName: string;
  RoomState: string;
  Royalty: number;
  SavedCollabs?: Array<{
    id: string;
    [key: string]: any;
  }>;
  SessionId: Record<string, string>;
  SharingPct: number;
  StartedTime: any;
  StartingTime: number;
  Streamers: string[];
  StreamingToken: string;
  StreamingUrl: string;
  TotalWatchers: number;
  Type: MediaType;
  Video: boolean;
  Watchers: any[];
  ViewConditions: {
    ViewingToken: string;
    [key: string]: any;
  };
  QuickCreation: boolean;
  dimensions: {
    width: number;
    height: number;
  };
  Url: string;
  UrlMainPhoto: string;
};

type EthMediaDTO = {
  collectedAtBlock?: any;
  collection_address: string;
  collection: string;
  creator: string;
  description: string;
  id: string;
  likes: number;
  link: string;
  owner: string;
  price: string;
  status: string[];
  tag: string;
  title: string;
  token_id: string;
  type: MediaType;
  url: string;
  Url: string;
  mediaUrl?: string;
  dimensions: {
    width: number;
    height: number;
  };
};

export type SearchMediaFilters = {
  searchValue?: string;
  mediaTypes: MediaType[];
  blockChains: BlockchainType[];
  collection?: string;
  status?: MediaStatus;
};

export type SearchMediaResult = {
  lastIds: any;
  lastIdBlockchain: string;
  hasMore: boolean;
  data: Media[];
};

type GetMediasFiltersDTO = {
  searchValue: '' | string; // empty string is used on the backend to encode no search value :O
  mediaTypes: MediaType[];
  blockChains: BlockchainType[];
  collection?: string;
  status?: MediaStatus;
};

type GetMediasResultDTO =
  | {
      success: true;
      lastIds: any; // backend returns string "null" for empty value :O
      lastIdBlockchain: string;
      hasMore: boolean;
      data: Array<MusicMediaDTO | EthMediaDTO>;
    }
  | { success: false };

let source: CancelTokenSource;

export const successFunc = (res) => res.data;
export const failFunc = (e: Error) => {
  console.log(e.message);
  throw new Error(e.message);
};

type ShareMediaResult =
  | {
      success: true;
    }
  | { success: false };

export const shareMedia = async ({
  toUsersIds,
  byUserId,
  mediaId,
  mediaType
}: {
  toUsersIds: string[];
  byUserId: string;
  mediaId: string;
  mediaType: MediaType;
}): Promise<ShareMediaResult> => {
  const mediaIdSlug = mediaId.replace(/\s/g, '');

  const params = {
    Users: toUsersIds,
    MediaSymbol: mediaId,
    userId: byUserId,
    mediaType: mediaType
  };

  const response = await axios.post(
    `${URL()}/media/shareMedia/${mediaIdSlug}`,
    params
  );

  return response.data;
};

export const shareMediaToSocial = async ({
  id,
  type = 'Media',
  subType = ''
}: {
  id: string;
  type?: string;
  subType?: string;
}): Promise<ShareMediaResult> => {
  const idSlug = id.replace(/\s/g, '');
  const params = {
    type,
    subType
  };

  const response = await axios.post(
    `${URL()}/media/shareMediaToSocial/${idSlug}`,
    params
  );

  return response.data;
};

export const createMedia = async (
  address: string,
  payload: ICreateMediaPayload,
  additionalData: Object,
  metadataID: string
): Promise<any> => {
  try {
    const requestData = {
      Function: 'createMedia',
      Address: address,
      Signature: '',
      Payload: payload
    };
    const body = {
      Data: requestData,
      AdditionalData: { ...additionalData, cid: metadataID }
    };
    const response = await axios.post(`${URL()}/media/createMedia/v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};

export const openNFT = async (data): Promise<any> => {
  return await axios
    .post(`${URL()}/media/openNFT/v2`, data)
    .then(successFunc)
    .catch(failFunc);
};

export const closeNFT = async (data): Promise<any> => {
  return await axios
    .post(`${URL()}/media/closeNFT/v2`, data)
    .then(successFunc)
    .catch(failFunc);
};

export const getUserMedias = async (userAdrress): Promise<any> => {
  try {
    const config = {
      params: {
        userAddress: userAdrress
      }
    };
    const res = await axios.get(`${URL()}/media/getUserMedias`, config);
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export interface IFractionalise {
  TokenSymbol: string;
  OwnerAddress: string;
  Fraction: number;
  BuyBackPrice: number;
  InitialPrice: number;
  FundingToken: string;
  InterestRate: number;
}

export async function fractionalise(
  address: string,
  payload: IFractionalise,
  additionalData: Object
): Promise<any> {
  try {
    const requestData = {
      Function: 'fractionalise',
      Address: address,
      Signature: '',
      Payload: payload
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData
    };
    const response = await axios.post(`${URL()}/media/fractionalise_v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface INewBuyOrder {
  Amount: number;
  Price: number;
  Token: string;
  TokenSymbol: string;
  BAddress: string;
}

export async function newBuyOrder(
  address: string,
  payload: INewBuyOrder,
  additionalData: Object
): Promise<any> {
  try {
    const requestData = {
      Function: 'newBuyOrder',
      Address: address,
      Signature: '',
      Payload: payload
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData
    };
    const response = await axios.post(`${URL()}/media/newBuyOrder_v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface INewSellOrder {
  Amount: number;
  Price: number;
  Token: string;
  TokenSymbol: string;
  SBAddress: string;
}

export async function newSellOrder(
  address: string,
  payload: INewSellOrder,
  additionalData: Object
): Promise<any> {
  try {
    const requestData = {
      Function: 'newSellOrder',
      Address: address,
      Signature: '',
      Payload: payload
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData
    };
    const response = await axios.post(`${URL()}/media/newSellOrder_v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IBuyFraction {
  TokenSymbol: string;
  SAddress: string;
  OrderId: string;
  Amount: number;
  BuyerAddress: string;
}

export async function buyFraction(
  address: string,
  payload: IBuyFraction,
  additionalData: Object
): Promise<any> {
  try {
    const requestData = {
      Function: 'buyFraction',
      Address: address,
      Signature: '',
      Payload: payload
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData
    };
    const response = await axios.post(`${URL()}/media/buyFraction_v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface ISellFraction {
  TokenSymbol: string;
  BAddress: string;
  OrderId: string;
  Amount: number;
  SellerAddress: string;
}

export async function sellFraction(
  address: string,
  payload: ISellFraction,
  additionalData: Object
): Promise<any> {
  try {
    const requestData = {
      Function: 'sellFraction',
      Address: address,
      Signature: '',
      Payload: payload
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData
    };
    const response = await axios.post(`${URL()}/media/sellFraction_v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IDeleteOrder {
  OrderId: string;
  RequesterAddress: string;
  TokenSymbol: string;
}

export async function deleteBuyOrder(
  address: string,
  payload: IDeleteOrder,
  additionalData: Object
): Promise<any> {
  try {
    const requestData = {
      Function: 'deleteBuyOrder',
      Address: address,
      Signature: '',
      Payload: payload
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData
    };
    const response = await axios.post(`${URL()}/media/deleteBuyOrder_v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function deleteSellOrder(
  address: string,
  payload: IDeleteOrder,
  additionalData: Object
): Promise<any> {
  try {
    const requestData = {
      Function: 'deleteSellOrder',
      Address: address,
      Signature: '',
      Payload: payload
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData
    };
    const response = await axios.post(
      `${URL()}/media/deleteSellOrder_v2`,
      body
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function mediaGetPlaylists(
  lastId?: string,
  search?: string,
  userId?: string
) {
  try {
    const config = {
      params: {
        lastId,
        search,
        userId
      }
    };
    const response = await axios.get(`${URL()}/media/getPlaylists`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
export async function mediaGetMyPlaylists(lastId?: string) {
  try {
    const config = {
      params: {
        lastId
      }
    };
    const response = await axios.get(`${URL()}/media/getMyPlaylists`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
export async function mediaGetUserPlaylists(userAdress, lastId?: string) {
  try {
    const config = {
      params: {
        lastId
      }
    };
    const response = await axios.get(
      `${URL()}/media/getUserPlaylists/${userAdress}`,
      config
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
export async function mediaGetPlaylistDetail(playListId) {
  try {
    const response = await axios.get(
      `${URL()}/media/getPlaylist/${playListId}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
export async function mediaAddSongToPlaylist(payload): Promise<any> {
  try {
    const response = await axios.post(
      `${URL()}/media/addSongsToPlaylist`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
export async function mediaRemoveSongFromPlaylist(payload): Promise<any> {
  try {
    const response = await axios.post(
      `${URL()}/media/removeSongsFromPlaylist`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getSongNftFeed(payload: any): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/media/getSongNftFeed`, {
      params: payload
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getWeb3OwnersOfCollection(payload: any): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/marketplace/getWeb3OwnersOfCollection`,
      {
        params: payload
      }
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getWeb3OwnersOfPlatform(payload: any): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/marketplace/getWeb3OwnersOfPlatform`,
      {
        params: payload
      }
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getNFTCollections(payload: any): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/marketplace/getWeb3MusicCollections`,
      {
        params: payload
      }
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getPlatforms(payload: any): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/marketplace/getPlatforms`, {
      params: payload
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getWeb3TracksOfCollection(payload: any): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/marketplace/getWeb3TracksOfCollection`,
      {
        params: payload
      }
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getWeb3TracksOfPlatform(payload: any): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/marketplace/getWeb3TracksOfPlatform`,
      {
        params: payload
      }
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getWeb3OwnedTracksOfPlatform(payload: any): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/marketplace/getWeb3OwnedTracksOfPlatform`,
      {
        params: payload
      }
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function geCollectionsOfPlatform(payload: any): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/marketplace/geCollectionsOfPlatform`,
      {
        params: payload
      }
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function geTopCollectionsOfPlatform(payload: any): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/marketplace/geTopCollectionsOfPlatform`,
      {
        params: payload
      }
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getWeb3Collection(collectionId: string): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/marketplace/collections/${collectionId}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getWeb3Platform(platformId: string): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/marketplace/platforms/${platformId}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getWeb3Song(songId: string): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/marketplace/getWeb3Song/${songId}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getAllWeb3Songs(payload: any): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/marketplace/getAllWeb3Songs`, {
      params: payload
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getNewlyMintedSongs(payload: any): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/marketplace/getNewlyMintedSongs`,
      {
        params: payload
      }
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getWeb3SongsOfArtist(payload: any): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/marketplace/getWeb3SongsOfArtist`,
      {
        params: payload
      }
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getTopWeb3Songs(payload: any): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/marketplace/getTopWeb3Songs`, {
      params: payload
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getTopPlatforms(): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/marketplace/getTopPlatforms`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getTopWeb3Collections(payload: any): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/marketplace/getTopWeb3Collections`,
      {
        params: payload
      }
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getWeb3Artists(payload: any): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/marketplace/getWeb3Artists`, {
      params: payload
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getWeb3Artist(artistId: string): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/marketplace/getWeb3Artist/${artistId}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getTopWeb3Artists(payload: any): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/marketplace/getTopWeb3Artists`, {
      params: payload
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getWeb3SongComments(
  songId: string,
  lastDate: number | undefined
): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/musicDao/getCommentsOnSongNft`, {
      params: {
        songId,
        lastDate
      }
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function addWeb3SongComments(
  songId: string,
  response: string
): Promise<any> {
  try {
    const body = {
      songId,
      response
    };
    const res = await axios.post(`${URL()}/musicDao/addCommentOnSongNft`, body);
    return res.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getWeb3OtherSongsInCollection(
  collectionAddress: string
): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/musicDao/getOtherSongsInCollection`,
      {
        params: {
          collectionAddress
        }
      }
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
