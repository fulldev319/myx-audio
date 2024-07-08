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
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import useTheme from '@material-ui/core/styles/useTheme';
import withStyles from '@material-ui/core/styles/withStyles';

import URL from 'shared/functions/getURL';
import { setSelectedUser } from 'store/actions/SelectedUser';
import {
  ArrowIcon,
  PagePreviewIcon,
  PagePreviewSmallIcon
} from '../../components/Icons/SvgIcons';

import { useLogin } from 'shared/hooks/useLogin';
import Box from 'shared/ui-kit/Box';
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
import { musicDaoSongFeed, getWeb3Song } from 'shared/services/API';
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
import { getAllTokenInfos } from 'shared/services/API/TokenAPI';
import { Color, SecondaryButton } from 'shared/ui-kit';
import { formatDateDefault } from 'shared/helpers';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';

import { ArrowLeftIcon } from '../GovernancePage/styles';
import DeleteIcon from 'assets/utilIcons/delete.webp';

import { singleSongDetailPageStyles } from '../SingleSongDetailPage/index.styles';
import { musicDaoPageStyles } from 'components/MusicDao/index.styles';

import { musicDaoGetEditionsOfSongAggregated } from 'shared/services/API';
import PlayIcon from 'components/MusicDao/components/Icons/PlayMetaIcon';
import ViewIcon from 'components/MusicDao/components/Icons/ViewMetaIcon';
import Loading from 'shared/ui-kit/Loading';
import MusicPlayer from 'components/MusicDao/components/MusicPlayer/MusicPlayer';

const ButtonMusicPlayer = lazy(
  () =>
    import('components/MusicDao/components/MusicPlayer/ButtonMusicPlayer')
);
const ArtistSongCard = lazy(
  () => import('components/MusicDao/components/Cards/ArtistSongCard')
);
const AcceptOfferModal = lazy(
  () => import('../SingleWeb3TrackPage/modals/AcceptOfferModal')
);
const OwnersModal = lazy(
  () => import('../SingleWeb3TrackPage/modals/OwnersModal')
);
const OwnerShipHistoryModal = lazy(
  () => import('../SingleWeb3TrackPage/modals/OwnerShipHistoryModal')
);
const BuyNowModal = lazy(
  () => import('../SingleWeb3TrackPage/modals/BuyNowModal')
);
const MakeOfferModal = lazy(
  () => import('../SingleWeb3TrackPage/modals/MakeOfferModal')
);
const EditPriceModal = lazy(
  () => import('../SingleWeb3TrackPage/modals/EditPriceModal')
);
const SellingOfferModal = lazy(
  () => import('../SingleWeb3TrackPage/modals/SellingOfferModal')
);
const CancelSellingModal = lazy(
  () => import('../SingleWeb3TrackPage/modals/CancelSellingModal')
);
const RemoveOfferModal = lazy(
  () => import('../SingleWeb3TrackPage/modals/RemoveOfferModal')
);

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

export default function SingleSongDetailPage() {
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
  const [saleTableData, setSaleTableData] = useState<
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

  useEffect(() => {
    const getEditions = async () => {
      setIsLoadingEditions(true);
      // get song list
      const response = await musicDaoGetEditionsOfSongAggregated(id);
      if (response.success) {
        const newSongs = response.data.tracks || [];
        if (newSongs.length > 0) {
          newSongs.forEach((v) => {
            v.curPrice = v?.sellingOffer?.Price
              ? `${getTokenName(v?.sellingOffer.PaymentToken)} ${getTokenPrice(
                  v?.sellingOffer.Price,
                  v?.sellingOffer.PaymentToken
                )}`
              : 'Not set';
          });
          setEditions(newSongs);
        }
      }
      setIsLoadingEditions(false);
    };
    if (tokens.length) {
      getEditions();
    }
  }, [tokens, id]);

  useEffect(() => {
    setMultiAddr(`${getIPFSURL()}/api/v0`);

    const getSongDetail = async () => {
      setIsSongLoading(true);
      const response = await getWeb3Song(id);
      console.log('Song detail', response);
      if (response.success) {
        let scanNetworkName = '';
        if (response.data.Network === 'POLYGON')
          scanNetworkName = 'Polygonscan';
        else if (response.data.Network === 'ETHEREUM')
          scanNetworkName = 'Etherscan';
        else if (response.data.Network === 'BINANCE')
          scanNetworkName = 'BscScan';
        setSongDetailData({
          ...response.data,
          scanNetworkName: scanNetworkName,
          Artist: response.data.Artist?.replace(' ,', ', ')
        });
      }
      setIsSongLoading(false);
    };
    getSongDetail();
  }, [refreshed, account, id]);

  useEffect(() => {
    getAllTokenInfos().then((resp) => {
      if (resp.success) {
        const tokenList = resp.tokens.filter(
          (item) => item.Symbol == 'USDT' && item.Network == 'Polygon'
        );
        setTokens(tokenList); // update token list
      }
    });
  }, []);

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
    setIsOwner(
      songDetailData?.OwnerAddress?.toLowerCase() === account?.toLowerCase()
    );
    if (songDetailData?.Image) {
      setSongImageIPFS(songDetailData?.Image);
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
                    history.push(`/profile/${row?.offerUserData?.urlSlug}`)
                  }
                  className="cursor-pointer"
                >
                  <img
                    src={row?.offerUserData?.avatar ?? getDefaultAvatar()}
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
                    <Box>{row?.offerUserData?.name || 'Name'}</Box>
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

    if (songDetailData?.saleHistory?.length > 0) {
      setSaleTableData(
        songDetailData?.saleHistory.map((row, index) => {
          return [
            {
              cellAlign: 'center',
              cell: (
                <Box
                  display="flex"
                  alignItems="center"
                  className="cursor-pointer"
                  onClick={() =>
                    history.push(`/profile/${row.offerUserData?.urlSlug}`)
                  }
                >
                  <img
                    src={row?.offerUserData?.avatar ?? getDefaultAvatar()}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '100vh'
                    }}
                    alt="avatar"
                  />
                  <span style={{ marginLeft: '8px' }}>
                    {row.offerUserData?.name}
                  </span>
                </Box>
              )
            },
            {
              cellAlign: 'center',
              cell: row.Price
                ? row.Price / 10 ** getTokenDecimals(row.PaymentToken)
                : '-'
            },
            {
              cellAlign: 'center',
              cell: row.Price ? (
                <img
                  src={getTokenUrl(row.PaymentToken)}
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
                <div
                  className={classes.typo3}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleGotoHash(row.hash)}
                >
                  {row.hash
                    ? `${row.hash.slice(0, 6)}...${row.hash.slice(
                        row.hash.length - 6,
                        row.hash.length - 1
                      )}`
                    : ''}
                </div>
              )
            },
            {
              cellAlign: 'center',
              cell: formatDateDefault(row.created)
            }
          ];
        })
      );
    } else {
      setSaleTableData([]);
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
    const address = songDetailData.podAddress
      ? songDetailData.podAddress
      : songDetailData.podInfo.id;
    window.open(
      `https://${!isProd ? 'mumbai.' : ''}polygonscan.com/token/${address}?a=${
        songDetailData.TokenId
      }`,
      '_blank'
    );
  };

  const handleGotoHash = (hash) => {
    const isProd = process.env.REACT_APP_ENV === 'prod';
    window.open(
      `https://${!isProd ? 'mumbai.' : ''}polygonscan.com/tx/${hash}`,
      '_blank'
    );
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
      }/${address}/${songDetailData.TokenId}`,
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
    const link = `${window.location.origin}/#/music/myx-track/${id}`;
    shareMediaWithQrCode(songDetailData.nftAddress, link, 'Media', 'MYX-SONGS');
  };

  const handleOpenShareModal = () => {
    const link = `${window.location.origin}/#/music/myx-track/${id}`;
    shareMediaToSocial(songDetailData.nftAddress, 'Track', 'MYX-SONGS', link);
  };

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
    musicDaoSongFeed(songDetailData.Id);
    if (!storedToRecently) {
      axios
        .post(`${URL()}/musicDao/song/updateRecentlySongAndListeningCount`, {
          data: {
            songId: songDetailData.Id,
            userId: user.id,
            isPublic: songDetailData.isPublic ?? false
          }
        })
        .then((res) => {
          if (res.data.success) {
            setStoredToRecently(true);
          }
        });
    }
  };

  const editionStyle = useMemo(
    () => {
      if (songDetailData?.editionType === 'Regular') return editionTypes[0];

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
            return editionTypes[0];
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
                  platform={true}
                />
              </Box>
            )
          )}
        </Box>
      </div>
    ) : (
      <></>
    );

  const directToPod = React.useCallback(() => {
    if (songDetailData?.podAddress)
      history.push(`/capsules/${songDetailData?.podAddress}`);
  }, [history, songDetailData]);

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
                  <ArrowIcon color={'white'} />
                </div>
                <Box
                  color="white"
                  fontSize={14}
                  fontWeight={700}
                  ml="5px"
                  mb="4px"
                >
                  BACK
                </Box>
              </Box>
              {songDetailData?.isMakeStreaming && !isMobile && (
                <Box className={classes.comingSoon}>
                  <div id="comingSoonTrax">Coming Soon</div>
                  <span>
                    This track will generate revenue while being streamed.
                  </span>
                </Box>
              )}
              <Box className={classes.flexBox}>
                <Box className={classes.svgBox}>
                  <div ref={anchorShareMenuRef} onClick={showShareMenu}>
                    <ShareIcon />
                  </div>
                </Box>
                {openShareMenu && (
                  <Popper
                    open={openShareMenu}
                    anchorEl={anchorShareMenuRef.current}
                    transition
                    placement="bottom-end"
                  >
                    {({ TransitionProps }) => (
                      <Fade {...TransitionProps}>
                        <Paper className={classes.paper}>
                          <ClickAwayListener onClickAway={handleCloseShareMenu}>
                            <MenuList
                              autoFocusItem={openShareMenu}
                              id="menu-list-grow"
                              onKeyDown={handleListKeyDownShareMenu}
                            >
                              <CustomMenuItem onClick={handleOpenShareModal}>
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
                              <CustomMenuItem onClick={handleOpenQRCodeModal}>
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
                      </Fade>
                    )}
                  </Popper>
                )}
              </Box>
            </Box>
            {songDetailData?.isMakeStreaming && isMobile && (
              <Box
                className={classes.comingSoon}
                mt={3}
                style={{ maxWidth: 'none' }}
              >
                <div id="comingSoonTrax">Coming Soon</div>
                <span>
                  This track will generate revenue while being streamed.
                </span>
              </Box>
            )}
            {!isTablet && !isMobile && (
              <Box display="flex" justifyContent="space-between" mt={7}>
                <Box display="flex" flexDirection="column" width={450}>
                  <img src={songImageIPFS} className={classes.artistImage} />
                  {editionStyle?.name !== 'Normal' && (
                    <div
                      className={classes.edition}
                      style={{
                        border: `1px solid ${editionStyle?.borderColor}`,
                        background: editionStyle?.gradient,
                        color: editionStyle?.color
                      }}
                    >
                      {editionStyle?.label}
                      {editionStyle?.name === 'Streaming' && (
                        <div style={{ position: 'absolute', top: 7, left: 20 }}>
                          <StreamingIcon />
                        </div>
                      )}
                      {editionStyle?.name === 'Investing' && (
                        <div style={{ position: 'absolute', top: 9, left: 20 }}>
                          <DiamondIcon />
                        </div>
                      )}
                    </div>
                  )}
                  <div className={classes.ownerSection}>
                    <div className={classes.typo1} style={{ color: 'white' }}>
                      Owner
                    </div>
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
                          style={{ cursor: 'pointer', color: 'white' }}
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
                        style={{ color: 'white' }}
                      >{`Preview on ${songDetailData?.scanNetworkName}`}</div>
                      <div
                        className={classes.typo3}
                        style={{ marginTop: '4px', maxWidth: 280 }}
                      >
                        {songDetailData?.podAddress}
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
                  {/* {isOwner && (
                  <div className={classes.listenerSection}>
                    <div className={classes.typo1}>Listeners Data</div>
                    <div className={classes.listenerBtn} onClick={gotoListeners}>
                      Show Listeners
                    </div>
                  </div>
                )} */}
                  {/* <div className={classes.leftGroupSection}>
                  <div className={classes.typo1}>Owners</div>
                  <Box display="flex" alignItems="center" style={{ cursor: "pointer" }} onClick={()=>{setOpenOwnersModal(true)}}>
                    <Box className={classes.typo1} mr={1}>5</Box>
                    <MoreIcon />
                  </Box>
                </div> */}
                  <div className={classes.leftGroupSection}>
                    <div className={classes.typo1}>Ownership History</div>
                    <Box
                      display="flex"
                      alignItems="center"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setOpenOwnerShipHistoryModal(true);
                      }}
                    >
                      <Box className={classes.typo1} mr={2}></Box>
                      <MoreIcon />
                    </Box>
                  </div>
                </Box>
                <Box flex={1} ml={5} style={{ width: 'calc(100% - 450px)' }}>
                  <Box
                    display="flex"
                    justifyContent={
                      songDetailData?.edition !== undefined &&
                      songDetailData?.editionType !== 'Regular'
                        ? 'space-between'
                        : 'flex-end'
                    }
                  >
                    {songDetailData?.edition !== undefined &&
                      songDetailData?.editionType !== 'Regular' && (
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          style={{
                            background: '#fff',
                            padding: '0 10px',
                            borderRadius: 5
                          }}
                        >
                          <span
                            className={classes.editionTag}
                            style={{ color: '#65CB63' }}
                          >
                            EDITION&nbsp;{songDetailData?.edition ?? 0}
                          </span>
                          {/* <span className={classes.editionTag}>
                      &nbsp;/&nbsp;25
                    </span> */}
                        </Box>
                      )}
                    {editions.length > 0 && (
                      <div className={classes.tag}>
                        {editions.length} editions
                      </div>
                    )}
                  </Box>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Box
                      display="flex"
                      alignItems="center"
                      className={classes.meta}
                    >
                      <PlayIcon fill="white" />
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
                      <ViewIcon fill="white" />
                      <span>{`${
                        songDetailData?.viewCount ?? 'No'
                      } Views`}</span>
                    </Box>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <div className={classes.title}>{songDetailData?.Title}</div>
                  </Box>
                  <Box display="flex" alignItems="center" my={0.5}>
                    <Avatar
                      size={31}
                      rounded
                      image={creatorAvatarURL}
                      style={{ cursor: 'pointer' }}
                      onClick={() => onClickAvatar('creator')}
                    />
                    <div
                      className={classes.subtitle}
                      onClick={() => onClickAvatar('creator')}
                    >
                      {songDetailData?.creator?.name}{' '}
                      {songDetailData?.creator?.artistId
                        ? `#${songDetailData?.creator?.artistId}`
                        : ''}
                    </div>
                  </Box>
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
                    songDetailData?.mediaData.quantityPerEdition?.length >
                      1 && (
                      <Box mt={4} className={classes.editionSection}>
                        <Box className={classes.editionLabel} mb={3}>
                          Available Editions
                        </Box>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-around"
                        >
                          {PremiumType.map((title, i) =>
                            Number(
                              songDetailData.mediaData.quantityPerEdition[i]
                            ) > 0 ? (
                              <Box key={title} display="flex">
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
                                    {
                                      songDetailData.mediaData
                                        .quantityPerEdition[i]
                                    }
                                  </Box>
                                  <Box className={classes.editionTitle}>
                                    {title}
                                  </Box>
                                </Box>
                              </Box>
                            ) : null
                          )}
                        </Box>
                      </Box>
                    )}
                  <Box mt={4} display="flex">
                    {isSignedin && (
                      // <ButtonMusicPlayer
                      //   media={songDetailData?.metadataMedia}
                      //   songId={songDetailData?.Id}
                      //   feed={handleFeed}
                      // />
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
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      {songDetailData?.podAddress && (
                        <button
                          className={classes.podBtn}
                          onClick={directToPod}
                        >
                          Open on Capsule
                        </button>
                      )}
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
                    </Box>
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
                  <div className={classes.offerTableSection}>
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
                  </div>
                  {getEditions()}
                </Box>
              </Box>
            )}
            {isMobile && (
              <Box display="flex" flexDirection="column" mt={5}>
                <Box display="flex" flexDirection="column">
                  <img src={songImageIPFS} className={classes.artistImage} />
                  <div className={classes.ownerSection}>
                    <div className={classes.typo1} style={{ color: 'white' }}>
                      Owner
                    </div>
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
                        style={{ color: 'white' }}
                      >{`Preview on ${songDetailData?.scanNetworkName}`}</div>
                      <div
                        className={classes.typo3}
                        style={{ marginTop: '4px', maxWidth: 280 }}
                      >
                        {songDetailData?.podAddress}
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
                </Box>
                <Box display="flex" flexDirection="column" width={1} mt={4}>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Box
                      display="flex"
                      alignItems="center"
                      className={classes.meta}
                    >
                      <PlayIcon fill="white" />
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
                      <ViewIcon fill="white" />
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
                    borderBottom="1px solid #ffffff1A"
                  >
                    <Box
                      className={classes.typo4}
                      pr={3}
                      borderRight="1px solid #ffffff20"
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
                          flexWrap="wrap"
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
                  <Box mt={4} display="flex">
                    {isSignedin && (
                      <ButtonMusicPlayer
                        media={songDetailData?.metadataMedia}
                        songId={songDetailData?.Id}
                        feed={handleFeed}
                        isFromPlayer
                      />
                    )}
                  </Box>
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
                    <Box
                      display="flex"
                      flexDirection="column"
                      // alignItems="center"
                      justifyContent="space-between"
                      // flexWrap="wrap"
                    >
                      {songDetailData?.podAddress && (
                        <button
                          className={classes.podBtn}
                          onClick={directToPod}
                          style={{ width: '100%' }}
                        >
                          Open on Capsule
                        </button>
                      )}
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
                    </Box>
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
                  <div className={classes.offerTableSection}>
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
                      <div className={classes.typo1} style={{ color: 'white' }}>
                        Owner
                      </div>
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
                      <Box display="flex" flexDirection="column" mr={1}>
                        <div
                          className={classes.typo1}
                          style={{ color: 'white' }}
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
                  </Box>
                </Box>
                <Box display="flex" flexDirection="column" width={1} mt={3}>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Box
                      display="flex"
                      alignItems="center"
                      className={classes.meta}
                    >
                      <PlayIcon fill="white" />
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
                      <ViewIcon fill="white" />
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
                  <Box mt={4} display="flex">
                    {isSignedin && (
                      <ButtonMusicPlayer
                        media={songDetailData?.metadataMedia}
                        songId={songDetailData?.Id}
                        feed={handleFeed}
                        isFromPlayer
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
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      {songDetailData?.podAddress && (
                        <button
                          className={classes.podBtn}
                          onClick={directToPod}
                        >
                          Open on Capsule
                        </button>
                      )}
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
                    </Box>
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
                  <div className={classes.offerTableSection}>
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
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="19"
    viewBox="0 0 20 19"
    fill="none"
  >
    <path
      d="M12.839 14.0074L6.46241 10.8192M6.45335 8.22965L12.8359 5.03836M18.3128 15.2999C18.3128 16.8954 17.0194 18.1888 15.4239 18.1888C13.8284 18.1888 12.535 16.8954 12.535 15.2999C12.535 13.7044 13.8284 12.411 15.4239 12.411C17.0194 12.411 18.3128 13.7044 18.3128 15.2999ZM18.3128 3.74436C18.3128 5.33985 17.0194 6.63325 15.4239 6.63325C13.8284 6.63325 12.535 5.33985 12.535 3.74436C12.535 2.14887 13.8284 0.855469 15.4239 0.855469C17.0194 0.855469 18.3128 2.14887 18.3128 3.74436ZM6.75727 9.52214C6.75727 11.1176 5.46387 12.411 3.86838 12.411C2.27289 12.411 0.979492 11.1176 0.979492 9.52214C0.979492 7.92665 2.27289 6.63325 3.86838 6.63325C5.46387 6.63325 6.75727 7.92665 6.75727 9.52214Z"
      stroke="white"
      strokeWidth="1.5"
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
