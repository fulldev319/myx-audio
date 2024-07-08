import React, { useEffect, useState, useContext } from 'react';
import ReactPlayer from 'react-player';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import Web3 from 'web3';
import * as API from 'shared/services/API/WalletAuthAPI';
import { setLoginBool } from 'store/actions/LoginBool';
import URL from 'shared/functions/getURL';
import IPFSURL from 'shared/functions/getIPFSBackendURL';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import {
  socket,
  setSocket,
  playerSocket,
  setPlayerSocket
} from 'components/Login/Auth';

import Fade from '@material-ui/core/Fade';
import { useCookies } from 'react-cookie';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { CircularProgress } from '@material-ui/core';

import MakeOfferModal from 'components/MusicDao/modals/MakeOfferModal';
import BuyNFTModal from 'components/MusicDao/modals/BuyNFTModal';
import { useTypedSelector } from 'store/reducers/Reducer';
import { getUser } from 'store/selectors';
import { setUser } from 'store/actions/User';

import { getAllTokenInfos } from 'shared/services/API/TokenAPI';
//import NoMetamaskModal from 'components/Connect/modals/NoMetamaskModal';
import ConnectWalletModal from '../../../../modals/ConnectWalletModal';
import Box from 'shared/ui-kit/Box';
import Avatar from 'shared/ui-kit/Avatar';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';
import { PrimaryButton } from 'shared/ui-kit';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import { toDecimals } from 'shared/functions/web3';
import { useUserConnections } from 'shared/contexts/UserConnectionsContext';
import { useAuth } from 'shared/contexts/AuthContext';
import { MediaPlayerKeyContext } from 'shared/contexts/MediaPlayerKeyContext';
import {
  musicDaoUpdatePlayCount,
  musicDaoGetSongNFTBySongId
} from 'shared/services/API/MusicDaoAPI';

import { useNftDetailStyles } from './index.styles';
import { getURLfromCID } from 'shared/functions/ipfs/upload2IPFS';
import { fLoader, pLoader, getPlayerKey } from 'shared/functions/ipfs/hls';

const hlsPlayerOptions = {
  file: {
    forceAudio: true,
    forceHLS: true,
    hlsOptions: {
      fLoader,
      pLoader,
      maxBufferLength: 60,
      maxBufferSize: 120 * 1000 * 1000
    },
    attributes: { controlsList: 'nodownload' }
  }
};

export const NftDetail = ({ pod, mediaIndex, editionIndex, refreshPod, setNoReloadPage }) => {
  const classes = useNftDetailStyles();
  const user = useTypedSelector(getUser);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const { isSignedin, setSignedin } = useAuth();
  const [signatureFail, setSignatureFail] = React.useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();
  const [connectWallet, setConnectWallet] = React.useState<boolean>(false);
  const signData = React.useRef();

  const { playerKeyIsReady, showPlayerKeyModal, setPlayerKeyIsReady } = useContext(MediaPlayerKeyContext);
  const [connected, setConnected] = React.useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);
  const key = getPlayerKey();

  const timerRef = React.useRef<any>();
  const playerTimerRef = React.useRef<any>();
  const dispatch = useDispatch();


  const playerAudio: any = React.useRef();
  const [playerState, setPlayerState] = React.useState({
    url: null,
    pip: false,
    playing: false,
    validated: true,
    controls: false,
    light: false,
    volume: 100,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    volumeOpen: false,
    dropdownOpen: false,
    fullscreen: false,
    seeking: false,
    playedSeconds: 0
  });

  const [openBuyNFTModal, setOpenBuyNFTModal] = useState(false);
  const [openMakeOfferModal, setOpenMakeOfferModal] = useState(false);

  const [tokens, setTokens] = useState<any[]>([]);
  const [token, setToken] = useState<any>();
  const [tokenPrice, setTokenPrice] = useState<number>(0);
  const [tokenName, setTokenName] = useState<string>('');

  // const { account } = useWeb3React();

  const { followUser, unfollowUser, isUserFollowed } = useUserConnections();
  const [isFollowing, setIsFollowing] = React.useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [hasSold, setHasSold] = useState<boolean>(false);
  const [editionImage, setEditionImage] = useState<any>(null);
  const [editionPercentage, setEditionPercentage] = useState<number>(100);
  const [songName, setSongName] = useState<string>('');

  const [selectedSong, setSelectedSong] = React.useState<any>();
  const [isShowPostNote, setShowPostNote] = React.useState<boolean>(false);
  const { account, active, library } = useWeb3React();

  useEffect(() => {
    getAllTokenInfos().then((resp) => {
      if (resp.success) {
        const tokenList = resp.tokens.filter(
          (item) => item.Symbol === 'USDT' && item.Network === 'Polygon'
        );
        setTokens(tokenList); // update token list
      }
    });
  }, []);

  useEffect(() => {
    if (!isSignedin) {
      return;
    }
    handlePlay();
  }, [user]);

  useEffect(() => {
    if (!playerKeyIsReady) {
      return;
    }
    handlePlay();
  }, [playerKeyIsReady]);

  useEffect(() => {
    if (
      pod?.Medias?.length > 0 &&
      pod?.Medias[mediaIndex] &&
      pod?.Medias[mediaIndex].quantitySoldPerEdition.length > 0 &&
      pod?.Medias[mediaIndex].quantitySoldPerEdition[editionIndex] !== undefined
    ) {
      const soldCount = Number(
        pod?.Medias[mediaIndex].quantitySoldPerEdition[editionIndex]
      );
      if (soldCount > 0) setHasSold(true);
      else setHasSold(false);
    } else {
      setHasSold(true);
    }
    if (pod?.Medias && pod.Medias[mediaIndex]?.songId) {
      musicDaoGetSongNFTBySongId(pod.Medias[mediaIndex]?.songId).then((res) => {
        if (res.success) {
          if (res.data.metadataMedia?.newFileCID) {
            const url = `${getURLfromCID(res.data.metadataMedia?.newFileCID)}/${
              res.data.metadataMedia?.metadata.properties.name
            }`;
            setSelectedSong({
              url
            });
            localStorage.setItem(
              'playlistCID',
              res.data.metadataMedia?.newFileCID
            );
          }
        }
      });
    }
  }, [pod, pod?.Medias, mediaIndex, editionIndex]);

  useEffect(() => {
    if (pod && pod.Medias.length > 0) {
      getTokenInfo(
        pod?.Medias.length > 0
          ? Number(pod?.Medias[mediaIndex]?.pricePerEdition[editionIndex] ?? 0)
          : 0,
        pod.fundingToken
      );
    }
  }, [tokens, pod, pod?.Medias, mediaIndex, editionIndex]);

  useEffect(() => {
    // set song title
    if (pod?.Medias?.length > 0 && pod?.Medias[mediaIndex]) {
      setSongName(pod?.Medias[mediaIndex].title ?? '');
    } else {
      setSongName('');
    }

    // set edition image
    if (
      pod?.Medias?.length > 0 &&
      pod?.Medias[mediaIndex] &&
      pod?.Medias[mediaIndex].imageURLPerEdition?.length > 0 &&
      pod?.Medias[mediaIndex].imageURLPerEdition[editionIndex]
    ) {
      setEditionImage(pod?.Medias[mediaIndex].imageURLPerEdition[editionIndex]);
    } else {
      setEditionImage(pod?.imageUrl ?? null);
    }

    // set edition percentage
    if (
      pod?.Medias?.length > 0 &&
      pod?.Medias[mediaIndex] &&
      pod?.Medias[mediaIndex].percentagePerEdition?.length > 0 &&
      pod?.Medias[mediaIndex].percentagePerEdition[editionIndex]
    ) {
      const percentage =
        Number(pod?.Medias[mediaIndex].percentagePerEdition[editionIndex]) /
        100;
      setEditionPercentage(percentage);
    } else {
      setEditionPercentage(100);
    }
  }, [pod, pod?.Medias, mediaIndex, editionIndex]);

  useEffect(() => {
    if (pod.CreatorsData && pod.CreatorsData[0].id) {
      setIsFollowing(isUserFollowed(pod.CreatorsData[0].id));
    }
  }, [pod.CreatorsData, isUserFollowed]);

  const onFollowUser = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!pod.CreatorsData[0].id) return;

    setIsLoading(true);
    if (!isFollowing) {
      followUser(pod.CreatorsData[0].id, true).then((_) => {
        setIsFollowing(2);
        setIsLoading(false);
      });
    } else {
      unfollowUser(pod.CreatorsData[0].id).then((_) => {
        setIsFollowing(0);
        setIsLoading(false);
      });
    }
  };

  const getTokenInfo = async (price, addr) => {
    if (tokens.length == 0) {
      setToken(undefined);
      setTokenName('');
      setTokenPrice(0);
    } else {
      const token = tokens.find(
        (token) => token.Address?.toLowerCase() === addr?.toLowerCase()
      );
      if (token) {
        setToken(token);
        setTokenName(token.Symbol);

        /// Hardcode USDT decimals
        setTokenPrice(Number(toDecimals(price, 6)));
      }
    }
  };

  const handleIPFSLink = (tokenURI) => {
    if (tokenURI) {
      window.open(tokenURI, '_blank');
    }
  };

  const handleGotoScan = () => {
    const isProd = process.env.REACT_APP_ENV === 'prod';
    window.open(
      `https://${!isProd ? 'mumbai.' : ''}polygonscan.com/token/${
        pod.collectionWithRoyalty
      }`,
      '_blank'
    );
  };

  const handleOpensea = () => {
    const isProd = process.env.REACT_APP_ENV === 'prod';
    window.open(
      `https://${!isProd ? 'testnets.' : ''}opensea.io/assets/${
        !isProd ? 'mumbai' : 'matic'
      }/${pod.collectionWithRoyalty}/1`,
      '_blank'
    );
  };

  const handleConnectWallet = () => {
    if (active) {
       if (account) {
         onGetTrax();
       }
     } else {
       setConnectWallet(true);
     }
  };

  const handleSignIn = React.useCallback(async () => {
    const res: any = signData.current;
    if (res && account) {
      setSignedin(true);
      if (!socket) {
        const sock = io(URL(), {
          query: { token: Cookies.get('accessToken') },
          transports: ['websocket']
        });
        sock.on('connected', () => {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
        });
        sock.connect();
        setSocket(sock);

        sock.on('disconnect', () => {
          timerRef.current = setInterval(() => {
            sock.connect();
          }, 5000);
        });
      }
      if (socket) {
        socket.emit('add user', res.userData.id);
      }
      if (!playerSocket) {
        const sock = io(IPFSURL(), {
          query: { token: Cookies.get('accessToken') || '' },
          transports: ['websocket']
        });
        sock.on('connected', () => {
          if (playerTimerRef.current) {
            clearInterval(playerTimerRef.current);
          }
        });
        sock.connect();
        setPlayerSocket(sock);
        sock.on('disconnect', () => {
          playerTimerRef.current = setInterval(() => {
            sock.connect();
          }, 5000);
        });
      }
      dispatch(setUser(res.userData));
      localStorage.setItem('address', account);
      localStorage.setItem('userId', res.userData.id);
      localStorage.setItem('userSlug', res.userData.urlSlug ?? res.userData.id);

      axios.defaults.headers.common['Authorization'] =
        'Bearer ' + Cookies.get('accessToken');
      dispatch(setLoginBool(true));
    }
  }, [account, setSignedin, setUser]);

  const onGetTrax = React.useCallback(async () => {
    try {
      setShowPostNote(false);
      if (account && library) {
        const web3 = new Web3(library.provider);
        const res = await API.signInWithMetamaskWallet(account, web3, 'Myx');
        if (res.isSignedIn) {
          signData.current = res;
          setCookie('accessToken', res.accessToken);
          handleSignIn();
        } else {
          if (res.message) {
            setSignatureFail(true);
            showAlertMessage(res.message, { variant: 'error' });
          } else {
            showAlertMessage('Connect the metamask', { variant: 'error' });
          }
        }
      }
    } catch (err) {}
  }, [
    setShowPostNote,
    account,
    library,
    setCookie,
    handleSignIn,
    setSignatureFail,
    showAlertMessage
  ]);

  const handlePlay = () => {
    if (!isSignedin){
      setNoReloadPage(true);
      handleConnectWallet();
      return;
    }



    if (!key || !playerKeyIsReady) {
      setPlayerKeyIsReady(false);
      setNoReloadPage(true);
      showPlayerKeyModal();
      return;
    }

    if (selectedSong && selectedSong.url) {
      if (!playerState.playing && pod?.Medias[mediaIndex].id)
        musicDaoUpdatePlayCount({ songId: pod.Medias[mediaIndex].id });
      setPlayerState({ ...playerState, playing: !playerState.playing });
    }
  };

  const totalAmount = React.useMemo(
    () =>
      pod?.Medias?.length > 0
        ? Number(pod?.Medias[mediaIndex]?.quantityPerEdition[editionIndex] ?? 0)
        : 0,
    [pod, mediaIndex, editionIndex]
  );

  const remainAmount = React.useMemo(
    () =>
      pod?.Medias?.length > 0
        ? Math.max(
            Number(
              pod?.Medias[mediaIndex]?.quantityPerEdition[editionIndex] ?? 0
            ) -
              Number(
                pod?.Medias[mediaIndex]?.quantitySoldPerEdition[editionIndex] ??
                  0
              ),
            0
          )
        : 0,
    [pod, mediaIndex, editionIndex]
  );

  return (
    <Box>
      <Box mb={2}>
        <Box className={classes.mainCard}>
          <Grid container>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <Box width="100%" height="325px" position="relative">
                <SkeletonBox
                  loading={!editionImage}
                  image={editionImage}
                  width={1}
                  height={1}
                  style={{
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    overflow: 'hidden',
                    borderRadius: 16
                  }}
                />
                {selectedSong && (
                  <Box className={classes.playerButton} onClick={handlePlay}>
                    {playerState.playing ? (
                      <>
                        <PauseIcon color={'#fff'} />
                      </>
                    ) : (
                      <>
                        <PlayIcon color={'#fff'} />
                      </>
                    )}
                  </Box>
                )}
                <img
                  onClick={() => handleOpensea()}
                  src={require('assets/icons/opensea_large.webp')}
                  alt="marker-image"
                  style={{
                    cursor: 'pointer',
                    position: 'absolute',
                    top: -20,
                    right: isMobile ? -10 : -32,
                    width: 60,
                    height: 60
                  }}
                />
                {isSignedin && playerKeyIsReady && selectedSong && (
                  <ReactPlayer
                    height={0}
                    width={0}
                    config={hlsPlayerOptions}
                    onContextMenu={(e) => e.preventDefault()}
                    url={selectedSong.url}
                    volume={playerState.volume / 100}
                    className="react-player"
                    ref={playerAudio}
                    playing={playerState.playing && playerState.validated}
                    onPause={() =>
                      setPlayerState({ ...playerState, playing: false })
                    }
                    onPlay={() =>
                      setPlayerState({ ...playerState, playing: true })
                    }
                    onProgress={(_) => {}}
                    onDuration={(_) => {}}
                    onError={(err, data, hls, global) => {
                      console.log('ReactPlayer-Couldn’t decrypt the content', {
                        err,
                        data,
                        hls,
                        global
                      });
                      if (data?.details === 'keyLoadError') {
                        console.log('Signature Verification Failed');
                        // history.push("/");
                      }
                    }}
                  />
                )}
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={5}
              lg={6}
              style={{
                paddingLeft: isMobile ? 16 : 48,
                paddingRight: isMobile ? 16 : isTablet ? 48 : 0,
                paddingTop: 24,
                paddingBottom: 24
              }}
            >
              <Box
                // mb={2}
                style={{ fontSize: 22, fontWeight: 600, color: '#2D3047' }}
              >
                {songName}
              </Box>
              <Box
                mb={2}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
              >
                <Box display="flex" alignItems="center" mt={2}>
                  <Avatar
                    image={pod.CreatorsData[0]?.imageUrl ?? getDefaultAvatar()}
                    size={40}
                    rounded={true}
                    bordered={true}
                  />
                  <Box
                    ml={2}
                    display="flex"
                    alignItems="center"
                    style={{ fontSize: isTablet ? 12 : 14, color: '#0D59EE' }}
                  >
                    {pod.CreatorsData[0]?.address
                      ? `${pod.CreatorsData[0]?.address.slice(
                          0,
                          10
                        )}...${pod.CreatorsData[0]?.address.slice(
                          pod.CreatorsData[0]?.address.length - 7,
                          pod.CreatorsData[0]?.address.length - 1
                        )}`
                      : ''}
                  </Box>
                </Box>
                {isSignedin &&
                  (isLoading ? (
                    <CircularProgress style={{ color: '#B1FF00' }} />
                  ) : (
                    user.id !== pod.CreatorsData[0]?.id && (
                      <PrimaryButton
                        size="medium"
                        isRounded
                        onClick={onFollowUser}
                        style={{
                          height: 32,
                          background: '#EFF2F8',
                          color: '#7E7D95',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginLeft: isTablet ? 8 : 0,
                          marginTop: 16
                        }}
                      >
                        {isFollowing === 0
                          ? 'Follow'
                          : isFollowing === 1
                          ? 'Cancel request'
                          : 'Unfollow'}
                      </PrimaryButton>
                    )
                  ))}
              </Box>
              <Box className={classes.priceBox}>
                <Box style={{ fontSize: 14, color: '#7E7D95' }}>Price</Box>
                <Box
                  style={{ fontSize: 24, fontWeight: 'bold', color: '#2D3047' }}
                >
                  {tokenPrice} {tokenName}
                </Box>
              </Box>
              <Box mt={1.5} mb={3} className={classes.divider} />
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box style={{ fontSize: 14, color: '#7E7D95' }}>
                  Royalty Share
                </Box>
                <Box
                  style={{ fontSize: 24, fontWeight: 'bold', color: '#2D3047' }}
                >
                  {pod?.Medias.length > 0
                    ? Number(pod?.Medias[mediaIndex]?.royaltyPercent ?? 0) / 100
                    : 100}{' '}
                  %
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              lg={3}
              style={{
                padding: isMobile ? '24px 16px' : '24px 48px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around'
              }}
            >
              <Box className={classes.soldAmount}>
                {!!remainAmount ? (
                  <>
                    {remainAmount}
                    <span>&nbsp;/&nbsp;</span>
                    <span>{totalAmount}</span>
                    <br />
                    <div>REMAINING</div>
                  </>
                ) : (
                  <>
                    {totalAmount} {totalAmount > 1 ? 'COPIES' : 'COPY'}
                  </>
                )}
              </Box>
              {isSignedin && (
                <>
                  <PrimaryButton
                    size="medium"
                    isRounded
                    onClick={() => {
                      handleOpensea();
                      // setOpenMakeOfferModal(true);
                    }}
                    disabled={hasSold}
                    style={{
                      width: '100%',
                      height: 50,
                      background: '#FFFFFF',
                      border: '1px solid #54658F',
                      color: '#54658F',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textTransform: 'uppercase'
                    }}
                  >
                    <Box mr={2}>Make Offer</Box>
                    <TagIcon />
                  </PrimaryButton>
                  <PrimaryButton
                    size="medium"
                    isRounded
                    onClick={() => setOpenBuyNFTModal(true)}
                    style={{
                      width: '100%',
                      height: 50,
                      background: '#0D59EE',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textTransform: 'uppercase',
                      marginLeft: isTablet ? 0 : 8,
                      marginTop: isTablet ? 8 : 0
                    }}
                    disabled={!remainAmount}
                  >
                    <Box mr={2}>BUY NFT</Box>
                    {!!remainAmount && <BuyIcon />}
                  </PrimaryButton>
                </>
              )}
            </Grid>
          </Grid>
          {!remainAmount && (
            <img
              src={require('assets/musicDAOImages/sold_out.svg')}
              style={{
                position: 'absolute',
                right: -24,
                top: 16
              }}
            />
          )}
        </Box>
      </Box>
      <Box>
        <Grid container spacing={isMobile ? 1 : 4}>
          <Grid item xs={4} sm={5} md={2}>
            <Box
              className={classes.subCard}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <StreamingIcon />
              <Box mt="4px" display="flex" alignItems="center">
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: 11,
                    letterSpacing: '0.33em',
                    textTransform: 'uppercase',
                    color: '#0D59EE',
                    marginTop: 4
                  }}
                >
                  {editionPercentage}%&nbsp;
                </span>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  title={
                    'This is the share of total streaming percentage that this NFT edition receives'
                  }
                  classes={{ popper: classes.myTooltip }}
                >
                  <div>
                    <InfoIcon />
                  </div>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={8} sm={7} md={4}>
            <Box className={classes.subCard}>
              <Box>
                <Box mb={0.5}>Preview on Polygoscan</Box>
                <Box color="#0D59EE">
                  {pod.PodAddress
                    ? `${pod.PodAddress.slice(0, 10)}...${pod.PodAddress.slice(
                        pod.PodAddress.length - 7,
                        pod.PodAddress.length - 1
                      )}`
                    : ''}
                </Box>
              </Box>
              <Box
                onClick={() => handleGotoScan()}
                style={{ cursor: 'pointer' }}
              >
                <ShareIcon />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={8} sm={7} md={4}>
            <Box className={classes.subCard}>
              <Box>Listeners Map</Box>
              <Box className={classes.comingTag}>Coming Soon</Box>
            </Box>
          </Grid>
          <Grid item xs={4} sm={5} md={2}>
            <Box className={classes.subCard}>
              <Box>IPFS</Box>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (pod?.Medias.length > 0) {
                    handleIPFSLink(
                      pod?.Medias[mediaIndex]?.tokenURIPerEdition[editionIndex]
                    );
                  }
                }}
              >
                <ShareIcon />
              </div>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {openMakeOfferModal && (
        <MakeOfferModal
          songDetailData={undefined}
          open={openMakeOfferModal}
          onClose={() => setOpenMakeOfferModal(false)}
          refresh={() => {}}
        />
      )}
      {openBuyNFTModal && (
        <BuyNFTModal
          open={openBuyNFTModal}
          onClose={() => setOpenBuyNFTModal(false)}
          pod={pod}
          mediaIndex={mediaIndex}
          editionIndex={editionIndex}
          token={token}
          tokenPrice={tokenPrice}
          tokenName={tokenName}
          refreshPod={refreshPod}
        />
      )}
      <ConnectWalletModal
        open={connectWallet}
        handleClose={() => setConnectWallet(false)}
        setConnected={setConnected}
      />
    </Box>
  );
};

const TagIcon = () => (
  <svg
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.4104 10.5421L10.4137 1.53884C10.0538 1.17871 9.55391 0.958533 9.00391 0.958334L2.00391 0.955802C0.903906 0.955404 0.00358071 1.85508 0.00318282 2.95508L0.000650812 9.95508C0.000451868 10.5051 0.220271 11.0052 0.590137 11.3753L9.58688 20.3785C9.94675 20.7387 10.4467 20.9589 10.9967 20.9591C11.5467 20.9593 12.0468 20.7394 12.4069 20.3696L19.4094 13.3721C19.7795 13.0122 19.9997 12.5123 19.9999 11.9623C20.0001 11.4123 19.7703 10.9022 19.4104 10.5421ZM3.5021 5.95634C2.6721 5.95604 2.00234 5.2858 2.00264 4.4558C2.00294 3.6258 2.67318 2.95604 3.50318 2.95634C4.33318 2.95664 5.00294 3.62689 5.00264 4.45689C5.00234 5.28689 4.3321 5.95664 3.5021 5.95634Z"
      fill="#54658F"
    />
  </svg>
);

const BuyIcon = () => (
  <svg
    width="20"
    height="19"
    viewBox="0 0 20 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.4975 15.0832L18.4971 16.0832C18.4967 17.1832 17.5964 18.0828 16.4964 18.0824L2.49642 18.0774C1.38642 18.077 0.496744 17.1767 0.497142 16.0767L0.502206 2.07666C0.502604 0.97666 1.39293 0.0769821 2.50293 0.0773836L16.5029 0.0824476C17.6029 0.0828455 18.5026 0.983171 18.5022 2.08317L18.5018 3.08317L9.50184 3.07992C8.39184 3.07951 7.50152 3.97919 7.50112 5.07919L7.49823 13.0792C7.49783 14.1792 8.3875 15.0795 9.4975 15.0799L18.4975 15.0832ZM9.49823 13.0799L19.4982 13.0835L19.5011 5.08353L9.50112 5.07992L9.49823 13.0799ZM13.4991 10.5814C12.6691 10.5811 11.9994 9.91082 11.9997 9.08082C12 8.25082 12.6702 7.58106 13.5002 7.58136C14.3302 7.58166 15 8.2519 14.9997 9.0819C14.9994 9.9119 14.3291 10.5817 13.4991 10.5814Z"
      fill="white"
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
      fill="#0D59EE"
    />
    <path
      d="M3.375 14.625C2.96025 14.625 2.625 14.289 2.625 13.875V4.125C2.625 3.711 2.96025 3.375 3.375 3.375C3.78975 3.375 4.125 3.711 4.125 4.125V13.875C4.125 14.289 3.78975 14.625 3.375 14.625Z"
      fill="#0D59EE"
    />
    <path
      d="M5.625 17.625C5.21025 17.625 4.875 17.289 4.875 16.875V1.125C4.875 0.711 5.21025 0.375 5.625 0.375C6.03975 0.375 6.375 0.711 6.375 1.125V16.875C6.375 17.289 6.03975 17.625 5.625 17.625Z"
      fill="#0D59EE"
    />
    <path
      d="M7.875 16.875C7.46025 16.875 7.125 16.539 7.125 16.125V1.875C7.125 1.461 7.46025 1.125 7.875 1.125C8.28975 1.125 8.625 1.461 8.625 1.875V16.125C8.625 16.539 8.28975 16.875 7.875 16.875Z"
      fill="#0D59EE"
    />
    <path
      d="M10.125 13.875C9.71025 13.875 9.375 13.539 9.375 13.125V4.875C9.375 4.461 9.71025 4.125 10.125 4.125C10.5397 4.125 10.875 4.461 10.875 4.875V13.125C10.875 13.539 10.5397 13.875 10.125 13.875Z"
      fill="#0D59EE"
    />
    <path
      d="M12.375 16.875C11.9603 16.875 11.625 16.539 11.625 16.125V1.875C11.625 1.461 11.9603 1.125 12.375 1.125C12.7897 1.125 13.125 1.461 13.125 1.875V16.125C13.125 16.539 12.7897 16.875 12.375 16.875Z"
      fill="#0D59EE"
    />
    <path
      d="M14.625 13.875C14.2103 13.875 13.875 13.539 13.875 13.125V4.875C13.875 4.461 14.2103 4.125 14.625 4.125C15.0397 4.125 15.375 4.461 15.375 4.875V13.125C15.375 13.539 15.0397 13.875 14.625 13.875Z"
      fill="#0D59EE"
    />
    <path
      d="M16.875 11.625C16.4603 11.625 16.125 11.289 16.125 10.875V7.125C16.125 6.711 16.4603 6.375 16.875 6.375C17.2897 6.375 17.625 6.711 17.625 7.125V10.875C17.625 11.289 17.2897 11.625 16.875 11.625Z"
      fill="#0D59EE"
    />
  </svg>
);

const InfoIcon = () => (
  <svg
    width="14"
    height="13"
    viewBox="0 0 14 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.648 4.772C7.04 4.772 7.304 4.516 7.304 4.132C7.304 3.756 7.04 3.5 6.648 3.5C6.264 3.5 6 3.756 6 4.132C6 4.516 6.264 4.772 6.648 4.772ZM6.12 9.484H7.168V5.404H6.12V9.484Z"
      fill="#0D59EE"
    />
    <circle cx="7" cy="6.5" r="6" stroke="#0D59EE" />
  </svg>
);

const ShareIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 16H2V2H9V0H2C0.89 0 0 0.9 0 2V16C0 17.1 0.89 18 2 18H16C17.1 18 18 17.1 18 16V9H16V16ZM11 0V2H14.59L4.76 11.83L6.17 13.24L16 3.41V7H18V0H11Z"
      fill="#707582"
    />
  </svg>
);

const PlayIcon = ({ color = '#fff' }) => (
  <svg
    width="13"
    height="16"
    viewBox="0 0 13 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.5241 0.937906C0.857828 0.527894 0 1.00724 0 1.78956V14.2104C0 14.9928 0.857827 15.4721 1.5241 15.0621L11.6161 8.85166C12.2506 8.46117 12.2506 7.53883 11.6161 7.14834L1.5241 0.937906Z"
      fill={color}
    />
  </svg>
);
const PauseIcon = ({ color = '#fff' }) => (
  <svg
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="15px"
    height="15px"
    viewBox="0 0 277.338 277.338"
  >
    <g>
      <path
        d="M14.22,45.665v186.013c0,25.223,16.711,45.66,37.327,45.66c20.618,0,37.339-20.438,37.339-45.66V45.665
c0-25.211-16.721-45.657-37.339-45.657C30.931,0,14.22,20.454,14.22,45.665z"
        fill={color}
      />
      <path
        d="M225.78,0c-20.614,0-37.325,20.446-37.325,45.657V231.67c0,25.223,16.711,45.652,37.325,45.652s37.338-20.43,37.338-45.652
V45.665C263.109,20.454,246.394,0,225.78,0z"
        fill={color}
      />
    </g>
  </svg>
);
