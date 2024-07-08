import React, {
  lazy,
  Suspense,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback
} from 'react';
import { useHistory, useParams } from 'react-router-dom';
// import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import useTheme from '@material-ui/core/styles/useTheme';
import withStyles from '@material-ui/core/styles/withStyles';

// import URL from 'shared/functions/getURL';
import { setSelectedUser } from 'store/actions/SelectedUser';
import {
  ArrowIcon,
  PagePreviewIcon,
  PagePreviewSmallIcon
} from '../../components/Icons/SvgIcons';
import { musicDaoPageStyles } from 'components/MusicDao/index.styles';
import ViewIcon from 'components/MusicDao/components/Icons/ViewMetaIcon';
import ButtonMusicPlayer from 'components/MusicDao/components/MusicPlayer/ButtonMusicPlayer';

import { useLogin } from 'shared/hooks/useLogin';
import Box from 'shared/ui-kit/Box';
// import { FruitSelect } from 'shared/ui-kit/Select/FruitSelect';
import {
  getDefaultAvatar,
  getDefaultBGImage
} from 'shared/services/user/getUserAvatar';
import Avatar from 'shared/ui-kit/Avatar';
import {
  CustomTable,
  CustomTableCellInfo,
  CustomTableHeaderInfo
} from 'shared/ui-kit/Table';
import { getWeb3Song } from 'shared/services/API';
import { CircularLoadingIndicator } from 'shared/ui-kit';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import getPhotoIPFS from 'shared/functions/getPhotoIPFS';
import { useShareMedia } from 'shared/contexts/ShareMediaContext';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { useTypedSelector } from 'store/reducers/Reducer';
import { refreshBuyingOffers } from 'shared/services/API/PodAPI';
import { Mood, MoodEmoji } from 'shared/constants/constants';
import { useAuth } from 'shared/contexts/AuthContext';
import { Color, SecondaryButton } from 'shared/ui-kit';
import { formatDateDefault, processImage } from 'shared/helpers';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import Loading from 'shared/ui-kit/Loading';

import DeleteIcon from 'assets/utilIcons/delete.webp';
import { ArrowLeftIcon } from '../GovernancePage/styles';
import { singleSongDetailPageStyles } from './index.styles';
import { getAllTokenInfos } from 'shared/services/API/TokenAPI';
const MusicPlayer = lazy(
  () => import('components/MusicDao/components/MusicPlayer/MusicPlayer')
);
const ArtistSongCard = lazy(
  () => import('components/MusicDao/components/Cards/ArtistSongCard')
);
const AcceptOfferModal = lazy(() => import('./modals/AcceptOfferModal'));
const OwnersModal = lazy(() => import('./modals/OwnersModal'));
const OwnerShipHistoryModal = lazy(
  () => import('./modals/OwnerShipHistoryModal')
);
const BuyNowModal = lazy(() => import('./modals/BuyNowModal'));
const MakeOfferModal = lazy(() => import('./modals/MakeOfferModal'));
const EditPriceModal = lazy(() => import('./modals/EditPriceModal'));
const SellingOfferModal = lazy(() => import('./modals/SellingOfferModal'));
const CancelSellingModal = lazy(() => import('./modals/CancelSellingModal'));
const RemoveOfferModal = lazy(() => import('./modals/RemoveOfferModal'));

const PremiumType = ['Bronze', 'Silver', 'Gold', 'Platinum'];

const TableHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerAlign: 'left',
    headerName: 'From'
  },
  {
    headerAlign: 'center',
    headerName: 'Price'
  },
  {
    headerAlign: 'center',
    headerName: 'Token'
  },
  {
    headerAlign: 'center',
    headerName: 'Date'
  },
  {
    headerAlign: 'center',
    headerName: ''
  }
];

const SellTableHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerAlign: 'left',
    headerName: 'User'
  },
  {
    headerAlign: 'center',
    headerName: 'Selling Price'
  },
  {
    headerAlign: 'center',
    headerName: 'Token'
  },
  {
    headerAlign: 'center',
    headerName: 'Transaction Hash'
  },
  {
    headerAlign: 'center',
    headerName: 'Date sold'
  },
  {
    headerAlign: 'center',
    headerName: ''
  }
];

const NFTActivityTableHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerAlign: 'left',
    headerName: 'Event'
  },
  {
    headerAlign: 'center',
    headerName: 'User'
  },
  {
    headerAlign: 'center',
    headerName: 'Selling Price'
  },
  {
    headerAlign: 'center',
    headerName: 'Token'
  },
  {
    headerAlign: 'center',
    headerName: 'Date sold'
  }
];

const OwnershipHistoryTableHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerAlign: 'left',
    headerName: 'Account'
  },
  {
    headerAlign: 'center',
    headerName: 'Date'
  }
];

const editionTypes = [
  {
    name: 'Normal',
    label: '',
    gradient: '#fff',
    borderColor: '#fff',
    color: '#fff'
  },
  {
    name: 'Gold',
    label: 'Gold',
    gradient:
      'radial-gradient(102.08% 748.61% at 39.39% -197.22%, rgba(255, 255, 255, 0) 0%, #E3CA87 100%)',
    borderColor: 'rbg(243, 232, 202)',
    color: '#807354'
  },
  {
    name: 'Platinum',
    label: 'Platinum',
    gradient:
      'radial-gradient(76.52% 561.11% at 49.43% -241.67%, rgba(196, 201, 209, 0) 0%, #636B76 100%), repeating-linear-gradient(-45deg, rgb(198, 198, 198), rgb(198, 198, 198) 1px, rgba(0, 0, 0, 0) 2px, rgba(0, 0, 0, 0) 8px)',
    borderColor: 'rbg(161, 164, 167)',
    color: '#3E3F46'
  },
  {
    name: 'Bronze',
    label: 'Bronze',
    gradient:
      'radial-gradient(102.08% 748.61% at 39.39% -197.22%, rgba(255, 211, 170, 0) 0%, #A65F1E 100%)',
    borderColor: 'rbg(229, 200, 162)',
    color: '#805C54'
  },
  {
    name: 'Silver',
    label: 'Silver',
    gradient:
      'radial-gradient(85.8% 629.17% at 39.39% -197.22%, rgba(255, 255, 255, 0) 0%, #B6B6B6 100%)',
    borderColor: 'rbg(230, 230, 230)',
    color: '#6B6B6B'
  },
  {
    name: 'Streaming',
    label: 'Streaming',
    gradient: 'linear-gradient(0deg, #F2FBF6, #F2FBF6)',
    borderColor: 'rgb(200, 237, 202)',
    color: '#65CB63'
  },
  {
    name: 'Investing',
    label: 'Investing',
    gradient: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    topBorderColor: '#36CD7C',
    color: '#fff'
  }
];

const CustomMenuItem = withStyles({
  root: {
    fontSize: '14px'
  }
})(MenuItem);

export default function SingleWeb3TrackPage() {
  const isLogin = useLogin();

  const classes = singleSongDetailPageStyles();
  const commonClasses = musicDaoPageStyles();

  const history = useHistory();
  const { shareMediaToSocial, shareMediaWithQrCode } = useShareMedia();
  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();
  const { showAlertMessage } = useAlertMessage();
  const user: any = useTypedSelector((state) => state.user);

  const { isSignedin } = useAuth();

  const params: any = useParams();
  const id = params?.id;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const dispatch = useDispatch();

  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>(
    []
  );
  // const [saleTableData, setSaleTableData] = useState<
  //   Array<Array<CustomTableCellInfo>>
  // >([]);
  const [nftActivityTableData, setNftActivityTableData] = useState<
    Array<Array<CustomTableCellInfo>>
  >([]);
  const [ownershipHistoryTableData, setOwnershipHistoryTableData] = useState<
    Array<Array<CustomTableCellInfo>>
  >([]);
  const [openBuyNowModal, setOpenBuyNowModal] = useState<boolean>(false);
  const [openMakeOfferModal, setOpenMakeOfferModal] = useState<boolean>(false);
  const [isSongLoading, setIsSongLoading] = useState<boolean>(false);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [songDetailData, setSongDetailData] = useState<any>(null);
  const [openShareMenu, setOpenShareMenu] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [openEditPriceModal, setOpenEditPriceModal] = useState<boolean>(false);
  const [openSellingOfferModal, setOpenSellingOfferModal] = useState<boolean>(
    false
  );
  const [openCancelSaleModal, setOpenCancelSaleModal] = useState<boolean>(
    false
  );
  const [openRemoveOfferModal, setOpenRemoveOfferModal] = useState<boolean>(
    false
  );
  const [openAcceptOfferModal, setOpenAcceptOfferModal] = useState<boolean>(
    false
  );
  const [selectedRemoveIndex, setSelectedRemoveIndex] = useState<number>(-1);
  const [refreshed, setRefreshed] = useState<boolean>(false);
  const [tokens, setTokens] = useState<any>([]);
  const anchorShareMenuRef = useRef<HTMLDivElement>(null);
  const [refreshedTime, setRefreshedTime] = useState<number>(0);
  const [songImageIPFS, setSongImageIPFS] = useState<any>();
  const { account } = useWeb3React();
  const [podImageIPFS, setPodImageIPFS] = useState<any>(null);
  const [isLoadingEditions, setIsLoadingEditions] = useState<boolean>(false);
  const [editions, setEditions] = useState<any[]>([]);

  const [openOwnersModal, setOpenOwnersModal] = useState<boolean>(false);
  const [
    openOwnerShipHistoryModal,
    setOpenOwnerShipHistoryModal
  ] = useState<boolean>(false);

  const [storedToRecently, setStoredToRecently] = useState<boolean>(false);
  const [openHistoryPanel, setOpenHistoryPanel] = useState<boolean>(true);

  useEffect(() => {
    setMultiAddr(`${getIPFSURL()}/api/v0`);

    const getSongDetail = async () => {
      setIsSongLoading(true);
      const response = await getWeb3Song(id);
      console.log(response)
      if (response.success) {
        let scanNetworkName = '';
        if (response.data.Chain === 'Polygon') scanNetworkName = 'Polygonscan';
        else if (response.data.Chain === 'Ethereum')
          scanNetworkName = 'Etherscan';
        else if (response.data.Chain === 'Binance') scanNetworkName = 'BscScan';
        setSongDetailData({
          ...response.data,
          scanNetworkName: scanNetworkName,
          Artist: response.data.Artist?.replace(' ,', ', ')
        });
      }
      setIsSongLoading(false);
    };
    getSongDetail();
  }, [refreshed, account]);

  //  blinding early access
  useEffect(() => {
    var bgColorIdx = 0;
    var colorIdx = 0;

    const intervalRef = setInterval(() => {
      var doc = document.getElementById('comingSoonTrax');
      const color = ['#ffffff'];
      const bgColor = ['#FF8E3C', '#ef43c9', '#7e85ff', '#7ed1ef', '#bf7eff'];
      if (doc) {
        doc.style.backgroundColor = bgColor[bgColorIdx];
      }
      if (bgColorIdx % bgColor.length === 0) {
        if (doc) {
          doc.style.color = color[colorIdx];
        }
        colorIdx = (colorIdx + 1) % color.length;
      }
      bgColorIdx = (bgColorIdx + 1) % bgColor.length;
    }, 500);

    return () => {
      clearInterval(intervalRef);
    };
  }, [refreshed]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setRefreshedTime((refreshedTime) => refreshedTime + 1);
    }, 60000);

    getAllTokenInfos().then((resp) => {
      if (resp.success && resp.tokens) {
        setTokens(resp.tokens);
      }
    });

    return () => clearInterval(timerId);
  }, []);

  const getTokenUrl = useCallback(
    (addr) => {
      if (!addr) {
        if (songDetailData.Chain == 'Ethereum') {
          return require('assets/tokenImages/ETH.webp');
        } else if (songDetailData.Chain == 'Polygon') {
          return require('assets/tokenImages/MATIC.webp');
        }
      }
      if (tokens.length == 0) return '';
      const token = tokens.find(
        (token) =>
          token.Address?.toLowerCase() === addr?.toLowerCase() ||
          token.Symbol?.toLowerCase() === addr?.toLowerCase()
      );
      return token?.ImageUrl ?? '';
    },
    [tokens, songDetailData]
  );

  const getTokenDecimals = useCallback(
    (addr) => {
      if (tokens.length == 0) return 0;
      const token = tokens.find(
        (token) =>
          token.Address?.toLowerCase() === addr?.toLowerCase() ||
          token.Symbol?.toLowerCase() === addr?.toLowerCase()
      );
      return token?.Decimals ?? 1;
    },
    [tokens]
  );

  useEffect(() => {
    setIsOwner(songDetailData?.OwnerAddress === account?.toLowerCase());
    if (songDetailData?.Image) {
      setSongImageIPFS(processImage(songDetailData?.Image));
    } else {
      if (ipfs && Object.keys(ipfs).length !== 0 && songDetailData) {
        getNFTImage(songDetailData);
      }
      if (songDetailData && songDetailData.podInfo && ipfs) {
        getPodImageIPFS(
          songDetailData.podInfo.newFileCID,
          songDetailData.podInfo.fileName
        );
      }
    }
  }, [songDetailData, ipfs]);

  useEffect(() => {
    refreshTableData(isOwner);
  }, [
    isOwner,
    songDetailData?.buyingOffers,
    songDetailData?.sellingOffers,
    songDetailData?.saleHistory
  ]);

  const shortId = (id) => {
    if (!id || id.length < 12) {
      return id;
    }
    return id.substring(0, 6) + '...' + id.substring(id.length - 4);
  };

  const refreshTableData = (_isOwner) => {
    if (songDetailData?.buyingOffers?.length > 0) {
      setTableData(
        songDetailData?.buyingOffers.map((row, index) => {
          return [
            {
              cellAlign: 'center',
              cell: (
                <Box
                  display="flex"
                  alignItems="center"
                  onClick={() =>
                    history.push(`/profile/${row?.userInfo?.urlSlug}`)
                  }
                >
                  <img
                    src={row?.userInfo?.avatar ?? getDefaultAvatar()}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '100vh'
                    }}
                    alt="avatar"
                  />
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    ml={1}
                  >
                    <Box>{row?.userInfo?.name || 'Name'}</Box>
                    <Box>{`${row.Beneficiary.slice(
                      0,
                      6
                    )}...${row.Beneficiary.slice(
                      row.Beneficiary.length - 6,
                      row.Beneficiary.length - 1
                    )}`}</Box>
                  </Box>
                </Box>
              )
            },
            {
              cellAlign: 'center',
              cell: row.Price / 10 ** getTokenDecimals(row.PaymentToken)
            },
            {
              cellAlign: 'center',
              cell: (
                <img
                  src={getTokenUrl(row.PaymentToken)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '100vh'
                  }}
                  alt="avatar"
                />
              )
              // cell: `${row.PaymentToken.slice(0, 6)}...${row.PaymentToken.slice(row.PaymentToken.length - 6, row.PaymentToken.length - 1)}`,
            },
            {
              cellAlign: 'center',
              cell: formatDateDefault(row.created)
            },
            {
              cellAlign: 'center',
              cell: _isOwner ? (
                <Box
                  display="flex"
                  justifyContent="end"
                  onClick={() => {
                    setSelectedRemoveIndex(index);
                    setOpenAcceptOfferModal(true);
                  }}
                >
                  <Box
                    bgcolor="#65CB63"
                    color="#fff"
                    borderRadius="100vh"
                    p="3px 10px"
                    width="80px"
                    style={{ cursor: 'pointer' }}
                  >
                    Accept
                  </Box>
                </Box>
              ) : row?.Beneficiary === account?.toLowerCase() ? (
                <Box
                  display="flex"
                  justifyContent="end"
                  onClick={() => {
                    setSelectedRemoveIndex(index);
                    setOpenRemoveOfferModal(true);
                  }}
                >
                  <Box
                    bgcolor="#F43E5F"
                    color="#fff"
                    borderRadius="100vh"
                    p="3px 10px"
                    width="80px"
                    style={{ cursor: 'pointer' }}
                  >
                    Remove
                  </Box>
                </Box>
              ) : (
                <></>
              )
            }
          ];
        })
      );
    } else {
      setTableData([]);
    }

    // if (songDetailData?.saleHistory?.length > 0) {
    //   setSaleTableData(
    //     songDetailData?.saleHistory.map((row, index) => {
    //       return [
    //         {
    //           cellAlign: 'center',
    //           cell: (
    //             <Box display="flex" alignItems="center">
    //               <img
    //                 src={row?.userInfo?.avatar ?? getDefaultAvatar()}
    //                 style={{
    //                   width: '40px',
    //                   height: '40px',
    //                   borderRadius: '100vh'
    //                 }}
    //                 alt="avatar"
    //               />
    //               <span style={{ marginLeft: '8px' }}>{`${row.Beneficiary.slice(
    //                 0,
    //                 6
    //               )}...${row.Beneficiary.slice(
    //                 row.Beneficiary.length - 6,
    //                 row.Beneficiary.length
    //               )}`}</span>
    //             </Box>
    //           )
    //         },
    //         {
    //           cellAlign: 'center',
    //           cell: row.Price
    //             ? row.Price / 10 ** getTokenDecimals(row.PaymentToken)
    //             : '-'
    //         },
    //         {
    //           cellAlign: 'center',
    //           cell: row.Price ? (
    //             <img
    //               src={getTokenUrl(row.PaymentToken)}
    //               style={{
    //                 width: '30px',
    //                 height: '30px',
    //                 borderRadius: '100vh'
    //               }}
    //               alt="avatar"
    //             />
    //           ) : (
    //             '-'
    //           )
    //         },
    //         {
    //           cellAlign: 'center',
    //           cell: (
    //             <div
    //               className={classes.typo3}
    //               style={{ cursor: 'pointer' }}
    //               onClick={() => handleGotoHash(row.hash)}
    //             >
    //               {row.hash
    //                 ? `${row.hash.slice(0, 6)}...${row.hash.slice(
    //                     row.hash.length - 6,
    //                     row.hash.length - 1
    //                   )}`
    //                 : ''}
    //             </div>
    //           )
    //         },
    //         {
    //           cellAlign: 'center',
    //           cell: formatDateDefault(row.created)
    //         }
    //       ];
    //     })
    //   );
    // } else {
    //   setSaleTableData([]);
    // }
    if (songDetailData?.saleHistory?.length > 0){
      setNftActivityTableData(
        songDetailData?.saleHistory?.map((item, index) => {
          const type = ['Sale', 'Transfer', 'Minted'][index % 3];
          return [
            {
              cellAlign: 'center',
              cell: (
                <Box
                  display="flex"
                  gridGap={10}
                  alignItems="center"
                  className="cursor-pointer"
                  onClick={() => { }}>
                  <Box width={26} display="flex" justifyContent="center">
                    <ActivityType type={type} />
                  </Box>
                  <Box className={classes.typo1} style={{ fontWeight: 700 }}>{item?.Type}</Box>
                </Box>
              )
            },
            {
              cellAlign: 'center',
              cell: (
                <Box
                  display="flex"
                  gridGap={8}
                  alignItems="center"
                >
                  <img
                    src={item?.avatar || getDefaultAvatar()}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '100vh'
                    }}
                    alt="avatar"
                  />
                  <Box className={classes.typo2}>{shortId(item?.Beneficiary)}</Box>
                </Box>
              )
            },
            {
              cellAlign: 'center',
              cell: (
                <Box className={classes.typo1} style={{ fontWeight: 700 }}>
                  {item?.Price}
                </Box>
              )
            },
            {
              cellAlign: 'center',
              cell: item.Price ? (
                <img
                  src={getTokenUrl(item.PaymentToken)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '100vh'
                  }}
                  alt="avatar"
                />
              ) : (
                '-'
              )
            },
            {
              cellAlign: 'center',
              cell: (
                <Box className={classes.typo1} style={{ fontWeight: 700 }}>
                  {formatDateDefault(item.created)}
                </Box>
              )
            }
          ];
        })
      );
    }
    if (songDetailData?.ownerHistory?.length > 0){
      setOwnershipHistoryTableData(
        songDetailData?.ownerHistory?.map((item, index) => {
          return [
            {
              cellAlign: 'center',
              cell: (
                <Box
                  display="flex"
                  alignItems="center"
                  className="cursor-pointer"
                  gridGap={8}
                  onClick={() => { }}
                >
                  <img
                    src={item?.avatar || getDefaultAvatar()}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '100vh'
                    }}
                    alt="avatar"
                  />
                  <Box className={classes.typo2}>{shortId(item.owner)}</Box>
                </Box>
              )
            },
            {
              cellAlign: 'center',
              cell: (
                <Box className={classes.typo1} style={{ fontWeight: 700 }}>
                  {formatDateDefault(item.timestamp)}
                </Box>
              )
            }
          ];
        })
      );
    }
  };

  const getNFTImage = async (data: any) => {
    if (
      data?.metadataPhoto?.newFileCID &&
      data?.metadataPhoto?.metadata?.properties?.name
    ) {
      let imageUrl = await getPhotoIPFS(
        data.metadataPhoto.newFileCID,
        data.metadataPhoto.metadata.properties.name,
        downloadWithNonDecryption
      );
      setSongImageIPFS(imageUrl);
    } else {
      setSongImageIPFS(getDefaultBGImage());
    }
  };

  const handleBtnRefresh = async () => {
    setTableLoading(true);
    const response = await refreshBuyingOffers({
      songId: songDetailData.Id
    });
    if (response.success) {
      let _songDetailData = JSON.parse(JSON.stringify(songDetailData));
      _songDetailData.buyingOffers = response.data.offers;
      setSongDetailData(_songDetailData);
    }
    setRefreshedTime(0);
    setTableLoading(false);
  };

  const handleGotoScan = () => {
    const isProd = process.env.REACT_APP_ENV === 'prod';
    const address = songDetailData.CollectionAddress;
    const tokenId = songDetailData.TokenId;
    if (songDetailData.Chain == 'Ethereum') {
      window.open(
        `https://${
          !isProd ? 'rinkeby.' : ''
        }etherscan.io/token/${address}?a=${tokenId}`,
        '_blank'
      );
    } else if (songDetailData.Chain == 'Polygon') {
      window.open(
        `https://${
          !isProd ? 'mumbai.' : ''
        }polygonscan.com/token/${address}?a=${tokenId}`,
        '_blank'
      );
    }
  };

  const handleGotoHash = (hash) => {
    const isProd = process.env.REACT_APP_ENV === 'prod';
    if (songDetailData.Chain == 'Ethereum') {
      window.open(
        `https://${!isProd ? 'rinkeby.' : ''}etherscan.io/tx/${hash}`,
        '_blank'
      );
    } else if (songDetailData.Chain == 'Polygon') {
      window.open(
        `https://${!isProd ? 'mumbai.' : ''}polygonscan.com/tx/${hash}`,
        '_blank'
      );
    }
  };

  const handleOpenIpfs = () => {
    window.open(songDetailData.TokenUrl, '_blank');
  };

  const handleOpensea = () => {
    const isProd = process.env.REACT_APP_ENV === 'prod';
    const address = songDetailData.podAddress
      ? songDetailData.podAddress
      : songDetailData.podInfo.id;
    window.open(
      `https://${!isProd ? 'testnets.' : ''}opensea.io/assets/${
        !isProd ? 'mumbai' : 'matic'
      }/${address}/${songDetailData.tokenId}`,
      '_blank'
    );
  };

  const showShareMenu = () => {
    setOpenShareMenu(true);
  };

  const handleCloseShareMenu = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorShareMenuRef.current &&
      anchorShareMenuRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpenShareMenu(false);
  };

  const handleListKeyDownShareMenu = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenShareMenu(false);
    }
  };

  const handleOpenQRCodeModal = () => {
    const link = `${window.location.origin}/#/music//web3-track/${id}`;
    shareMediaWithQrCode(songDetailData.Id, link, 'Media', 'MYX-SONGS');
  };

  const handleOpenShareModal = () => {
    const link = `${window.location.origin}/#/music/web3-track/${id}`;
    shareMediaToSocial(songDetailData.Id, 'Track', 'MYX-SONGS', link);
  };

  // const handleFruit = (type) => {
  //   if (
  //     songDetailData.fruits
  //       ?.filter((f) => f.fruitId === type)
  //       ?.find((f) => f.userId === user.id)
  //   ) {
  //     showAlertMessage('You had already given this fruit.', {
  //       variant: 'info'
  //     });
  //     return;
  //   }

  //   musicDaoFruitSongNFT(user.id, id, type).then((res) => {
  //     if (res.success) {
  //       const itemCopy = { ...songDetailData };
  //       itemCopy.fruits = [
  //         ...(itemCopy.fruits || []),
  //         { userId: user.id, fruitId: type, date: new Date().getTime() }
  //       ];
  //       setSongDetailData(itemCopy);
  //     }
  //   });
  // };

  const getTokenName = (addr) => {
    if (tokens.length == 0) return '';
    const token = tokens.find(
      (token) =>
        token.Address?.toLowerCase() === addr?.toLowerCase() ||
        token.Symbol?.toLowerCase() === addr?.toLowerCase()
    );
    return token?.Symbol ?? '';
  };

  const getTokenPrice = (price, addr) => {
    if (tokens.length == 0) return 0;
    const token = tokens.find(
      (token) =>
        token.Address?.toLowerCase() === addr?.toLowerCase() ||
        token.Symbol?.toLowerCase() === addr?.toLowerCase()
    );
    return token ? price / 10 ** token.Decimals : 0;
  };

  const refresh = () => {
    setRefreshed(!refreshed);
  };

  const ownerAddress = useMemo(
    () =>
      songDetailData?.OwnerAddress
        ? `${songDetailData?.OwnerAddress.substr(
            0,
            14
          )}......${songDetailData?.OwnerAddress.substr(-12)}`
        : '',
    [songDetailData]
  );

  const getPodImageIPFS = async (cid: string, fileName: string) => {
    if (cid && fileName) {
      let imageUrl = await getPhotoIPFS(
        cid,
        fileName,
        downloadWithNonDecryption
      );
      setPodImageIPFS(imageUrl);
    } else {
      setPodImageIPFS(getDefaultBGImage());
    }
  };

  const ownerAvatarURL = useMemo(
    () => songDetailData?.owner?.avatar ?? getDefaultAvatar(),
    [songDetailData]
  );

  const creatorAvatarURL = useMemo(
    () => songDetailData?.creator?.avatar ?? getDefaultAvatar(),
    [songDetailData]
  );

  const onClickAvatar = (type) => {
    if (type == 'owner') {
      if (songDetailData.owner.userId || songDetailData.owner.urlSlug) {
        history.push(
          `/profile/${
            songDetailData.owner.urlSlug ?? songDetailData.owner.userId
          }`
        );
        dispatch(setSelectedUser(songDetailData.owner.userId));
      } else if (songDetailData.podInfo) {
        history.push(`/capsules/${songDetailData.podInfo.id}`);
      }
    } else {
      if (songDetailData.creatorId || songDetailData.creator?.urlSlug) {
        history.push(
          `/profile/${
            songDetailData.creator?.urlSlug ?? songDetailData.creatorId
          }`
        );
        dispatch(setSelectedUser(songDetailData.creatorId));
      } else if (songDetailData.podInfo) {
        history.push(`/capsules/${songDetailData.podInfo.id}`);
      }
    }
  };

  const handleFeed = () => {
    // musicDaoSongFeed(songDetailData.Id);
    // if (!storedToRecently) {
    //   axios
    //     .post(`${URL()}/musicDao/song/updateRecentlySongAndListeningCount`, {
    //       data: {
    //         songId: songDetailData.Id,
    //         userId: user.id,
    //         isPublic: songDetailData.isPublic ?? false
    //       }
    //     })
    //     .then((res) => {
    //       if (res.data.success) {
    //         setStoredToRecently(true);
    //       }
    //     });
    // }
  };

  // const gotoListeners = () => {
  //   history.push(`/music/track/${id}/listener`);
  // };

  // const editionStyle = editionTypes[6];
  const editionStyle = useMemo(
    () => {
      if (
        songDetailData?.edition !== undefined &&
        songDetailData?.edition >= 0
      ) {
        switch (songDetailData?.edition) {
          case 0:
            return editionTypes[3]; // bronze
          case 1:
            return editionTypes[4]; // silver
          case 2:
            return editionTypes[1]; // gold
          case 2:
            return editionTypes[2]; // platinum
          default:
            editionTypes[0];
        }
      } else if (songDetailData?.isMakeStreaming === true)
        return editionTypes[5];
      return editionTypes[0];
    },
    // editionTypes.find(
    //   (v) => v.name.toLowerCase() === songDetailData?.category?.toLowerCase()
    // ) ?? editionTypes[0],
    [songDetailData]
  );

  const getEditions = () =>
    isLoadingEditions || editions.length > 0 ? (
      <div className={classes.offerTableSection}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mr={2}
        >
          <Box className={classes.typo5} ml={5}>
            <span style={{ color: Color.MusicDAOGreen }}>
              {isLoadingEditions ? <LoadingWrapper loading /> : editions.length}
            </span>{' '}
            Other editions of this song
          </Box>
          {editions.length > 5 && (
            <SecondaryButton
              className={commonClasses.showAll}
              size="medium"
              radius={29}
              onClick={() => history.push(`/music/track/${id}/editions`)}
              style={isMobile ? { display: 'flex' } : {}}
            >
              Show All
              <Box
                position="absolute"
                flexDirection="row"
                top={0}
                right={0}
                pr={2}
              >
                <ArrowLeftIcon />
              </Box>
            </SecondaryButton>
          )}
        </Box>
        <Box display="flex" className={`${classes.editions} editions`}>
          {(isLoadingEditions ? Array(4).fill({}) : editions.slice(0, 5)).map(
            (song, index) => (
              <Box ml={index > 0 ? 2 : 0} minWidth="260px">
                <ArtistSongCard
                  song={song}
                  isLoading={Object.entries(song).length === 0}
                  isEditions
                />
              </Box>
            )
          )}
        </Box>
      </div>
    ) : (
      <></>
    );

  return (
    <Suspense fallback={<Loading />}>
      <Box className={classes.root}>
        {isSongLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={1}
          >
            <CircularLoadingIndicator />
          </Box>
        ) : (
          <Box className={classes.infoContainer}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                style={{ cursor: 'pointer' }}
                onClick={() => history.goBack()}
              >
                <div>
                  <ArrowIcon color={'#fff'} />
                </div>
                <Box
                  color="#fff"
                  fontSize={14}
                  fontWeight={700}
                  ml="5px"
                  mb="4px"
                >
                  BACK
                </Box>
              </Box>
            </Box>
            {!isTablet && !isMobile && (
              <Box display="flex" justifyContent="space-between" mt={7}>
                <Box display="flex" flexDirection="column" width={305}>
                  <img src={songImageIPFS} className={classes.artistImage} />
                  <div className={classes.addressSection}>
                    <Box display="flex" flexDirection="column" mr={1}>
                      <div
                        className={classes.typo1}
                        style={{ color: '#fff' }}
                      >{`Preview on ${songDetailData?.scanNetworkName}`}</div>
                      <div
                        className={classes.typo3}
                        style={{ marginTop: '4px', maxWidth: 280 }}
                      >
                        {shortId(songDetailData?.collectionId)}
                      </div>
                    </Box>
                    <Box
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleGotoScan()}
                    >
                      <PagePreviewIcon />
                    </Box>
                  </div>
                  <div
                    className={classes.ipfsSection}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOpenIpfs()}
                  >
                    <div className={classes.typo1}>IPFS</div>
                    <PagePreviewSmallIcon />
                  </div>
                  <div className={classes.createdDateSection}>
                    <div className={classes.typo1}>Contract Address</div>
                    <div
                      className={classes.typo3}
                      style={{ marginTop: '4px', maxWidth: 280 }}
                    >
                      {shortId(songDetailData?.collectionId)}
                    </div>
                  </div>
                  <div className={classes.openseaSection}>
                    <div className={classes.typo1}>Chain</div>
                    <div className={classes.typo1}>{songDetailData?.Chain}</div>
                  </div>
                  {songDetailData?.proofOfAuthenticity && (
                    <div className={classes.proofSection}>
                      <div className={classes.typo1}>Proof of authencity</div>
                      <div
                        className={classes.typo1}
                        style={{ color: '#65CB63', marginTop: '4px' }}
                      >
                        {`${songDetailData?.proofOfAuthenticity.substr(0, 14)}
                      ...
                      ${songDetailData?.proofOfAuthenticity.substr(-12)}`}
                      </div>
                    </div>
                  )}
                </Box>
                <Box flex={1} ml={5} style={{ width: 'calc(100% - 305px)' }}>
                  <Box>
                    <Box className={classes.rightFix}>
                      <Box display="flex" justifyContent="space-between">
                        <Box className={classes.typo7}>
                          {songDetailData?.Name}
                        </Box>
                        <Box className={classes.typo8}>ERC721</Box>
                      </Box>
                      <Box className={classes.typo9} mt={2}>
                        {songDetailData?.collection?.name}
                      </Box>
                      <Box className={classes.description} mt={3}>
                        <Box className={classes.scrollContainer}>
                          <Box className={classes.typo4_1}>
                            {songDetailData?.Description}
                          </Box>
                        </Box>
                      </Box>

                      <Box display="flex" alignItems="center" mt={4}>
                        <Box ml={4}>
                          <ButtonMusicPlayer
                            isPlayerMeida={true}
                            media={songDetailData}
                            songId={
                              songDetailData?.Id ??
                              songDetailData?.songId ??
                              songDetailData?.draftId
                            }
                            buttonSize={3}
                          />
                        </Box>
                        <Box ml={4}>
                          <div ref={anchorShareMenuRef} onClick={showShareMenu}>
                            <ShareIcon />
                          </div>
                        </Box>
                        {openShareMenu && (
                          <Popper
                            open={openShareMenu}
                            anchorEl={anchorShareMenuRef.current}
                            transition
                            disablePortal={false}
                            placement="bottom"
                            modifiers={{
                              offset: {
                                enabled: true,
                                offset: '-50%, 0'
                              }
                            }}
                          >
                            {({ TransitionProps, placement }) => (
                              <Grow
                                {...TransitionProps}
                                style={{
                                  transformOrigin:
                                    placement === 'bottom'
                                      ? 'center top'
                                      : 'center bottom'
                                }}
                              >
                                <Paper className={classes.paper}>
                                  <ClickAwayListener
                                    onClickAway={handleCloseShareMenu}
                                  >
                                    <MenuList
                                      autoFocusItem={openShareMenu}
                                      id="menu-list-grow"
                                      onKeyDown={handleListKeyDownShareMenu}
                                    >
                                      <CustomMenuItem
                                        onClick={handleOpenShareModal}
                                      >
                                        <img
                                          src={require('assets/icons/butterfly.webp')}
                                          alt={'spaceship'}
                                          style={{
                                            width: 20,
                                            height: 20,
                                            marginRight: 5
                                          }}
                                        />
                                        Share on social media
                                      </CustomMenuItem>
                                      <CustomMenuItem
                                        onClick={handleOpenQRCodeModal}
                                      >
                                        <img
                                          src={require('assets/icons/qrcode_small.webp')}
                                          alt={'spaceship'}
                                          style={{
                                            width: 20,
                                            height: 20,
                                            marginRight: 5
                                          }}
                                        />
                                        Share With QR Code
                                      </CustomMenuItem>
                                    </MenuList>
                                  </ClickAwayListener>
                                </Paper>
                              </Grow>
                            )}
                          </Popper>
                        )}
                      </Box>
                    </Box>
                  </Box>
                  <div className={classes.currentPriceSection}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      pb={4}
                      borderBottom="1px solid #00000010"
                      mb={3}
                    >
                      <div className={classes.typo5}>Current Price</div>
                      <Box display="flex" alignItems="center">
                        <div className={classes.typo6}>
                          {songDetailData?.sellingOffer?.Price
                            ? `${getTokenName(
                                songDetailData?.sellingOffer.PaymentToken
                              )} ${getTokenPrice(
                                songDetailData?.sellingOffer.Price,
                                songDetailData?.sellingOffer.PaymentToken
                              )}`
                            : 'Not set'}
                        </div>
                      </Box>
                    </Box>
                    {isOwner && isSignedin ? (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        {songDetailData?.sellingOffer?.Price ? (
                          <div
                            className={classes.cancelSaleBtn}
                            onClick={() => setOpenCancelSaleModal(true)}
                          >
                            <img
                              src={DeleteIcon}
                              className={classes.cancelImg}
                            />
                            Cancel Sale
                          </div>
                        ) : null}
                        <div
                          className={classes.makeOffBtn}
                          onClick={() =>
                            songDetailData?.sellingOffer?.Price
                              ? setOpenEditPriceModal(true)
                              : setOpenSellingOfferModal(true)
                          }
                        >
                          {songDetailData?.sellingOffer?.Price
                            ? 'Edit Price'
                            : 'New Selling Offer'}
                        </div>
                      </Box>
                    ) : isSignedin ? (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        {songDetailData?.sellingOffer?.Price ? (
                          <div
                            className={classes.buyNowBtn}
                            onClick={() => setOpenBuyNowModal(true)}
                          >
                            Buy Now
                          </div>
                        ) : null}
                        <div
                          className={classes.makeOffBtn}
                          onClick={() => {
                            setOpenMakeOfferModal(true);
                          }}
                        >
                          Make Offer
                        </div>
                      </Box>
                    ) : null}
                  </div>
                  <div className={classes.offerTableSection}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box className={classes.typo5} ml={5}>
                        All Buy Offers
                      </Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        fontSize="12px"
                        mr={2}
                      >
                        <Box color="#7E7D95" mr={2}>
                          {`Last refreshed ${refreshedTime} mins ago`}
                        </Box>
                        {isSignedin && (
                          <Box
                            className={classes.refreshBtn}
                            onClick={() => handleBtnRefresh()}
                          >
                            <RefreshIcon />
                            <span>Refresh</span>
                          </Box>
                        )}
                      </Box>
                    </Box>
                    {tableLoading ? (
                      <Box display="flex" justifyContent="center">
                        <CircularLoadingIndicator />
                      </Box>
                    ) : (
                      <CustomTable
                        headers={TableHeaders}
                        rows={tableData}
                        placeholderText="No offers"
                        theme="transaction"
                      />
                    )}
                  </div>
                  {/* <div className={classes.offerTableSection}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box className={classes.typo5} ml={5}>
                        Sell History
                      </Box>
                    </Box>
                    <CustomTable
                      headers={SellTableHeaders}
                      rows={saleTableData}
                      placeholderText="No offers"
                      theme="transaction"
                    />
                  </div> */}
                  <div className={classes.offerTableSection}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box className={classes.typo5} ml={2} display="flex" gridGap={12} alignItems="center">
                        <ActivityIcon /> NFT Activity
                      </Box>
                    </Box>
                    <CustomTable
                      headers={NFTActivityTableHeaders}
                      rows={nftActivityTableData}
                      placeholderText="No activities"
                      theme="transaction"
                    />
                  </div>
                  <div className={classes.offerTableSection}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box className={classes.typo5} ml={2} display="flex" gridGap={12} alignItems="center">
                        <HistoryIcon /> Ownership History
                      </Box>
                      <Box
                        className={classes.typo1}
                        style={{
                          cursor: "pointer",
                          color: "#0D59EE",
                          fontWeight: 400,
                        }}
                        mr={2}
                        display="flex"
                        gridGap={8}
                        alignItems="center"
                        onClick={() => setOpenHistoryPanel(!openHistoryPanel)}>
                        {openHistoryPanel ? (
                          <>
                            <span>Hide</span>
                            <UpArrowIcon />
                          </>
                        ) : (
                          <>
                            <span>Show</span>
                            <DownArrwoIcon />
                          </>
                        )}
                      </Box>
                    </Box>
                    {openHistoryPanel && (
                      <CustomTable
                        headers={OwnershipHistoryTableHeaders}
                        rows={ownershipHistoryTableData}
                        placeholderText="No offers"
                        theme="transaction"
                      />
                    )}
                  </div>
                  {getEditions()}
                </Box>
              </Box>
            )}
            {isMobile && (
              <Box display="flex" flexDirection="column" mt={5}>
                <Box display="flex" flexDirection="column" mx={2}>
                  <img src={songImageIPFS} className={classes.artistImage} />
                  <div className={classes.ownerSection}>
                    <div className={classes.typo1}>Owner</div>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box display="flex" alignItems="center">
                        <Avatar
                          size={31}
                          rounded
                          image={ownerAvatarURL}
                          style={{ cursor: 'pointer' }}
                          onClick={() => onClickAvatar('owner')}
                        />
                        <div className={classes.typo2}>{ownerAddress}</div>
                      </Box>
                    </Box>
                  </div>
                  <div className={classes.addressSection}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      width="90%"
                      mr={1}
                    >
                      <div
                        className={classes.typo1}
                      >{`Preview on ${songDetailData?.scanNetworkName}`}</div>
                      <div
                        className={classes.typo3}
                        style={{ marginTop: '4px', maxWidth: 280 }}
                      >
                        {songDetailData?.nftAddress}
                      </div>
                    </Box>
                    <Box
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleGotoScan()}
                    >
                      <PagePreviewIcon />
                    </Box>
                  </div>
                  <div
                    className={classes.ipfsSection}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOpenIpfs()}
                  >
                    <div className={classes.typo1}>IPFS</div>
                    <PagePreviewSmallIcon />
                  </div>
                  <div className={classes.createdDateSection}>
                    <div className={classes.typo1}>Creation Date</div>
                    <Box className={classes.typo1}>
                      {formatDateDefault(songDetailData?.createdAt)}
                    </Box>
                  </div>
                  <div
                    className={classes.openseaSection}
                    onClick={() => handleOpensea()}
                  >
                    <div className={classes.typo1}>See on Opensea</div>
                    <OpenseaIcon />
                  </div>
                </Box>
                <Box display="flex" flexDirection="column" width={1} mt={4}>
                  <div className={classes.currentPriceSection}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      pb={3}
                      borderBottom="1px solid #00000010"
                      mb={2}
                    >
                      <div className={classes.typo5}>Current Price</div>
                      <Box display="flex" alignItems="center">
                        <div className={classes.typo6}>
                          {songDetailData?.sellingOffer?.Price
                            ? `${getTokenName(
                                songDetailData?.sellingOffer.PaymentToken
                              )} ${getTokenPrice(
                                songDetailData?.sellingOffer.Price,
                                songDetailData?.sellingOffer.PaymentToken
                              )}`
                            : 'Not set'}
                        </div>
                      </Box>
                    </Box>
                    {isOwner ? (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        {songDetailData?.sellingOffer?.Price ? (
                          <div
                            className={classes.cancelSaleBtn}
                            onClick={() => setOpenCancelSaleModal(true)}
                          >
                            <img
                              src={DeleteIcon}
                              className={classes.cancelImg}
                            />
                            Cancel Sale
                          </div>
                        ) : null}
                        <div
                          className={classes.makeOffBtn}
                          onClick={() =>
                            songDetailData?.sellingOffer?.Price
                              ? setOpenEditPriceModal(true)
                              : setOpenSellingOfferModal(true)
                          }
                        >
                          {songDetailData?.sellingOffer?.Price
                            ? 'Edit Price'
                            : 'New Selling Offer'}
                        </div>
                      </Box>
                    ) : (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        {songDetailData?.sellingOffer?.Price ? (
                          <div
                            className={classes.buyNowBtn}
                            onClick={() => setOpenBuyNowModal(true)}
                          >
                            Buy Now
                          </div>
                        ) : null}
                        <div
                          className={classes.makeOffBtn}
                          onClick={() => {
                            setOpenMakeOfferModal(true);
                          }}
                        >
                          Make Offer
                        </div>
                      </Box>
                    )}
                  </div>
                  <div className={classes.offerTableSection}>
                    <Box>
                      <Box className={classes.typo5} mx="20px">
                        All Buy Offers
                      </Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        fontSize="12px"
                        mx="20px"
                        mt={1}
                      >
                        <Box color="#7E7D95" mr={2}>
                          {`Last refreshed ${refreshedTime} mins ago`}
                        </Box>
                        {isSignedin && (
                          <Box
                            className={classes.refreshBtn}
                            onClick={() => handleBtnRefresh()}
                          >
                            <RefreshIcon />
                            <span>Refresh</span>
                          </Box>
                        )}
                      </Box>
                    </Box>
                    <CustomTable
                      headers={TableHeaders}
                      rows={tableData}
                      placeholderText="No offers"
                      theme="transaction"
                    />
                  </div>
                  {/* <div className={classes.offerTableSection}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box className={classes.typo5} ml={5}>
                        Sell History
                      </Box>
                    </Box>
                    <CustomTable
                      headers={SellTableHeaders}
                      rows={saleTableData}
                      placeholderText="No offers"
                      theme="transaction"
                    />
                  </div> */}
                  <div className={classes.offerTableSection}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box className={classes.typo5} ml={2} display="flex" gridGap={12} alignItems="center">
                        <ActivityIcon /> NFT Activity
                      </Box>
                    </Box>
                    <CustomTable
                      headers={NFTActivityTableHeaders}
                      rows={nftActivityTableData}
                      placeholderText="No activities"
                      theme="transaction"
                    />
                  </div>
                  <div className={classes.offerTableSection}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box className={classes.typo5} ml={2} display="flex" gridGap={12} alignItems="center">
                        <HistoryIcon /> Ownership History
                      </Box>
                      <Box
                        className={classes.typo1}
                        style={{
                          cursor: "pointer",
                          color: "#0D59EE",
                          fontWeight: 400,
                        }}
                        mr={2}
                        display="flex"
                        gridGap={8}
                        alignItems="center"
                        onClick={() => setOpenHistoryPanel(!openHistoryPanel)}>
                        {openHistoryPanel ? (
                          <>
                            <span>Hide</span>
                            <UpArrowIcon />
                          </>
                        ) : (
                          <>
                            <span>Show</span>
                            <DownArrwoIcon />
                          </>
                        )}
                      </Box>
                    </Box>
                    {openHistoryPanel && (
                      <CustomTable
                        headers={OwnershipHistoryTableHeaders}
                        rows={ownershipHistoryTableData}
                        placeholderText="No offers"
                        theme="transaction"
                      />
                    )}
                  </div>
                  {getEditions()}
                </Box>
              </Box>
            )}
            {isTablet && !isMobile && (
              <Box display="flex" flexDirection="column" mt={7}>
                <Box display="flex" alignItems="center">
                  <img src={songImageIPFS} className={classes.artistImage} />
                  <Box
                    ml="20px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <div className={classes.ownerSection}>
                      <div className={classes.typo1}>Owner</div>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box display="flex" alignItems="center">
                          <Avatar
                            size={31}
                            rounded
                            image={ownerAvatarURL}
                            style={{ cursor: 'pointer' }}
                            onClick={() => onClickAvatar('owner')}
                          />
                          <div className={classes.typo2}>{ownerAddress}</div>
                        </Box>
                        {/* {songDetailData?.creatorId !== user.id && (
                  <div className={classes.followBtn} onClick={handleFollow}>
                    {isUserFollowed(songDetailData?.creatorId) === 0 ? "Follow" : "Unfollow"}
                  </div>
                )} */}
                      </Box>
                    </div>
                    <div className={classes.addressSection}>
                      <Box display="flex" flexDirection="column" mr={1}>
                        <div
                          className={classes.typo1}
                        >{`Preview on ${songDetailData?.scanNetworkName}`}</div>
                        <div
                          className={classes.typo3}
                          style={{ marginTop: '4px', maxWidth: 280 }}
                        >
                          {songDetailData?.nftAddress}
                        </div>
                      </Box>
                      <Box
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleGotoScan()}
                      >
                        <PagePreviewIcon />
                      </Box>
                    </div>
                    <div
                      className={classes.ipfsSection}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleOpenIpfs()}
                    >
                      <div className={classes.typo1}>IPFS</div>
                      <PagePreviewSmallIcon />
                    </div>
                    <div className={classes.createdDateSection}>
                      <div className={classes.typo1}>Creation Date</div>
                      <Box className={classes.typo1}>
                        {formatDateDefault(songDetailData?.createdAt)}
                      </Box>
                    </div>
                    <div
                      className={classes.openseaSection}
                      onClick={() => handleOpensea()}
                    >
                      <div className={classes.typo1}>See on Opensea</div>
                      <OpenseaIcon />
                    </div>
                    <div className={classes.proofSection}>
                      <div className={classes.typo1}>Proof of authencity</div>
                      <div
                        className={classes.typo1}
                        style={{ color: '#65CB63', marginTop: '4px' }}
                      >
                        {songDetailData?.proofOfAuthenticity
                          ? `${songDetailData?.proofOfAuthenticity.slice(
                              0,
                              7
                            )}...${songDetailData?.proofOfAuthenticity.slice(
                              songDetailData?.proofOfAuthenticity.length - 5
                            )}`
                          : '0xeec9...82f8'}
                      </div>
                    </div>
                    {/* {isOwner && (
                    <div className={classes.listenerSection}>
                      <div className={classes.typo1}>Listeners Data</div>
                      <div className={classes.listenerBtn} onClick={gotoListeners}>
                        Show Listeners
                      </div>
                    </div>
                  )} */}
                  </Box>
                </Box>
                <Box display="flex" flexDirection="column" width={1} mt={3}>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Box
                      display="flex"
                      alignItems="center"
                      className={classes.meta}
                    >
                      <PlayIcon />
                      <span>{`${
                        songDetailData?.listenedCount ?? 'No'
                      } Plays`}</span>
                    </Box>
                    <div className={classes.divider} />
                    <Box
                      display="flex"
                      alignItems="center"
                      className={classes.meta}
                    >
                      <ViewIcon />
                      <span>{`${
                        songDetailData?.viewCount ?? 'No'
                      } Views`}</span>
                    </Box>
                  </Box>
                  <div className={classes.title}>{songDetailData?.Title}</div>
                  <div
                    className={classes.subtitle}
                    onClick={() => onClickAvatar('creator')}
                  >
                    {songDetailData?.Artist || songDetailData?.creator?.name}
                  </div>
                  <Box
                    display="flex"
                    pb={2}
                    mb={2}
                    mt={1}
                    borderBottom="1px solid #0000001A"
                  >
                    <Box
                      className={classes.typo4}
                      pr={3}
                      borderRight="1px solid #00000020"
                      mr={3}
                    >
                      {songDetailData?.AlbumName}
                    </Box>
                    <div className={classes.typo4}>{songDetailData?.Label}</div>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Box className={classes.tagLabel}>Genre</Box>
                    <Box className={classes.tag}>{songDetailData?.Genre}</Box>
                    <Box className={classes.tagLabel} ml={5}>
                      Mood
                    </Box>
                    <Box className={classes.tag}>
                      {songDetailData?.Mood}{' '}
                      {songDetailData?.Mood
                        ? MoodEmoji[
                            Mood.findIndex(
                              (mood) => mood === songDetailData.Mood
                            )
                          ]
                        : ''}
                    </Box>
                  </Box>
                  {songDetailData?.mediaData &&
                    songDetailData?.pricePerEdition?.length > 1 && (
                      <Box mt={4} className={classes.editionSection}>
                        <Box className={classes.editionLabel} mb={3}>
                          Available Editions
                        </Box>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          {PremiumType.map((title, i) => (
                            <Box key={`premiumType_${i}`} display="flex">
                              <img
                                src={require(`assets/icons/edition_${title.toLowerCase()}.webp`)}
                                alt="edition"
                                style={{
                                  width: 40,
                                  height: 40,
                                  marginRight: 16
                                }}
                              />
                              <Box textAlign="start">
                                <Box className={classes.editionAmount}>
                                  {songDetailData.mediaData.quantityPerEdition[
                                    i
                                  ] ?? 0}
                                </Box>
                                <Box className={classes.editionTitle}>
                                  {title}
                                </Box>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}
                  <Box mt={4}>
                    {isSignedin && (
                      <MusicPlayer
                        media={songDetailData?.metadataMedia}
                        isHls={true}
                        feed={handleFeed}
                        songId={songDetailData?.Id}
                      />
                    )}
                  </Box>
                  <div className={classes.currentPriceSection}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      pb={4}
                      borderBottom="1px solid #00000010"
                      mb={3}
                    >
                      <div className={classes.typo5}>Current Price</div>
                      <Box display="flex" alignItems="center">
                        <div className={classes.typo6}>
                          {songDetailData?.sellingOffer?.Price
                            ? `${getTokenName(
                                songDetailData?.sellingOffer.PaymentToken
                              )} ${getTokenPrice(
                                songDetailData?.sellingOffer.Price,
                                songDetailData?.sellingOffer.PaymentToken
                              )}`
                            : 'Not set'}
                        </div>
                      </Box>
                    </Box>
                    {isOwner ? (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        {songDetailData?.sellingOffer?.Price ? (
                          <div
                            className={classes.cancelSaleBtn}
                            onClick={() => setOpenCancelSaleModal(true)}
                          >
                            <img
                              src={DeleteIcon}
                              className={classes.cancelImg}
                            />
                            Cancel Sale
                          </div>
                        ) : null}
                        <div
                          className={classes.makeOffBtn}
                          onClick={() =>
                            songDetailData?.sellingOffer?.Price
                              ? setOpenEditPriceModal(true)
                              : setOpenSellingOfferModal(true)
                          }
                        >
                          {songDetailData?.sellingOffer?.Price
                            ? 'Edit Price'
                            : 'New Selling Offer'}
                        </div>
                      </Box>
                    ) : (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        {songDetailData?.sellingOffer?.Price ? (
                          <div
                            className={classes.buyNowBtn}
                            onClick={() => setOpenBuyNowModal(true)}
                          >
                            Buy Now
                          </div>
                        ) : null}
                        <div
                          className={classes.makeOffBtn}
                          onClick={() => {
                            setOpenMakeOfferModal(true);
                          }}
                        >
                          Make Offer
                        </div>
                      </Box>
                    )}
                  </div>
                  <div className={classes.offerTableSection}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box className={classes.typo5} ml={5}>
                        All Buy Offers
                      </Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        fontSize="12px"
                        mr={2}
                      >
                        <Box color="#7E7D95" mr={2}>
                          {`Last refreshed ${refreshedTime} mins ago`}
                        </Box>
                        {isSignedin && (
                          <Box
                            className={classes.refreshBtn}
                            onClick={() => handleBtnRefresh()}
                          >
                            <RefreshIcon />
                            <span>Refresh</span>
                          </Box>
                        )}
                      </Box>
                      <CustomTable
                        headers={TableHeaders}
                        rows={tableData}
                        placeholderText="No offers"
                        theme="transaction"
                      />
                    </Box>
                  </div>
                  {/* <div className={classes.offerTableSection}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box className={classes.typo5} ml={5}>
                        Sell History
                      </Box>
                    </Box>
                    <CustomTable
                      headers={SellTableHeaders}
                      rows={saleTableData}
                      placeholderText="No offers"
                      theme="transaction"
                    />
                  </div> */}
                  <div className={classes.offerTableSection}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box className={classes.typo5} ml={2} display="flex" gridGap={12} alignItems="center">
                        <ActivityIcon /> NFT Activity
                      </Box>
                    </Box>
                    <CustomTable
                      headers={NFTActivityTableHeaders}
                      rows={nftActivityTableData}
                      placeholderText="No activities"
                      theme="transaction"
                    />
                  </div>
                  <div className={classes.offerTableSection}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box className={classes.typo5} ml={2} display="flex" gridGap={12} alignItems="center">
                        <HistoryIcon /> Ownership History
                      </Box>
                      <Box
                        className={classes.typo1}
                        style={{
                          cursor: "pointer",
                          color: "#0D59EE",
                          fontWeight: 400,
                        }}
                        mr={2}
                        display="flex"
                        gridGap={8}
                        alignItems="center"
                        onClick={() => setOpenHistoryPanel(!openHistoryPanel)}>
                        {openHistoryPanel ? (
                          <>
                            <span>Hide</span>
                            <UpArrowIcon />
                          </>
                        ) : (
                          <>
                            <span>Show</span>
                            <DownArrwoIcon />
                          </>
                        )}
                      </Box>
                    </Box>
                    {openHistoryPanel && (
                      <CustomTable
                        headers={OwnershipHistoryTableHeaders}
                        rows={ownershipHistoryTableData}
                        placeholderText="No offers"
                        theme="transaction"
                      />
                    )}
                  </div>
                  {getEditions()}
                </Box>
              </Box>
            )}
          </Box>
        )}
        {openBuyNowModal && (
          <BuyNowModal
            open={openBuyNowModal}
            onClose={() => setOpenBuyNowModal(false)}
            songDetailData={songDetailData}
            refresh={refresh}
          />
        )}
        {openMakeOfferModal && (
          <MakeOfferModal
            open={openMakeOfferModal}
            onClose={() => setOpenMakeOfferModal(false)}
            songDetailData={songDetailData}
            refresh={refresh}
          />
        )}
        {openEditPriceModal && (
          <EditPriceModal
            open={openEditPriceModal}
            onClose={() => setOpenEditPriceModal(false)}
            songDetailData={songDetailData}
            refresh={refresh}
          />
        )}
        {openSellingOfferModal && (
          <SellingOfferModal
            open={openSellingOfferModal}
            onClose={() => setOpenSellingOfferModal(false)}
            songDetailData={songDetailData}
            refresh={refresh}
          />
        )}
        {openCancelSaleModal && (
          <CancelSellingModal
            open={openCancelSaleModal}
            onClose={() => setOpenCancelSaleModal(false)}
            songDetailData={songDetailData}
            refresh={refresh}
          />
        )}
        {openRemoveOfferModal && (
          <RemoveOfferModal
            open={openRemoveOfferModal}
            onClose={() => setOpenRemoveOfferModal(false)}
            refresh={refresh}
            songDetailData={songDetailData}
            index={selectedRemoveIndex}
          />
        )}
        {openAcceptOfferModal && (
          <AcceptOfferModal
            open={openAcceptOfferModal}
            onClose={() => setOpenAcceptOfferModal(false)}
            refresh={refresh}
            songDetailData={songDetailData}
            index={selectedRemoveIndex}
          />
        )}
        {openOwnersModal && (
          <OwnersModal
            open={openOwnersModal}
            onClose={() => setOpenOwnersModal(false)}
          />
        )}
        {openOwnerShipHistoryModal && (
          <OwnerShipHistoryModal
            open={openOwnerShipHistoryModal}
            onClose={() => setOpenOwnerShipHistoryModal(false)}
            songDetailData={songDetailData}
          />
        )}
      </Box>
    </Suspense>
  );
}

export const RefreshIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 8.25002C14.8166 6.93019 14.2043 5.70727 13.2575 4.76965C12.3107 3.83202 11.0818 3.23171 9.76025 3.06119C8.43869 2.89066 7.09772 3.15939 5.9439 3.82596C4.79009 4.49253 3.88744 5.51998 3.375 6.75002M3 3.75002V6.75002H6"
      stroke="black"
      strokeWidth="1.125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 9.75C3.18342 11.0698 3.7957 12.2928 4.74252 13.2304C5.68934 14.168 6.91818 14.7683 8.23975 14.9388C9.56131 15.1094 10.9023 14.8406 12.0561 14.1741C13.2099 13.5075 14.1126 12.48 14.625 11.25M15 14.25V11.25H12"
      stroke="black"
      strokeWidth="1.125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TokenIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
      fill="#F4B731"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.95775 6H11.8718C14.8605 6 17.1262 7.587 17.9692 9.8955H19.5V11.2913H18.2917C18.315 11.5118 18.327 11.7368 18.327 11.9648V11.9992C18.327 12.2557 18.312 12.5093 18.282 12.7568H19.5V14.1517H17.94C17.0752 16.4288 14.8275 18 11.8725 18H6.95775V14.1517H5.25V12.7568H6.95775V11.2913H5.25V9.89625H6.95775V6ZM8.331 14.1517V16.7482H11.871C14.0565 16.7482 15.6795 15.708 16.4347 14.1517H8.331ZM16.8555 12.7568H8.331V11.2913H16.8585C16.8893 11.5215 16.9058 11.7577 16.9058 11.9992V12.033C16.9058 12.2798 16.8885 12.5205 16.8555 12.756V12.7568ZM11.8725 7.24875C14.067 7.24875 15.6952 8.31675 16.446 9.89475H8.331V7.2495H11.871L11.8725 7.24875Z"
      fill="white"
    />
  </svg>
);

export const OpenseaIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_7431_101126)">
      <path
        d="M22.0004 11.0554C22.0004 16.9709 17.2043 21.767 11.2888 21.767C5.37323 21.767 0.577148 16.9709 0.577148 11.0554C0.577148 5.13983 5.37323 0.34375 11.2888 0.34375C17.2055 0.34375 22.0004 5.13983 22.0004 11.0554Z"
        fill="#2081E2"
      />
      <path
        d="M5.86199 11.4154L5.9082 11.3427L8.69471 6.98358C8.73544 6.91976 8.83118 6.92636 8.86199 6.99568C9.32751 8.03897 9.7292 9.33649 9.54102 10.1443C9.46068 10.4766 9.24058 10.9267 8.99295 11.3427C8.96105 11.4033 8.92583 11.4627 8.8884 11.5199C8.87079 11.5463 8.84108 11.5617 8.80916 11.5617H5.94341C5.86638 11.5617 5.82126 11.4781 5.86199 11.4154Z"
        fill="white"
      />
      <path
        d="M18.2824 12.2258V12.9158C18.2824 12.9554 18.2582 12.9906 18.223 13.0061C18.0073 13.0985 17.2688 13.4375 16.9618 13.8645C16.1782 14.9551 15.5795 16.5145 14.2413 16.5145H8.65835C6.67964 16.5145 5.07617 14.9056 5.07617 12.9202V12.8564C5.07617 12.8036 5.11908 12.7606 5.17191 12.7606H8.28419C8.34581 12.7606 8.39092 12.8179 8.38544 12.8784C8.36342 13.0809 8.40084 13.2878 8.49658 13.476C8.68147 13.8513 9.06445 14.0857 9.47824 14.0857H11.019V12.8828H9.49585C9.41772 12.8828 9.37151 12.7925 9.41663 12.7287C9.43312 12.7034 9.45185 12.677 9.47164 12.6473C9.61582 12.4426 9.82161 12.1246 10.0263 11.7625C10.1661 11.5182 10.3014 11.2573 10.4104 10.9954C10.4324 10.9481 10.45 10.8997 10.4676 10.8523C10.4973 10.7687 10.5281 10.6906 10.5501 10.6124C10.5722 10.5464 10.5898 10.4771 10.6074 10.4121C10.6591 10.1898 10.6811 9.95431 10.6811 9.71C10.6811 9.61426 10.6767 9.51411 10.6679 9.41837C10.6635 9.31382 10.6503 9.20926 10.6371 9.10471C10.6283 9.01227 10.6118 8.92092 10.5942 8.82518C10.5722 8.68542 10.5413 8.54676 10.5061 8.40698L10.494 8.35417C10.4676 8.25841 10.4456 8.16708 10.4148 8.07134C10.3278 7.77088 10.2277 7.47815 10.122 7.20413C10.0835 7.09517 10.0395 6.99062 9.99548 6.88608C9.93057 6.7287 9.86452 6.58564 9.804 6.45027C9.77319 6.38863 9.74678 6.3325 9.72036 6.27528C9.69065 6.21035 9.65984 6.14541 9.62901 6.0838C9.60701 6.03648 9.58169 5.99245 9.56408 5.94843L9.3759 5.60066C9.34948 5.55334 9.39351 5.49721 9.44523 5.51152L10.6228 5.83066H10.6261C10.6283 5.83066 10.6294 5.83178 10.6305 5.83178L10.7857 5.87469L10.9562 5.92313L11.019 5.94071V5.2408C11.019 4.90293 11.2897 4.62891 11.6243 4.62891C11.7915 4.62891 11.9434 4.69714 12.0524 4.80828C12.1613 4.91945 12.2295 5.07132 12.2295 5.2408V6.27969L12.355 6.31489C12.3649 6.31821 12.3748 6.32261 12.3836 6.3292C12.4144 6.35232 12.4584 6.38642 12.5146 6.42826C12.5586 6.46346 12.6059 6.50639 12.6631 6.55042C12.7765 6.64175 12.9119 6.75951 13.0604 6.89488C13.1 6.92899 13.1386 6.96421 13.1738 6.99943C13.3653 7.17771 13.5799 7.3868 13.7846 7.61792C13.8418 7.68285 13.8979 7.74888 13.9552 7.8182C14.0124 7.88864 14.0729 7.95797 14.1257 8.02732C14.1951 8.11976 14.2699 8.2155 14.3348 8.31565C14.3656 8.36297 14.4009 8.41139 14.4306 8.45872C14.5142 8.58526 14.588 8.71624 14.6584 8.8472C14.6881 8.90772 14.7189 8.97375 14.7453 9.03868C14.8235 9.21367 14.8851 9.39195 14.9247 9.57024C14.9368 9.60876 14.9456 9.65058 14.95 9.688V9.69681C14.9632 9.74962 14.9676 9.80574 14.972 9.86297C14.9896 10.0457 14.9808 10.2283 14.9412 10.4121C14.9247 10.4903 14.9027 10.564 14.8763 10.6421C14.8499 10.717 14.8235 10.7951 14.7894 10.8688C14.7233 11.0218 14.6452 11.1748 14.5527 11.3179C14.523 11.3707 14.4878 11.4268 14.4526 11.4796C14.4141 11.5358 14.3745 11.5886 14.3392 11.6403C14.2908 11.7063 14.2391 11.7757 14.1863 11.8373C14.1389 11.9022 14.0905 11.9672 14.0377 12.0244C13.964 12.1113 13.8935 12.1939 13.8198 12.2731C13.7758 12.3248 13.7285 12.3777 13.68 12.425C13.6327 12.4778 13.5843 12.5251 13.5403 12.5691C13.4665 12.6429 13.4049 12.7001 13.3532 12.7474L13.2321 12.8586C13.2145 12.874 13.1914 12.8828 13.1672 12.8828H12.2295V14.0857H13.4093C13.6734 14.0857 13.9244 13.9921 14.1268 13.8204C14.1962 13.7599 14.4988 13.498 14.8565 13.1029C14.8686 13.0897 14.884 13.0798 14.9016 13.0754L18.1602 12.1334C18.2208 12.1157 18.2824 12.162 18.2824 12.2258Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_7431_101126">
        <rect
          width="21.4232"
          height="21.4232"
          fill="white"
          transform="translate(0.577148 0.34375)"
        />
      </clipPath>
    </defs>
  </svg>
);

const MoreIcon = () => (
  <svg
    width="7"
    height="13"
    viewBox="0 0 7 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 11.5L6 6.5L1 1.5"
      stroke="#181818"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ShareIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="19.5" fill="white" />
    <circle cx="20" cy="20" r="19.5" stroke="#F0F5F8" />
    <circle cx="20" cy="20" r="19.5" stroke="#EEF2F7" />
    <g opacity="0.9">
      <path
        d="M22.0788 22.364L16.9285 19.9728M16.9212 18.0306L22.0764 15.6372M26.5 23.3333C26.5 24.53 25.4553 25.5 24.1667 25.5C22.878 25.5 21.8333 24.53 21.8333 23.3333C21.8333 22.1367 22.878 21.1667 24.1667 21.1667C25.4553 21.1667 26.5 22.1367 26.5 23.3333ZM26.5 14.6667C26.5 15.8633 25.4553 16.8333 24.1667 16.8333C22.878 16.8333 21.8333 15.8633 21.8333 14.6667C21.8333 13.47 22.878 12.5 24.1667 12.5C25.4553 12.5 26.5 13.47 26.5 14.6667ZM17.1667 19C17.1667 20.1966 16.122 21.1667 14.8333 21.1667C13.5447 21.1667 12.5 20.1966 12.5 19C12.5 17.8034 13.5447 16.8333 14.8333 16.8333C16.122 16.8333 17.1667 17.8034 17.1667 19Z"
        stroke="#081831"
        stroke-width="1.5"
      />
    </g>
  </svg>
);

const PlayIcon = () => (
  <svg
    width="70"
    height="70"
    viewBox="0 0 70 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="70" height="70" rx="35" fill="#57CB55" />
    <path
      d="M26.25 20.4165V20.4165C30.7652 29.45 30.8402 40.0657 26.4531 49.1621L26.25 49.5832L49.5833 34.9998L26.25 20.4165Z"
      fill="#F0F5F8"
    />
    <path
      d="M26.25 20.4165V20.4165C30.7652 29.45 30.8402 40.0657 26.4531 49.1621L26.25 49.5832L49.5833 34.9998L26.25 20.4165Z"
      fill="#EEF2F7"
    />
  </svg>
);

const StreamingIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.125 11.625C0.71025 11.625 0.375 11.289 0.375 10.875V7.125C0.375 6.711 0.71025 6.375 1.125 6.375C1.53975 6.375 1.875 6.711 1.875 7.125V10.875C1.875 11.289 1.53975 11.625 1.125 11.625Z"
      fill="#65CB63"
    />
    <path
      d="M3.375 14.625C2.96025 14.625 2.625 14.289 2.625 13.875V4.125C2.625 3.711 2.96025 3.375 3.375 3.375C3.78975 3.375 4.125 3.711 4.125 4.125V13.875C4.125 14.289 3.78975 14.625 3.375 14.625Z"
      fill="#65CB63"
    />
    <path
      d="M5.625 17.625C5.21025 17.625 4.875 17.289 4.875 16.875V1.125C4.875 0.711 5.21025 0.375 5.625 0.375C6.03975 0.375 6.375 0.711 6.375 1.125V16.875C6.375 17.289 6.03975 17.625 5.625 17.625Z"
      fill="#65CB63"
    />
    <path
      d="M7.875 16.875C7.46025 16.875 7.125 16.539 7.125 16.125V1.875C7.125 1.461 7.46025 1.125 7.875 1.125C8.28975 1.125 8.625 1.461 8.625 1.875V16.125C8.625 16.539 8.28975 16.875 7.875 16.875Z"
      fill="#65CB63"
    />
    <path
      d="M10.125 13.875C9.71025 13.875 9.375 13.539 9.375 13.125V4.875C9.375 4.461 9.71025 4.125 10.125 4.125C10.5397 4.125 10.875 4.461 10.875 4.875V13.125C10.875 13.539 10.5397 13.875 10.125 13.875Z"
      fill="#65CB63"
    />
    <path
      d="M12.375 16.875C11.9603 16.875 11.625 16.539 11.625 16.125V1.875C11.625 1.461 11.9603 1.125 12.375 1.125C12.7897 1.125 13.125 1.461 13.125 1.875V16.125C13.125 16.539 12.7897 16.875 12.375 16.875Z"
      fill="#65CB63"
    />
    <path
      d="M14.625 13.875C14.2103 13.875 13.875 13.539 13.875 13.125V4.875C13.875 4.461 14.2103 4.125 14.625 4.125C15.0397 4.125 15.375 4.461 15.375 4.875V13.125C15.375 13.539 15.0397 13.875 14.625 13.875Z"
      fill="#65CB63"
    />
    <path
      d="M16.875 11.625C16.4603 11.625 16.125 11.289 16.125 10.875V7.125C16.125 6.711 16.4603 6.375 16.875 6.375C17.2897 6.375 17.625 6.711 17.625 7.125V10.875C17.625 11.289 17.2897 11.625 16.875 11.625Z"
      fill="#65CB63"
    />
  </svg>
);
const DiamondIcon = () => (
  <svg
    width="20"
    height="16"
    viewBox="0 0 20 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.35629 5.03965L9.04469 15.7932L0.979492 5.03965H6.35629ZM10.8267 0.639648L12.5867 4.15965H7.41229L9.17229 0.639648H10.8267ZM12.7363 5.03965L9.99949 15.9846L7.26269 5.03965H12.7363ZM13.6427 5.03965H19.0195L10.9543 15.7932L13.6427 5.03965ZM18.8369 4.15965H13.5723L11.8123 0.639648H15.3169L18.8369 4.15965ZM4.68209 0.639648H8.18669L6.42669 4.15965H1.16209L4.68209 0.639648Z"
      fill="white"
    />
  </svg>
);

const ActivityType = ({ type = '' }) => {
  switch (type.toLowerCase()) {
    case 'sale':
      return (
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M7.18195 0.772987C7.54114 0.411305 8.0305 0.20856 8.53985 0.20856L16.2291 0.208496C16.9086 0.208496 17.5607 0.478839 18.0413 0.95942C18.5219 1.44 18.7922 2.09202 18.7922 2.7716V10.4609C18.7922 10.9703 18.5894 11.4596 18.2278 11.8188L12.2756 17.7748C11.6248 18.4269 10.7425 18.7923 9.82137 18.7923C8.90026 18.7923 8.01791 18.4269 7.36714 17.7748L1.22595 11.6336C0.5739 10.9828 0.208466 10.1005 0.208466 9.17938C0.208466 8.25827 0.5739 7.37592 1.22595 6.72515L7.18195 0.772987ZM15.6079 5.47437C15.6079 8.24875 11.4476 8.24875 11.4476 5.47437C11.4476 2.7 15.6079 2.7 15.6079 5.47437Z" fill="#0D59EE" />
        </svg>
      );

    case 'transfer':
      return (
        <svg width="25" height="15" viewBox="0 0 25 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.691341 10.994L6.58309 14.8455C7.11907 15.1773 7.78154 14.6921 7.60322 14.1063L7.19476 12.7037L14.6414 11.9386C14.9981 11.9127 15.2531 11.6068 15.2531 11.2751L15.2531 9.59146C15.2531 9.23483 14.9981 8.95388 14.6414 8.92797L7.19476 8.16287L7.60322 6.7602C7.78155 6.14853 7.09316 5.66336 6.58309 6.02101L0.691341 9.8465C0.283876 10.1274 0.283876 10.7142 0.691341 10.9941L0.691341 10.994Z" fill="#0D59EE" />
          <path d="M10.3578 6.09831L17.8044 6.8634L17.396 8.26608C17.2177 8.87775 17.9061 9.36292 18.4161 9.00526L24.3079 5.15377C24.7163 4.89874 24.7163 4.28707 24.3079 4.03204L18.4161 0.180541C17.8801 -0.151205 17.2177 0.333957 17.396 0.919726L17.8044 2.3224L10.3578 3.0875C10.0011 3.1134 9.7461 3.41925 9.7461 3.75099L9.7461 5.43461C9.7451 5.76636 10.0001 6.04727 10.3578 6.0981L10.3578 6.09831Z" fill="#0D59EE" />
        </svg>
      );

    case 'minted':
      return (
        <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.3538 20.2792C10.3538 19.7597 10.5239 19.274 10.8186 18.8815H6.16179C6.45532 19.274 6.62654 19.7597 6.62654 20.2792C6.62654 20.8966 6.38543 21.4813 5.94748 21.9251C5.64348 22.2233 5.27539 22.4318 4.87937 22.5331C4.84675 22.5413 4.81298 22.5471 4.77803 22.5471L3.49094 22.589L3.72856 23.5395H13.2509L13.4885 22.589L12.2014 22.5471C12.1676 22.5459 12.1327 22.5413 12.1001 22.5331C11.704 22.4306 11.336 22.2221 11.0378 21.9298C10.5951 21.4813 10.354 20.8966 10.354 20.2792H10.3538Z" fill="#0D59EE" />
          <path d="M1.61998 10.1128C1.80169 10.2945 2.09756 10.2945 2.27925 10.1128L5.64311 6.74892L4.32222 5.42804L0.958365 8.7919C0.776655 8.97361 0.776655 9.26947 0.958365 9.45116L1.61998 10.1128Z" fill="#0D59EE" />
          <path d="M9.62012 2.76881C9.80066 2.5871 9.80066 2.29239 9.61895 2.11071L8.95617 1.44793C8.86881 1.3594 8.75117 1.31165 8.62653 1.31165C8.50188 1.31165 8.38541 1.36057 8.29688 1.44909L8.08139 1.66574L9.40227 2.98663L9.62012 2.76881Z" fill="#0D59EE" />
          <path d="M9.20659 7.67613L10.3318 6.55095C10.5077 6.37507 10.6043 6.14094 10.6043 5.89169C10.6043 5.64242 10.5077 5.40829 10.3318 5.23242L5.83211 0.732767C5.65623 0.556884 5.42211 0.460205 5.17285 0.460205C4.9236 0.460205 4.69062 0.556884 4.51359 0.732767L3.38841 1.85795C3.21252 2.03383 3.11584 2.26796 3.11584 2.51721C3.11584 2.76648 3.21252 3.0006 3.38841 3.17648L7.88687 7.67613C8.25146 8.03956 8.84316 8.03956 9.20659 7.67613Z" fill="#0D59EE" />
          <path d="M15.0128 16.086H15.4787C16.4769 16.086 17.4111 15.6981 18.1123 14.9934C18.7075 14.4016 19.0768 13.6445 19.1781 12.8245H15.0139L15.0128 16.086Z" fill="#0D59EE" />
          <path d="M12.2176 17.9498H14.0812V12.8245H2.8992V17.9498H12.2176Z" fill="#0D59EE" />
        </svg>
      );
    default:
      break;
  }
  return (<></>);
}

const ActivityIcon = () => (
  <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.2949 0.451175C8.31565 0.451175 4.85232 2.72101 3.18705 6.03781L2.8254 5.39065C2.60651 4.98618 2.17942 4.73992 1.72141 4.75298C1.29075 4.7625 0.896999 4.99805 0.686434 5.3728C0.475866 5.74873 0.478248 6.20674 0.693572 6.58027L2.36859 9.56865C2.68623 10.1421 3.40119 10.361 3.9865 10.0635L6.96535 8.5408C7.26633 8.40162 7.49831 8.14702 7.60777 7.83416C7.71721 7.52011 7.69342 7.17627 7.54352 6.88007C7.39244 6.58504 7.12833 6.36258 6.81072 6.26741C6.49307 6.17105 6.15046 6.20793 5.86138 6.37091L5.76621 6.41849C7.1343 4.30094 9.53743 2.88756 12.2951 2.88756C16.5886 2.88756 20.0325 6.29119 20.0325 10.5013C20.0325 14.6769 16.6432 18.0602 12.3999 18.115C12.0763 18.1197 11.7682 18.253 11.5433 18.4849C11.3185 18.7169 11.1948 19.0286 11.1995 19.3522C11.2055 19.6746 11.3387 19.9827 11.5707 20.2076C11.8027 20.4324 12.1144 20.5561 12.438 20.5514C17.9698 20.48 22.4692 16.0011 22.4692 10.5013C22.4692 4.95636 17.8879 0.451172 12.2955 0.451172L12.2949 0.451175ZM12.3996 4.39142C12.076 4.39618 11.7679 4.52942 11.543 4.76139C11.3182 4.99337 11.1945 5.30507 11.2004 5.62865V10.5014C11.1992 10.8714 11.3681 11.2212 11.6572 11.4531L14.7027 13.8895C15.2274 14.3095 15.9947 14.2238 16.4158 13.6992C16.8357 13.1734 16.7501 12.406 16.2255 11.9861L13.6368 9.91136V5.6288C13.6416 5.29928 13.5131 4.98045 13.2799 4.74729C13.0467 4.51413 12.7291 4.38564 12.3996 4.39157V4.39142Z" fill="#0D59EE" />
  </svg>
);

const HistoryIcon = () => (
  <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.11049 19.4777C6.2785 19.3097 6.2785 19.0375 6.11049 18.8695L5.50231 18.2613C5.3343 18.0933 5.3343 17.8212 5.50231 17.6531C5.67032 17.4851 5.94248 17.4851 6.11049 17.6531L6.73539 18.2765C6.89732 18.4232 7.14591 18.424 7.30862 18.278L8.54322 17.045C8.71123 16.877 8.71123 16.6048 8.54322 16.4368L7.93504 15.8286C7.76703 15.6606 7.76703 15.3884 7.93504 15.2204C8.10305 15.0524 8.37521 15.0524 8.54322 15.2204L9.16812 15.8438C9.33613 15.9966 9.59766 15.9905 9.75959 15.8286L11.1295 14.4587C13.7333 15.4401 16.7871 14.8829 18.8823 12.7877C21.7355 9.93455 21.7355 5.30186 18.8823 2.44875C16.0292 -0.404355 11.3965 -0.404355 8.54344 2.44875C6.44895 4.54323 5.89178 7.59701 6.87244 10.2016L0.637062 16.437C0.535191 16.5388 0.491861 16.684 0.519223 16.8254L1.12741 19.8663C1.16086 20.0366 1.29389 20.1697 1.46419 20.2031L4.50511 20.8113C4.64575 20.8394 4.79171 20.7953 4.89359 20.6935L6.10995 19.4771L6.11049 19.4777ZM6.83659 7.80446L7.32769 7.31336C7.40827 7.23277 7.51775 7.18716 7.63179 7.18715L8.66951 7.18791L8.8991 6.95832C8.67104 6.47786 8.75466 5.8864 9.1515 5.48955C9.65477 4.98629 10.4728 4.98629 10.9761 5.48955C11.4793 5.99282 11.4793 6.81084 10.9761 7.3141C10.5792 7.71095 9.98776 7.79456 9.50729 7.5665L9.1515 7.92228C9.07092 8.00287 8.96145 8.04848 8.84741 8.04849L7.80968 8.04773L7.32769 8.52972C7.21442 8.64299 7.05402 8.67872 6.91032 8.63996C6.86851 8.36248 6.84341 8.08347 6.83734 7.80372L6.83659 7.80446ZM12.6903 14.4215C12.6516 14.2778 12.6873 14.1174 12.8006 14.0041L13.2826 13.5221L13.2818 12.4844C13.2826 12.3711 13.3274 12.2609 13.408 12.1803L13.7638 11.8245C13.5357 11.344 13.6194 10.7526 14.0162 10.3557C14.5195 9.85247 15.3375 9.85247 15.8407 10.3557C16.344 10.859 16.344 11.677 15.8407 12.1803C15.4439 12.5771 14.8525 12.6607 14.372 12.4327L14.1424 12.6623L14.1432 13.7C14.1424 13.8133 14.0975 13.9235 14.0169 14.0041L13.5258 14.4952C13.2461 14.4876 12.9671 14.4625 12.6896 14.4222L12.6903 14.4215ZM18.2652 2.45769C18.3724 2.55271 18.4765 2.65079 18.5784 2.75265C18.6803 2.85452 18.7783 2.95868 18.8734 3.06587L13.0531 8.88613C13.2812 9.36659 13.1976 9.95805 12.8007 10.3549C12.2974 10.8582 11.4794 10.8582 10.9762 10.3549C10.4729 9.85163 10.4729 9.03361 10.9762 8.53034C11.373 8.1335 11.9645 8.04989 12.4449 8.27794L18.2652 2.45769ZM12.1924 9.13864C12.3604 9.30665 12.3604 9.57882 12.1924 9.74683C12.0244 9.91484 11.7522 9.91484 11.5842 9.74683C11.4162 9.57882 11.4162 9.30665 11.5842 9.13864C11.7522 8.97063 12.0244 8.97063 12.1924 9.13864ZM9.75968 6.70591C9.59167 6.5379 9.59167 6.26574 9.75968 6.09773C9.92769 5.92972 10.1999 5.92972 10.3679 6.09773C10.5359 6.26574 10.5359 6.5379 10.3679 6.70591C10.1999 6.87392 9.92769 6.87392 9.75968 6.70591ZM14.6251 11.5714C14.4571 11.4034 14.4571 11.1312 14.6251 10.9632C14.7932 10.7952 15.0653 10.7952 15.2333 10.9632C15.4013 11.1312 15.4013 11.4034 15.2333 11.5714C15.0653 11.7394 14.7932 11.7394 14.6251 11.5714ZM17.5717 1.91947C17.5549 1.94532 17.5352 1.97116 17.5131 1.99321L15.8422 3.66418C15.7274 3.77898 15.5563 3.81927 15.402 3.76833L13.8291 3.24453L13.6611 3.41254C13.8891 3.893 13.8055 4.48446 13.4087 4.88131C12.9054 5.38457 12.0874 5.38457 11.5841 4.88131C11.0809 4.37804 11.0809 3.56002 11.5841 3.05676C11.981 2.65991 12.5724 2.57631 13.0529 2.80436L13.4087 2.44858C13.5235 2.33378 13.6945 2.29349 13.8488 2.34443L15.4217 2.86823L16.816 1.47396C17.076 1.60472 17.3284 1.75374 17.5724 1.91869L17.5717 1.91947ZM19.4107 3.75846C19.5764 4.00325 19.7254 4.25564 19.8554 4.51488L18.4611 5.90914L18.9849 7.48205C19.0366 7.63561 18.9963 7.80667 18.8808 7.92221L18.525 8.278C18.753 8.75846 18.6694 9.34991 18.2726 9.74676C17.7693 10.25 16.9513 10.25 16.448 9.74676C15.9448 9.2435 15.9448 8.42548 16.448 7.92221C16.8449 7.52537 17.4363 7.44176 17.916 7.67057L18.0848 7.5018L17.561 5.92889C17.5093 5.77533 17.5496 5.60428 17.6652 5.48873L19.3361 3.81775C19.3589 3.79495 19.3833 3.77518 19.4099 3.75922L19.4107 3.75846ZM12.7997 3.66407C12.9677 3.83208 12.9677 4.10424 12.7997 4.27225C12.6316 4.44026 12.3595 4.44026 12.1915 4.27225C12.0235 4.10424 12.0235 3.83208 12.1915 3.66407C12.3595 3.49606 12.6316 3.49606 12.7997 3.66407ZM17.6651 8.52953C17.8331 8.69754 17.8331 8.9697 17.6651 9.13771C17.4971 9.30572 17.2249 9.30572 17.0569 9.13771C16.8889 8.9697 16.8889 8.69754 17.0569 8.52953C17.2249 8.36152 17.4971 8.36152 17.6651 8.52953Z" fill="#0D59EE" />
  </svg>
);

const UpArrowIcon = () => (
  <svg
    width="8"
    height="5"
    viewBox="0 0 8 5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 4L4 1L1 4"
      stroke="#0D59EE"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DownArrwoIcon = () => (
  <svg
    width="8"
    height="6"
    viewBox="0 0 8 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1.60547L4 4.60547L7 1.60547"
      stroke="#0D59EE"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);