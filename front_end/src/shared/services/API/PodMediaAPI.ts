export interface IInvestPod {
  Investor: string;
  PodAddress: string;
  Amount: number;
}

export interface IRegisterMedia {
  Requester: string;
  PodAddress: string;
  MediaSymbol: string;
  Type: string;
  PaymentType: string;
  Copies: number;
  Royalty: number;
  FundingToken: string;
  ReleaseDate: number;
  PricePerSecond: number;
  Price: number;
  IsRecord: true;
  RecordToken: string;
  RecordPaymentType: string;
  RecordPrice: number;
  RecordPricePerSecond: number;
  RecordCopies: number;
  RecordRoyalty: number;
}

export interface IBuySellPodTokens {
  Trader: string;
  PodAddress: string;
  Amount: number;
}

export interface IUploadMedia {
  PodAddress: string;
  MediaSymbol: string;
}

export interface IInitiatePodPodInfo {
  Creator: string;
  TokenName?: string;
  TokenSymbol?: string;
  IsInvesting?: boolean;
  AMM?: string;
  Spread?: number;
  FundingTokenPrice?: number;
  FundingToken?: string;
  FundingDate?: number;
  FundingTarget?: number;
  InvestorDividend?: number;
  MaxSupply?: number;
  MaxPrice?: number;
  DateExpiration?: number;
  Collabs: string[];
}

export interface IInitiatePodMedias {
  MediaName: string;
  MediaSymbol: string;
  Type: string;
  ReleaseDate: number;
  Genre?: string;
}

export interface IInitiatePod {
  PodInfo: IInitiatePodPodInfo;
  Medias?: IInitiatePodMedias[];
}
