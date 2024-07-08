import { AbstractConnector } from '@web3-react/abstract-connector';
import {
  BscConnector,
  UserRejectedRequestError
} from '@binance-chain/bsc-connector';
import { ConnectionRejectedError } from 'use-wallet';
import { InjectedConnector } from '@web3-react/injected-connector';
import { injected, walletconnect, bscConnect } from 'shared/connectors';
import MetaMaskLogo from 'assets/walletImages/metamask.svg';
import WalletConnectLogo from 'assets/walletImages/wallet_connect.svg';
import BinanceExtensionLogo from 'assets/walletImages/Binance.svg';
import MusicWalletLogo from 'assets/tokenImages/MUSIC.webp';
import WaxWalletLogo from 'assets/walletImages/waxWallet.webp';
import PolkadotWalletLogo from 'assets/walletImages/polkadot.svg';
import { polygonAPI, ethAPI, binanceAPI } from 'shared/services/API/web3';
import Web3Config from 'shared/connectors/web3/config';

export const MUSIC_ADDRESS = '0x4c6a375e66440949149720f273d69fcd11b1564b';
export const MUSIC_ETH_ACCOUNT = '0x7d994063E2C98b2F49b13418Fc3FE58c45DdcC0D';
export const walletConnect = {
  walletconnect: { rpcUrl: process.env.REACT_APP_INFURA_URL || '' },
  bsc: {
    web3ReactConnector() {
      return new BscConnector({ supportedChainIds: [56, 97] });
    },
    handleActivationError(err) {
      if (err instanceof UserRejectedRequestError) {
        return new ConnectionRejectedError();
      }
    }
  }
};

export const musicTokenList = [
  'BAL',
  'BAT',
  'BNB',
  'COMP',
  'DAI',
  'EOS',
  'ETH',
  'LINK',
  'MKR',
  'MUSIC',
  'UNI',
  'USDT',
  'WBTC',
  'YFI',
  'TRAX',
  'PIX'
];

export const chainId: number = 1;

export const POLYGON_CHAIN_IDS = [137, 80001];

export const claimAmount = 0.2;

export const polygonConnector = new InjectedConnector({
  supportedChainIds: POLYGON_CHAIN_IDS
});

export const PRIMARY_SALE_FEE = 5;

export const TOLERANCE = 0.005;

export type WalletInfo = {
  title: string;
  description: string;
  logo: string;
  type: 'metamask' | 'walletconnect' | 'binance' | 'wax' | 'polkadot';
  connector?: AbstractConnector;
};

export const RANDOM_MOCK_PLAYLISTS_LENGTH = 19;
export const WALLETS: WalletInfo[] = [
  {
    title: 'MetaMask',
    description: 'Connect to your MetaMask Wallet',
    logo: MetaMaskLogo,
    connector: injected,
    type: 'metamask'
  },
  {
    title: 'WalletConnect',
    description: 'Connect to your WalletConnect',
    logo: WalletConnectLogo,
    connector: walletconnect,
    type: 'walletconnect'
  },
  {
    title: 'Binance Extension',
    description: 'Connect to your Binance Wallet',
    logo: BinanceExtensionLogo,
    connector: bscConnect,
    type: 'binance'
  },
  {
    title: 'Wax Wallet',
    description: 'Connect to your Wax Wallet',
    logo: WaxWalletLogo,
    type: 'wax'
  },
  {
    title: 'Polkadot Wallet',
    description: 'Connect to your Polkadot Wallet',
    logo: PolkadotWalletLogo,
    type: 'polkadot'
  }
];

export const erc20ToWeiUnit = {
  TRAX: 'ether',
  USDT: 'mwei',
  USDC: 'ether',
  DAI: 'ether',
  PIX: 'ether',
  ETH: 'ether',
  MUSIC: 'ether'
};

export const BlockchainNets: any =
  process.env.REACT_APP_ENV === 'prod'
    ? // prod (mainnets)
      [
        {
          name: 'POLYGON',
          value: 'Polygon blockchain',
          image: 'tokenImages/POLYGON.webp',
          chainId: 137,
          config: Web3Config.Polygon,
          apiHandler: polygonAPI,
          scan: { name: 'POLYGONSCAN', url: 'https://polygonscan.com' }
        },
        {
          name: 'ETHEREUM',
          value: 'Ethereum blockchain',
          image: 'tokenImages/ETH.webp',
          chainId: 1,
          config: Web3Config.Ethereum,
          apiHandler: ethAPI,
          scan: { name: 'ETHERSCAN', url: 'https://etherscan.io' }
        }
        // {
        //   name: "BINANCE",
        //   value: "Binance Smart Chain",
        //   image: "tokenImages/BNB.webp",
        //   chainId: 56,
        //   scan: { name: "BINANCESCAN", url: "https://bscscan.com" },
        // },
      ]
    : // dev (testnets)
      [
        {
          name: 'POLYGON',
          value: 'Polygon blockchain',
          image: 'tokenImages/POLYGON.webp',
          chainId: 80001,
          config: Web3Config.Polygon,
          apiHandler: polygonAPI,
          scan: { name: 'POLYGONSCAN', url: 'https://mumbai.polygonscan.com' }
        },
        {
          name: 'ETHEREUM',
          value: 'Ethereum blockchain',
          image: 'tokenImages/ETH.webp',
          chainId: 4,
          config: Web3Config.Ethereum,
          apiHandler: ethAPI,
          scan: { name: 'ETHERSCAN', url: 'https://rinkeby.etherscan.io' }
        }
        // {
        //   name: "BINANCE",
        //   value: "Binance Smart Chain",
        //   image: "tokenImages/BNB.webp",
        //   chainId: 97,
        //   config: Web3Config.Binance,
        //   apiHandler: binanceAPI,
        //   scan: { name: "BINANCESCAN", url: "https://testnet.bscscan.com" },
        // },
      ];

export const LoanBlockchainNet: any = [
  {
    name: 'ETH',
    value: 'Ethereum blockchain',
    image: 'tokenImages/ETH.webp',
    chainId: 4,
    config: Web3Config.Ethereum,
    apiHandler: ethAPI
  },
  {
    name: 'POLYGON',
    value: 'Polygon blockchain',
    image: 'tokenImages/POLYGON.webp',
    chainId: 80001,
    config: Web3Config.Polygon,
    apiHandler: polygonAPI
  }
];

export const TradeTraxTokenList = [
  { name: 'USDT', value: 'USDT', image: 'tokenImages/USDp.svg' },
  { name: 'TRAXp', value: 'TRAXp', image: 'tokenImages/MUSICp.svg' }
];

export function validEmail(email: string): boolean {
  return new RegExp(
    /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  ).test(email);
}

export const handleDiscordLink = () => {
  window.open('', '_blank');
};

export const handleTelegramLink = () => {
  window.open('', '_blank');
};

export const handleYoutubeLink = () => {
  window.open('', '_blank');
};

export const handleFacebookLink = () => {
  window.open('', '_blank');
};

export const handleTwitterLink = () => {
  window.open('https://twitter.com/on__myx', '_blank');
};

export const handleLinkedinLink = () => {
  window.open('', '_blank');
};

export const handleInstagramLink = () => {
  window.open('https://www.instagram.com/on_myx/', '_blank');
};

export const handleTiktokLink = () => {
  window.open('', '_blank');
};

export const handleMediumLink = () => {
  window.open('https://medium.com/@myx_music', '_blank');
};

export const handleAboutLink = () => {
  window.open('', '_blank');
};

export const handleNewsletterLink = () => {
  window.open('', '_blank');
};

export const handleWyrtNFTLink = () => {
  window.open('', '_blank');
};

export const handleClaimIDOTokenLink = () => {
  window.open('', '_blank');
};

export const handleLightPaperLink = () => {
  window.open('', '_blank');
};

export const handleTokenLink = () => {
  window.open('', '_blank');
};

export const handleKnowledgeHubLink = () => {
  window.open('', '_blank');
};

export const handleTermsAndConditionsLink = () => {
  window.open('', '_blank');
};

export const EUROPEAN_COUNTRIES = [
  {
    name: 'Andorra',
    id: 'AD'
  },
  {
    name: 'Albania',
    id: 'AL'
  },
  {
    name: 'Austria',
    id: 'AT'
  },
  {
    name: 'Åland Islands',
    id: 'AX'
  },
  {
    name: 'Bosnia and Herzegovina',
    id: 'BA'
  },
  {
    name: 'Belgium',
    id: 'BE'
  },
  {
    name: 'Bulgaria',
    id: 'BG'
  },
  {
    name: 'Belarus',
    id: 'BY'
  },
  {
    name: 'Switzerland',
    id: 'CH'
  },
  {
    name: 'Cyprus',
    id: 'CY'
  },
  {
    name: 'Czech Republic',
    id: 'CZ'
  },
  {
    name: 'Germany',
    id: 'DE'
  },
  {
    name: 'Denmark',
    id: 'DK'
  },
  {
    name: 'Estonia',
    id: 'EE'
  },
  {
    name: 'Spain',
    id: 'ES'
  },
  {
    name: 'Finland',
    id: 'FI'
  },
  {
    name: 'Faroe Islands',
    id: 'FO'
  },
  {
    name: 'France',
    id: 'FR'
  },
  {
    name: 'United Kingdon',
    id: 'GB'
  },
  {
    name: 'Guernsey',
    id: 'GG'
  },
  {
    name: 'Greece',
    id: 'GR'
  },
  {
    name: 'Croatia',
    id: 'HR'
  },
  {
    name: 'Hungary',
    id: 'HU'
  },
  {
    name: 'Ireland',
    id: 'IE'
  },
  {
    name: 'Isle of Man',
    id: 'IM'
  },
  {
    name: 'Iceland',
    id: 'IC'
  },
  {
    name: 'Italy',
    id: 'IT'
  },
  {
    name: 'Jersey',
    id: 'JE'
  },
  {
    name: 'Liechtenstein',
    id: 'LI'
  },
  {
    name: 'Lithuania',
    id: 'LT'
  },
  {
    name: 'Luxembourg',
    id: 'LU'
  },
  {
    name: 'Latvia',
    id: 'LV'
  },
  {
    name: 'Monaco',
    id: 'MC'
  },
  {
    name: 'Moldova, Republic of',
    id: 'MD'
  },
  {
    name: 'Macedonia, The Former Yugoslav Republic of',
    id: 'MK'
  },
  {
    name: 'Malta',
    id: 'MT'
  },
  {
    name: 'Netherlands',
    id: 'NL'
  },
  {
    name: 'Norway',
    id: 'NO'
  },
  {
    name: 'Poland',
    id: 'PL'
  },
  {
    name: 'Portugal',
    id: 'PT'
  },
  {
    name: 'Romania',
    id: 'RO'
  },
  {
    name: 'Russian Federation',
    id: 'RU'
  },
  {
    name: 'Sweden',
    id: 'SE'
  },
  {
    name: 'Slovenia',
    id: 'SI'
  },
  {
    name: 'Svalbard and Jan Mayen',
    id: 'SJ'
  },
  {
    name: 'Slovakia',
    id: 'SK'
  },
  {
    name: 'San Marino',
    id: 'SM'
  },
  {
    name: 'Ukraine',
    id: 'UA'
  },
  {
    name: 'United States',
    id: 'US'
  },
  {
    name: 'Holy See (Vatican City State)',
    id: 'VA'
  }
];

export const ZOO_APPS_NAMES = [
  'Trax',
  'Pix',
  'DAOs',
  'Social',
  'Exchange',
  'Metaverse'
];

export const ZOO_APPS_BUNDLE = [
  {
    name: 'Trax',
    connect: '/trax-connect',
    type: 'trax',
    count: '6531',
    description: 'The New Era of Music Streaming',
    longDescription:
      'Welcome to Trax, the first decentralized music streaming app of its kind, built to give the power back to the people who deserve it the most - artists and their biggest fans. Trax allows artists to earn more than 3X what they do on Spotify, aims to kill piracy, and allows listeners to earn alongside their favorite artists. Trax is a mix of decentralized Spotify, Axie Infinity, and DeFi functionalities.\n\n \
    Features:\n \
    Web and Mobile music player\n \
    Music DAO\n \
    High Yield options\n \
    Staking\n \
    Capsules\n \
    Claimable Music\n\n \
    \
    Trax is a decentralized app that is governed by holders of the Trax ($TRAX) token, available for purchase in August 2021.',
    url: 'trax',
    appUrl: '/trax',
    photo: [require('assets/zooImages/Music-Dao.webp')],
    isPublished: true
  },
  {
    name: 'Metaverse',
    connect: '/metaverse-connect',
    type: 'metaverse',
    count: '1234',
    description: 'A new world awaits your step into the Metaverse ',
    longDescription:
      'Show off your NFTs and creations in a 3D world. Experience music, video and digital art in a completely different way, even play and compete with mini-games in this new virtual world. In the future even socialise and meet people, navigate around the world, form communities and build your own home, venue or even city.',
    url: 'metaverse',
    appUrl: '/metaverse',
    photo: [
      require('assets/zooImages/Metaverse.webp'),
      require('assets/zooImages/Metaverse1.webp'),
      require('assets/zooImages/Metaverse2.webp'),
      require('assets/zooImages/Metaverse3.webp'),
      require('assets/zooImages/Metaverse4.webp'),
      require('assets/zooImages/Metaverse5.webp')
    ],
    isPublished: true
  },
  {
    name: 'Flix',
    type: 'flix',
    connect: '/flix-connect',
    count: '9875',
    description:
      'Stream unlimited decentralized video, tv shows and movies from your laptop, tablet or mobile device',
    longDescription:
      'Welcome to Flix, the first decentralized video streaming of its kind. To compare it to what’s out there, it is like combining a decentralized Netflix with BitClout, plus adding gamified and money-making components of Axie Infinity with DeFi functionalities. To put it simply, it is an entertainment app, with a whole score of financial features built in.\n\n \
    Features:\n \
    Web and Mobile video player\n \
    Video DAO\n \
    High Yield options\n \
    Staking\n \
    Capsules\n \
    Claimable Movies\n\n \
    Flix is a decentralized app that is governed by the holders of the Flix ($FLIX) token, available for purchase in 2021.',
    url: 'flix',
    appUrl: '/flix',
    photo: [require('assets/zooImages/Flix.webp')],
    isPublished: false
  },
  {
    name: 'DAOs',
    connect: '/daos-connect',
    type: 'dao',
    count: '3654',
    description:
      'Discover Decentralized Communities for Groups, Brands, and Businesses.',
    longDescription:
      'Welcome to DAOs, a revolutionary take on online communities. Join the DAO of your favorite creator, business, brand or individual - or create your own DAO to connect with your community in an entirely new way. \
\
\
    Features: \
    DAO Tokens \
    Social tools \
    DeFi tools \
    Developer portal',
    url: 'daos',
    appUrl: '/dao',
    photo: [require('assets/zooImages/Dao.webp')],
    isPublished: false
  },
  {
    name: 'Change',
    connect: '/change-connect',
    type: 'change',
    count: '3654',
    description: 'Bridge users from Web 2.0 to Web 3.0',
    longDescription:
      'The weak point of referral systems is not weak anymore with Change. The weak point in most referral systems is that people don’t want to ask other people to help with with a referral, and the overall process of asking to actually using a referral is minuscule, otherwise all referral techniques would have been successful. This dapp creates a gated referral system whose first layer is setup by the app owner, second layer is only meaningful for an influencer/power user, and the third layer is for normal users - taking the friction of asking anyone to use the referral out of the equation. With Change, it is a matter of ‘fomo’ to have used a referral created by an influencer whom I follow, because if I don’t use that referral, someone else will. \
\
\
    How it works: \
    Projects can create specific tasks for referral schemes, deposit funds and set limits - everyone can see money deposited, money locked and remaining \
    Power users / influencers can lock parts of projects funds for their own community, who then complete tasks from the project and/or tasks from the power users \
    Power users/ influencers can mint and manage their own coin, anyone who completes these tasks can earn both money and their own coin (for example USDC + $Bob coin)  \
    A user can complete a task from a project or a power user',
    url: 'change',
    appUrl: '/change',
    photo: [
      require('assets/zooImages/Change.webp'),
      require('assets/zooImages/Change-1.webp'),
      require('assets/zooImages/Change-2.webp')
    ],
    isPublished: false
  },
  {
    name: 'Social',
    connect: '/social-connect',
    type: 'social',
    count: '1234',
    description:
      'Your One Stop Shop for Everything Social in the Music Ecosystem ',
    longDescription:
      'With Social, build your profile and connect with ease. See what parts of the platform you are a part of, browse trending DAOs, create and distribute social tokens and badges, and coming out this year, attach your very own Metaverse world to your profile. \
\
      Features: \
      Feed \
      Discover \
      Social Tokens \
      Badges \
      Trust and Endorsement Scores \
      3D Metaverses',
    url: 'social',
    appUrl: '/social',
    photo: [require('assets/zooImages/Social.webp')],
    isPublished: false
  },
  {
    name: 'Exchange',
    type: 'exchange',
    count: '9875',
    description: 'Exchange App Tokens of the Music Ecosystem',
    longDescription:
      'With Exchange, apps can sell and exchange app tokens as well as different time-based scope tokens (sold in “G slabs”) which are then traded on Exchange. This helps projects and apps protect from the dump and for investors to limit their risk. Every single application inside Music will be a part of this exchange, even apps developed and launched by Music.',
    url: 'exchange',
    appUrl: '/exchange',
    photo: [require('assets/zooImages/Exchange.webp')],
    isPublished: true
  }
];

export const ZOO_APPS = [
  {
    name: 'Trax',
    connect: '/trax-connect',
    type: 'trax',
    count: '6531',
    description: 'The New Era of Music Streaming',
    longDescription:
      'Welcome to Trax, the first decentralized music streaming app of its kind, built to give the power back to the people who deserve it the most - artists and their biggest fans. Trax allows artists to earn more than 3X what they do on Spotify, aims to kill piracy, and allows listeners to earn alongside their favorite artists. Trax is a mix of decentralized Spotify, Axie Infinity, and DeFi functionalities.\n\n \
    Features:\n \
    Web and Mobile music player\n \
    Music DAO\n \
    High Yield options\n \
    Staking\n \
    Capsules\n \
    Claimable Music\n\n \
    \
    Trax is a decentralized app that is governed by holders of the Trax ($TRAX) token, available for purchase in August 2021.',
    url: 'trax',
    appUrl: '/trax',
    photo: [
      require('assets/zooImages/Music-Dao.webp'),
      require('assets/zooImages/Music-Dao-1.webp'),
      require('assets/zooImages/Music-Dao-2.webp')
    ],
    isPublished: true
  },
  {
    name: 'Exchange',
    type: 'exchange',

    connect: '/exchange-connect',
    count: '9875',
    description: 'Exchange App Tokens of the Music Ecosystem',
    longDescription:
      'With Exchange, apps can sell and exchange app tokens as well as different time based scope tokens (sold in “G slabs”) which are then traded on Exchange. This helps projects and apps protect from the dump and for investors to limit their risk. Every single application inside Music will be a part of this exchange, even apps developed and launched by Music.',
    url: 'exchange',
    appUrl: '/exchange',
    photo: [
      require('assets/zooImages/Exchange.webp'),
      require('assets/zooImages/Exchange-1.webp'),
      require('assets/zooImages/Exchange-2.webp')
    ],
    isPublished: true
  },
  {
    name: 'Metaverse',
    connect: '/metaverse-connect',
    type: 'metaverse',
    count: '1234',
    description: 'A new world awaits your step into the Metaverse',
    longDescription:
      'Show off your NFTs and creations in a 3D world. Experience music, video and digital art in a completely different way, even play and compete with mini-games in this new virtual world. In the future even socialise and meet people, navigate around the world, form communities and build your own home, venue or even city.',
    url: 'metaverse',
    appUrl: '/metaverse',
    photo: [
      require('assets/zooImages/Metaverse.webp'),
      require('assets/zooImages/Metaverse1.webp'),
      require('assets/zooImages/Metaverse2.webp'),
      require('assets/zooImages/Metaverse3.webp'),
      require('assets/zooImages/Metaverse4.webp'),
      require('assets/zooImages/Metaverse5.webp')
    ],
    isPublished: true
  },
  {
    name: 'Social',
    connect: '/social-connect',
    type: 'social',
    count: '1234',
    description:
      'Your One Stop Shop for Everything Social in the Music Ecosystem ',
    longDescription:
      'With Social, build your profile and connect with ease. See what parts of the platform you are a part of, browse trending DAOs, create and distribute social tokens and badges, and coming out this year, attach your very own Metaverse world to your profile.\n\n \
      Features:\n \
      Feed\n \
      Discover\n \
      Social Tokens\n \
      Badges\n \
      Trust and Endorsement Scores\n \
      3D Metaverses',
    url: 'social',
    appUrl: '/social',
    photo: [
      require('assets/zooImages/Social.webp'),
      require('assets/zooImages/Social-1.webp'),
      require('assets/zooImages/Social-2.webp')
    ],
    isPublished: false
  },
  {
    name: 'Change',
    connect: '/change-connect',
    type: 'change',
    count: '3654',
    description: 'Bridge users from Web 2.0 to Web 3.0',
    longDescription:
      'The weak point of referral systems is not weak anymore with Change. The weak point in most referral systems is that people don’t want to ask other people to help with with a referral, and the overall process of asking to actually using a referral is minuscule, otherwise all referral techniques would have been successful. This dapp creates a gated referral system whose first layer is setup by the app owner, second layer is only meaningful for an influencer/power user, and the third layer is for normal users - taking the friction of asking anyone to use the referral out of the equation. With Change, it is a matter of ‘fomo’ to have used a referral created by an influencer whom I follow, because if I don’t use that referral, someone else will.\n\n \
\
\
    How it works: \n \
    Projects can create specific tasks for referral schemes, deposit funds and set limits - everyone can see money deposited, money locked and remaining\n \
    Power users / influencers can lock parts of projects funds for their own community, who then complete tasks from the project and/or tasks from the power users \n \
    Power users/ influencers can mint and manage their own coin, anyone who completes these tasks can earn both money and their own coin (for example USDC + $Bob coin) \n \
    A user can complete a task from a project or a power user',
    url: 'change',
    appUrl: '/change',
    photo: [
      require('assets/zooImages/Change.webp'),
      require('assets/zooImages/Change-1.webp'),
      require('assets/zooImages/Change-2.webp')
    ],
    isPublished: false
  },
  {
    name: 'Pay',
    connect: '/pay-connect',
    type: 'pay',
    count: '9875',
    description:
      'Crypto payments made easy - pay, split, borrow, and receive credit',
    longDescription:
      'Welcome to Pay, a non custodial multip chain crypto payments dApp in the Music ecosystem. Pay allows you to use powerful and easy crypto payment solutions. Ranging from splitting payments, borrowing crypto, receiving credit, or making payments on a second by second basis (“Payment streaming”). Pay takes what works in Web2 (Ever wondered why there’s no Klarna or Splitwise for crypto?) while adding Web3 innovation. Welcome to Pay, a non custodial multip chain crypto payments dApp in the Music ecosystem. Pay allows you to use powerful and easy crypto payment solutions. Ranging from splitting payments, borrowing crypto, receiving credit, or making payments on a second by second basis (“Payment streaming”). Pay takes what works in Web2 (Ever wondered why there’s no Klarna or Splitwise for crypto?) while adding Web3 innovation.\n\n \
      Features:\n \
      Use your crypto wallet to make payments, either one time or “payment streaming”\n \
      Split payments using crypto, this includes stable coins, ETH and BTC\n \
      Create loans with crypto as collateral to make payments\n \
      Coming soon: get credit with your ‘Music Credit Score’\n\n \
      Pay launches Fall 2021.',
    url: 'pay',
    appUrl: '/pay',
    photo: [
      require('assets/zooImages/Pay-1.webp'),
      require('assets/zooImages/Pay-2.webp'),
      require('assets/zooImages/Pay-3.webp')
    ],
    isPublished: false
  },
  {
    name: 'Flix',
    connect: '/flix-connect',
    type: 'flix',
    count: '9875',
    description:
      'Stream unlimited decentralized video, tv shows and movies from your laptop, tablet or mobile device',
    longDescription:
      'Welcome to Flix, the first decentralized video streaming of its kind. To compare it to what’s out there, it is like combining a decentralized Netflix with BitClout, plus adding gamified and money-making components of Axie Infinity with DeFi functionalities. To put it simply, it is an entertainment app, with a whole score of financial features built in.\n\n \
      Features:\n \
      Web and Mobile video player\n \
      Video DAO\n \
      High Yield options\n \
      Staking\n \
      Capsules\n \
      Claimable Movies\n\n \
      Flix is a decentralized app that is governed by the holders of the Flix ($FLIX) token, available for purchase in 2021.',
    url: 'flix',
    appUrl: '/flix',
    photo: [
      require('assets/zooImages/Flix.webp'),
      require('assets/zooImages/Flix-1.webp'),
      require('assets/zooImages/Flix-2.webp')
    ],
    isPublished: false
  },
  {
    name: 'Music Governance',
    type: 'governance',
    connect: '/governance-connect',
    count: '4567',
    description: 'Discuss and vote on the direction of the Music ecosystem',
    longDescription:
      'Music Governance allows for the community to vote, propose, and govern the \
    Music Ecosystem. Through staking, Music Governance participants actively partake in the direction of the decentralized app ecosystem.',
    url: 'governance',
    appUrl: '/governance',
    photo: [
      require('assets/zooImages/Governance.webp'),
      require('assets/zooImages/Governance-1.webp'),
      require('assets/zooImages/Governance-2.webp')
    ],
    isPublished: false
  },

  {
    name: 'DAOs',
    connect: '/daos-connect',
    type: 'daos',
    count: '3654',
    description:
      'Discover Decentralized Communities for Groups, Brands, and Businesses.',
    longDescription:
      'Welcome to DAOs, a revolutionary take on online communities. Join the DAO of your favorite creator, business, brand or individual - or create your own DAO to connect with your community in an entirely new way.\n\n \
      Features:\n \
      DAO Tokens\n \
      Social tools\n \
      DeFi tools\n \
      Developer portal',
    url: 'daos',
    appUrl: '/daos',
    photo: [
      require('assets/zooImages/Dao.webp'),
      require('assets/zooImages/Dao-1.webp'),
      require('assets/zooImages/Dao-2.webp')
    ],
    isPublished: false
  },
  {
    name: 'Data',
    type: 'data',
    count: '696',
    connect: '/data-connect',
    description: 'Decentralized Advertising in the Music Ecosystem',
    longDescription:
      ' With Data, you take back control of one of your most powerful assets - your data. Data allows you to promote your content - from music to videos to tokens to DAOs - using $DATAp coins. Buy and trade this data asset class, stake for rewards and distribute to users who opt in and out of private mode, so your ads are hitting only those who are open to getting them.',
    url: 'data',
    appUrl: '/data',
    photo: [
      require('assets/zooImages/Data.webp'),
      require('assets/zooImages/Data-1.webp')
    ],
    isPublished: false
  },
  {
    name: 'Pods',
    connect: '/pods-connect',
    type: 'pods',
    count: '6877',
    description: 'With Pods, any imaginable asset can be tokenized.',
    longDescription:
      'Pods are a unique tool throughout Music Apps that allow you to tokenize any asset, customize it’s financial settings, and sell “Pod Tokens” (NFTs) to buyers. Pods are smart contracts which allow people to raise money, prefund new content, fractionalize existing content, and so much more!',
    url: 'pods',
    appUrl: '/pods',
    photo: [
      require('assets/zooImages/Pods.webp'),
      require('assets/zooImages/Pods-1.webp')
    ],
    isPublished: false
  },
  {
    name: 'Bux',
    connect: '/bux-connect',
    type: 'bux',
    count: '9875',
    description: 'A decentralized market for authors and their publications',
    longDescription:
      'Bux is a dapp in the Music Zoo, a decentralized App Store. The Bux web and mobile application will be live in 2021. It is best described as a Kindle+Medium, with DeFi functionalities. The app uses similar mechanisms to Trax and Flix, where creators earn a thier fair share, and readers can actively participate in the success of their favorite books, articles or publications. Bux creates a fair medium for creators to monetize from what they write, be it books, publications or long tail articles.\n\n \
      Features:\n \
      Web and mobile reading\n \
      High yield options\n \
      Bux DAO\n \
      Single piece staking and app staking\n \
      Claimable Books\n \
      Claimable Movies\n \
      Pods\n\n \
      The Bux app is fully owned and governed by $Bux token holders, a token set to launch in 2021.',
    url: 'bux',
    appUrl: '/bux',
    photo: [
      require('assets/zooImages/Bux.webp'),
      require('assets/zooImages/Bux-1.webp'),
      require('assets/zooImages/Bux-2.webp'),
      require('assets/zooImages/Bux-3.webp')
    ],
    isPublished: false
  },
  {
    name: 'Collabs',
    type: 'collabs',
    connect: '/collabs-connect',
    count: '7425',
    description:
      'Request and pledge to see collaborations with your favorite creators',
    longDescription:
      'Collabs allow for you to request for your favorite creators to collaborate together, and help raise funds for their project. If you’re a creator, you can request to collaborate with other creators to make your dream projects a reality, and receive funding from your community to help make it happen.',
    url: 'collabs',
    appUrl: '/collabs',
    photo: [
      require('assets/zooImages/Collabs.webp'),
      require('assets/zooImages/Collabs-1.webp'),
      require('assets/zooImages/Collabs-2.webp')
    ],
    isPublished: false
  }
];

export const ZOO_CAROUSEL_APPS = [
  {
    title: 'Social',
    description:
      'Your One Stop Shop for Everything Social in the Music Ecosystem',
    imageUrl: require('assets/zooImages/Social-carousel.webp')
  },
  {
    title: 'Pix',
    description: 'The NFT Marketplace For Your Digital Art',
    imageUrl: require('assets/zooImages/Music-carousel.webp')
  },
  {
    title: 'Trax',
    description: 'The New Era of Music Streaming',
    imageUrl: require('assets/zooImages/Music-carousel2.webp')
  },
  {
    title: 'DAOs',
    description:
      'Discover Decentralized Communities for Groups, Brands, and Businesses.',
    imageUrl: require('assets/zooImages/Dao-carousel.webp')
  },
  {
    title: 'Flix',
    description:
      'Stream unlimited decentralized video, tv shows and movies from your laptop, tablet or mobile device',
    imageUrl: require('assets/zooImages/Flix-carousel.webp')
  },
  {
    title: 'Exchange',
    description: 'Exchange App Tokens of the Music Ecosystem',
    imageUrl: require('assets/zooImages/Exchange-carousel2.webp')
  }
  // {
  //   title: "Metaverse",
  //   description: "A new world awaits your step into the Metaverse",
  //   imageUrl: require("assets/zooImages/Metaverse.webp"),
  // },
];

export const MusicGenres = [
  'alternative',
  'country',
  'dance',
  'electronic',
  'French pop',
  'hip-hop/rap',
  'house',
  'K-pop',
  'Latin',
  'film',
  'R&B/soul',
  'regional Mexicano',
  'reggae/dancehall',
  'rock',
  'singer/songwriter',
  'TV & stage',
  'worldwide',
  'afrobeat',
  'moods',
  'pop'
];

export const Mood = [
  'amusing',
  'upbeat',
  'tense',
  'beautiful',
  'calm',
  'relaxing',
  'dreamy',
  'energizing',
  'intimate',
  'cheerful',
  'sad',
  'scary',
  'triumphant'
];

export const MoodEmoji = [
  '😀',
  '😎',
  '😲',
  '🦋',
  '😌',
  '🏖️',
  '🌙',
  '🔥',
  '💘',
  '😇',
  '😔',
  '🎃',
  '🎊'
];

export const MusicPlatformPictures = [
  'audius',
  'catalog',
  'eulerbeats',
  'mintsongs',
  'myx',
  'omgkirby-genesis',
  'sound.xyz',
  'synthopia',
  'thedreamers',
  'theorbs'
];
